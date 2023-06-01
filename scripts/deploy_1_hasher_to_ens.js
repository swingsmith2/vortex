// test/Box.js
// Load dependencies
const { ethers, network, upgrades } = require("hardhat");
const fs = require("fs");
const path = require("path");
const BigNumber = require('bignumber.js');
const util = require("ethereumjs-util");

const jsonPath = path.join(__dirname, '..', 'build', 'Hasher.json');
const outputPath = path.join(__dirname, '..', 'build', 'Addresses.txt')

function calculateAddress(sender, nonce) {
    // console.log("sender: "+sender+" nonce: "+nonce)
    let addr2 = util.generateAddress(util.toBuffer(sender), util.toBuffer(ethers.utils.hexValue(nonce))).toString("hex");
    // console.log(addr2);
    return '0x' + addr2
}
async function getPendingNonce(address) {
    let nonce = await ethers.provider.getTransactionCount(address, 'pending')
    return nonce
}

async function main() {
    //hasher
    const jsonStrBuffer = fs.readFileSync(jsonPath, 'utf8');
    // console.log(jsonStrBuffer.toString());
    let obj = JSON.parse(jsonStrBuffer.toString())

    let signers = await ethers.getSigners();
    let owner = signers[0]
    let ownerAddress = signers[0].address
    let nonce = await getPendingNonce(ownerAddress)

    let calculateHasherAddress = calculateAddress(ownerAddress, nonce)

    let Hasher = new ethers.ContractFactory(obj.abi, obj.bytecode, owner)
    let hasher = await Hasher.deploy();
    await hasher.deployed();

    if (hasher.address.toLowerCase().toString() === calculateHasherAddress.toLowerCase().toString())
        console.log("发布地址与预先计算地址一致，hasher: "+hasher.address.toString()+" calculate address: "+calculateHasherAddress)
    else console.log("发布地址与预先计算地址不一致，hasher: "+hasher.address.toString()+" calculate address: "+calculateHasherAddress)

    fs.appendFileSync(outputPath, "\n/********************* Start ********************/\n")
    let d = "Hasher deployed to: " + hasher.address + "\n"
    console.log(d);
    fs.appendFileSync(outputPath, d)

    // //USDT
    let calculateUsdtAddress = calculateAddress(ownerAddress, ++nonce)
    let USDT = await ethers.getContractFactory("ERC20Token",owner);
    let usdt = await USDT.deploy(new BigNumber(10000000).times(new BigNumber(10).pow(6), 10).toFixed().toString(), "Tether USD", "USDT", 6);
    await usdt.deployed();

    if (usdt.address.toLowerCase().toString() === calculateUsdtAddress.toLowerCase().toString())
        console.log("发布地址与预先计算地址一致，usdt: "+usdt.address.toString()+" calculate address: "+calculateUsdtAddress)
    else console.log("发布地址与预先计算地址不一致，usdt: "+usdt.address.toString()+" calculate address: "+calculateUsdtAddress)

    d = "USDT deployed to: " + usdt.address + "\n";
    console.log(d);
    fs.appendFileSync(outputPath, d)

    // //Verifier
    let calculateVerifierAddress = calculateAddress(ownerAddress, ++nonce)
    let Verifier = await ethers.getContractFactory("Verifier",owner);
    let verifier = await Verifier.deploy();
    await verifier.deployed();

    if (verifier.address.toLowerCase().toString() === calculateVerifierAddress.toLowerCase().toString())
        console.log("发布地址与预先计算地址一致，verifier: "+verifier.address.toString()+" calculate address: "+calculateVerifierAddress)
    else console.log("发布地址与预先计算地址不一致，verifier: "+verifier.address.toString()+" calculate address: "+calculateVerifierAddress)

    d = "Verifier deployed to: " + verifier.address + "\n";
    console.log(d);
    fs.appendFileSync(outputPath, d)
    //
    // //ENSRegistry
    let calculateENSRegistryAddress = calculateAddress(ownerAddress, ++nonce)
    let ENSRegistry = await ethers.getContractFactory("ENSRegistry",owner);
    let eNSRegistry = await ENSRegistry.deploy()
    await eNSRegistry.deployed()

    if (eNSRegistry.address.toLowerCase().toString() === calculateENSRegistryAddress.toLowerCase().toString())
        console.log("发布地址与预先计算地址一致，ENSRegistry: "+eNSRegistry.address.toString()+" calculate address: "+calculateENSRegistryAddress)
    else console.log("发布地址与预先计算地址不一致，ENSRegistry: "+eNSRegistry.address.toString()+" calculate address: "+calculateENSRegistryAddress)

    d = "ENSRegistry deployed to: " + eNSRegistry.address + "\n";
    console.log(d);
    fs.appendFileSync(outputPath, d)
    //
    const ttl = 1
    const ens_gov = "governance.eth"
    const ens_InstanceRegistry = "InstanceRegistry.eth"
    const ens_FeeManager = "FeeManager.eth"
    const ens_TornadoStakingRewards = "StakingRewards.eth"
    const ens_RelayerRegistry = "RelayerRegistry.eth"
    const ens_TornadoRouter = "TornadoRouter.eth"

    // //注册ENS tornado.governance.eth
    let ens = await ethers.getContractAt("ENSRegistry",eNSRegistry.address, owner)
    let b = await ens.recordExists(ethers.utils.formatBytes32String(ens_gov))
    console.log(b)
    let tx = await ens.setRecord(ethers.utils.formatBytes32String(ens_gov), ownerAddress, ownerAddress, ttl)
    let receipt = await tx.wait()
    // console.log('Transaction receipt: '+JSON.stringify(receipt).toString());
    d = "ENS governance.eth reserve to: " + ownerAddress + "\n";
    console.log(d);
    fs.appendFileSync(outputPath, d)
    let resolver = await ens.resolver(ethers.utils.formatBytes32String(ens_gov))
    console.log("resolver: "+resolver.toString())

    //预先计算各合约地址并注册ENS
    let nonce2 = await getPendingNonce(ownerAddress)
    nonce2 += 5
    let calculateTornAddress = calculateAddress(ownerAddress, nonce2)
    let calculateTornadoCash_Eth_01_Address = calculateAddress(ownerAddress, ++nonce2)
    let calculateTornadoCash_erc20_Address = calculateAddress(ownerAddress, ++nonce2)
    let calculateRelayerRegistryAddress = calculateAddress(ownerAddress, ++nonce2)
    let calculateInstanceRegistryAddress = calculateAddress(ownerAddress, ++nonce2)
    let calculateTornadoStakingRewardsAddress = calculateAddress(ownerAddress, ++nonce2)
    let calculateFeeManagerAddress = calculateAddress(ownerAddress, ++nonce2)
    let calculateTornadoRouterAddress = calculateAddress(ownerAddress, ++nonce2)

    b = await ens.recordExists(ethers.utils.formatBytes32String(ens_FeeManager))
    console.log(b)
    tx = await ens.setRecord(ethers.utils.formatBytes32String(ens_FeeManager), ownerAddress, calculateFeeManagerAddress, ttl)
    receipt = await tx.wait()
    // console.log('Transaction receipt: '+JSON.stringify(receipt).toString());
    d = ens_FeeManager + "reserve to: " + calculateFeeManagerAddress + "\n";
    console.log(d);
    fs.appendFileSync(outputPath, d)
    resolver = await ens.resolver(ethers.utils.formatBytes32String(ens_FeeManager))
    console.log(ens_FeeManager+"resolver: "+resolver.toString())

    b = await ens.recordExists(ethers.utils.formatBytes32String(ens_TornadoStakingRewards))
    console.log(b)
    tx = await ens.setRecord(ethers.utils.formatBytes32String(ens_TornadoStakingRewards), ownerAddress, calculateTornadoStakingRewardsAddress, ttl)
    receipt = await tx.wait()
    // console.log('Transaction receipt: '+JSON.stringify(receipt).toString());
    d = ens_TornadoStakingRewards + "reserve to: " + calculateTornadoStakingRewardsAddress + "\n";
    console.log(d);
    fs.appendFileSync(outputPath, d)
    resolver = await ens.resolver(ethers.utils.formatBytes32String(ens_TornadoStakingRewards))
    console.log(ens_TornadoStakingRewards+"resolver: "+resolver.toString())

    b = await ens.recordExists(ethers.utils.formatBytes32String(ens_RelayerRegistry))
    console.log(b)
    tx = await ens.setRecord(ethers.utils.formatBytes32String(ens_RelayerRegistry), ownerAddress, calculateRelayerRegistryAddress, ttl)
    receipt = await tx.wait()
    // console.log('Transaction receipt: '+JSON.stringify(receipt).toString());
    d = ens_RelayerRegistry + "reserve to: " + calculateRelayerRegistryAddress + "\n";
    console.log(d);
    fs.appendFileSync(outputPath, d)
    resolver = await ens.resolver(ethers.utils.formatBytes32String(ens_RelayerRegistry))
    console.log(ens_RelayerRegistry+"resolver: "+resolver.toString())

    b = await ens.recordExists(ethers.utils.formatBytes32String(ens_InstanceRegistry))
    console.log(b)
    tx = await ens.setRecord(ethers.utils.formatBytes32String(ens_InstanceRegistry), ownerAddress, calculateInstanceRegistryAddress, ttl)
    receipt = await tx.wait()
    // console.log('Transaction receipt: '+JSON.stringify(receipt).toString());
    d = ens_InstanceRegistry + "reserve to: " + calculateInstanceRegistryAddress + "\n";
    console.log(d);
    fs.appendFileSync(outputPath, d)
    resolver = await ens.resolver(ethers.utils.formatBytes32String(ens_InstanceRegistry))
    console.log(ens_InstanceRegistry+"resolver: "+resolver.toString())

    b = await ens.recordExists(ethers.utils.formatBytes32String(ens_TornadoRouter))
    console.log(b)
    tx = await ens.setRecord(ethers.utils.formatBytes32String(ens_TornadoRouter), ownerAddress, calculateTornadoRouterAddress, ttl)
    receipt = await tx.wait()
    // console.log('Transaction receipt: '+JSON.stringify(receipt).toString());
    d = ens_TornadoRouter + "reserve to: " + calculateTornadoRouterAddress + "\n";
    console.log(d);
    fs.appendFileSync(outputPath, d)
    resolver = await ens.resolver(ethers.utils.formatBytes32String(ens_TornadoRouter))
    console.log(ens_TornadoRouter+"resolver: "+resolver.toString())

    //TORN
    let recipient = {
        to : ethers.utils.formatBytes32String(ens_gov),
        amount : new BigNumber(10000000).times(new BigNumber(10).pow(18)).toFixed().toString()
    }
    let TORN = await ethers.getContractFactory("TORN",owner);
    let torn = await TORN.deploy(ethers.utils.formatBytes32String(ens_gov), 1 ,[recipient])
    await torn.deployed()
    if (torn.address.toLowerCase().toString() === calculateTornAddress.toLowerCase().toString())
        console.log("发布地址与预先计算地址一致，TORN: "+torn.address.toString()+" calculate address: "+calculateTornAddress)
    else console.log("发布地址与预先计算地址不一致，TORN: "+torn.address.toString()+" calculate address: "+calculateTornAddress)

    d = "TORN deployed to: " + torn.address + "\n";
    console.log(d);
    fs.appendFileSync(outputPath, d)

    //TornadoCash_Eth_01
    let TornadoCash_Eth_01 = await ethers.getContractFactory("TornadoCash_Eth_01",owner);
    let tornadoCash_Eth_01 = await TornadoCash_Eth_01.deploy(verifier.address, new BigNumber(10).pow(17).toFixed().toString(), 31, ownerAddress, hasher.address)
    await tornadoCash_Eth_01.deployed()
    if (tornadoCash_Eth_01.address.toLowerCase().toString() === calculateTornadoCash_Eth_01_Address.toLowerCase().toString())
        console.log("发布地址与预先计算地址一致，tornadoCash_Eth_01: "+tornadoCash_Eth_01.address.toString()+" calculate address: "+calculateTornadoCash_Eth_01_Address)
    else console.log("发布地址与预先计算地址不一致，tornadoCash_Eth_01: "+tornadoCash_Eth_01.address.toString()+" calculate address: "+calculateTornadoCash_Eth_01_Address)

    d = "TornadoCash_Eth_01 deployed to: " + tornadoCash_Eth_01.address + "\n";
    console.log(d);
    fs.appendFileSync(outputPath, d)

    //TornadoCash_erc20
    let TornadoCash_erc20 = await ethers.getContractFactory("TornadoCash_erc20",owner);
    let tornadoCash_erc20 = await TornadoCash_erc20.deploy(verifier.address, new BigNumber(100).times(new BigNumber(10).pow(6), 10).toFixed().toString(), 31, ownerAddress, usdt.address, hasher.address)
    await tornadoCash_erc20.deployed()
    if (tornadoCash_erc20.address.toLowerCase().toString() === calculateTornadoCash_erc20_Address.toLowerCase().toString())
        console.log("发布地址与预先计算地址一致，tornadoCash_erc20: "+tornadoCash_erc20.address.toString()+" calculate address: "+calculateTornadoCash_erc20_Address)
    else console.log("发布地址与预先计算地址不一致，tornadoCash_erc20: "+tornadoCash_erc20.address.toString()+" calculate address: "+calculateTornadoCash_erc20_Address)

    d = "TornadoCash_erc20 deployed to: " + tornadoCash_erc20.address + "\n";
    console.log(d);
    fs.appendFileSync(outputPath, d)

    //FeeManager
    let FeeManager = await ethers.getContractFactory("FeeManager",owner);
    let feeManager = await FeeManager.deploy(torn.address, ownerAddress, ethers.utils.formatBytes32String(ens_InstanceRegistry))
    await feeManager.deployed()
    if (feeManager.address.toLowerCase().toString() === calculateFeeManagerAddress.toLowerCase().toString())
        console.log("发布地址与预先计算地址一致，feeManager: "+feeManager.address.toString()+" calculate address: "+calculateFeeManagerAddress)
    else console.log("发布地址与预先计算地址不一致，feeManager: "+feeManager.address.toString()+" calculate address: "+calculateFeeManagerAddress)

    d = "feeManager deployed to: " + feeManager.address + "\n";
    console.log(d);
    fs.appendFileSync(outputPath, d)

    //TornadoStakingRewards
    let TornadoStakingRewards = await ethers.getContractFactory("TornadoStakingRewards",owner);
    let tornadoStakingRewards = await TornadoStakingRewards.deploy(ownerAddress, torn.address, ethers.utils.formatBytes32String(ens_RelayerRegistry))
    await tornadoStakingRewards.deployed()
    if (tornadoStakingRewards.address.toLowerCase().toString() === calculateTornadoStakingRewardsAddress.toLowerCase().toString())
        console.log("发布地址与预先计算地址一致，tornadoStakingRewards: "+tornadoStakingRewards.address.toString()+" calculate address: "+calculateTornadoStakingRewardsAddress)
    else console.log("发布地址与预先计算地址不一致，tornadoStakingRewards: "+tornadoStakingRewards.address.toString()+" calculate address: "+calculateTornadoStakingRewardsAddress)

    d = "tornadoStakingRewards deployed to: " + tornadoStakingRewards.address + "\n";
    console.log(d);
    fs.appendFileSync(outputPath, d)

    //RelayerRegistry
    let RelayerRegistry = await ethers.getContractFactory("RelayerRegistry",owner);
    let relayerRegistry = await RelayerRegistry.deploy(torn.address,ownerAddress,eNSRegistry.address,ethers.utils.formatBytes32String(ens_TornadoStakingRewards),ethers.utils.formatBytes32String(ens_FeeManager))
    await relayerRegistry.deployed()
    if (relayerRegistry.address.toLowerCase().toString() === calculateRelayerRegistryAddress.toLowerCase().toString())
        console.log("发布地址与预先计算地址一致，relayerRegistry: "+relayerRegistry.address.toString()+" calculate address: "+calculateRelayerRegistryAddress)
    else console.log("发布地址与预先计算地址不一致，relayerRegistry: "+relayerRegistry.address.toString()+" calculate address: "+calculateRelayerRegistryAddress)

    d = "relayerRegistry deployed to: " + relayerRegistry.address + "\n";
    console.log(d);
    fs.appendFileSync(outputPath, d)

    //InstanceRegistry
    let InstanceRegistry = await ethers.getContractFactory("InstanceRegistry",owner);
    let instanceRegistry = await InstanceRegistry.deploy(ownerAddress)
    await instanceRegistry.deployed()
    if (instanceRegistry.address.toLowerCase().toString() === calculateInstanceRegistryAddress.toLowerCase().toString())
        console.log("发布地址与预先计算地址一致，instanceRegistry: "+instanceRegistry.address.toString()+" calculate address: "+calculateInstanceRegistryAddress)
    else console.log("发布地址与预先计算地址不一致，instanceRegistry: "+instanceRegistry.address.toString()+" calculate address: "+calculateInstanceRegistryAddress)

    d = "instanceRegistry deployed to: " + instanceRegistry.address + "\n";
    console.log(d);
    fs.appendFileSync(outputPath, d)

    //TornadoRouter
    let TornadoRouter = await ethers.getContractFactory("TornadoRouter",owner);
    let tornadoRouter = await TornadoRouter.deploy(ownerAddress, ethers.utils.formatBytes32String(ens_InstanceRegistry),ethers.utils.formatBytes32String(ens_RelayerRegistry))
    await tornadoRouter.deployed()
    if (tornadoRouter.address.toLowerCase().toString() === calculateTornadoRouterAddress.toLowerCase().toString())
        console.log("发布地址与预先计算地址一致，tornadoRouter: "+tornadoRouter.address.toString()+" calculate address: "+calculateTornadoRouterAddress)
    else console.log("发布地址与预先计算地址不一致，tornadoRouter: "+tornadoRouter.address.toString()+" calculate address: "+calculateTornadoRouterAddress)

    d = "tornadoRouter deployed to: " + tornadoRouter.address + "\n";
    console.log(d);
    fs.appendFileSync(outputPath, d)
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });