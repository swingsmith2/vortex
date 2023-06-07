// test/Box.js
// Load dependencies
const { ethers, network, upgrades } = require("hardhat");
const fs = require("fs");
const path = require("path");
const BigNumber = require('bignumber.js');
const util = require("ethereumjs-util");
const config = require('./config')
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
    console.log("nonce:"+nonce)

    let calculateHasherAddress = calculateAddress(ownerAddress, nonce)

    let Hasher = new ethers.ContractFactory(obj.abi, obj.bytecode.toString(), owner)
    let hasher = await Hasher.deploy();
    await hasher.deployed();

    if (hasher.address.toLowerCase().toString() === calculateHasherAddress.toLowerCase().toString())
        console.log("发布地址与预先计算地址一致，hasher: "+hasher.address.toString()+" calculate address: "+calculateHasherAddress)
    else console.log("发布地址与预先计算地址不一致，hasher: "+hasher.address.toString()+" calculate address: "+calculateHasherAddress)

    fs.appendFileSync(outputPath, "\n/********************* Start ********************/\n")
    let d = "Hasher deployed to: " + hasher.address + "\n"
    console.log(d);
    fs.appendFileSync(outputPath, d)
    config.hasher_address = hasher.address

    let x = await hasher.MiMCSponge(123456534,0)
    console.log("x: "+ x.toString())

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
    config.usdt_address = usdt.address

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
    config.verifier_address = verifier.address
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
    config.eNSRegistry_address = eNSRegistry.address
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
    console.log("nonce2:"+nonce2)
    let calculateTornAddress = calculateAddress(ownerAddress, nonce2)
    let calculateFeeManagerAddress = calculateAddress(ownerAddress, ++nonce2)
    let calculateTornadoStakingRewardsAddress = calculateAddress(ownerAddress, ++nonce2)
    let calculateRelayerRegistryAddress = calculateAddress(ownerAddress, ++nonce2)
    let calculateInstanceRegistryAddress = calculateAddress(ownerAddress, ++nonce2)
    let calculateTornadoRouterAddress = calculateAddress(ownerAddress, ++nonce2)

    b = await ens.recordExists(ethers.utils.formatBytes32String(ens_FeeManager))
    console.log(b)
    tx = await ens.setRecord(ethers.utils.formatBytes32String(ens_FeeManager), ownerAddress, calculateFeeManagerAddress, ttl)
    receipt = await tx.wait()
    // console.log('Transaction receipt: '+JSON.stringify(receipt).toString());
    d = ens_FeeManager + " reserve to: " + calculateFeeManagerAddress + "\n";
    console.log(d);
    fs.appendFileSync(outputPath, d)
    resolver = await ens.resolver(ethers.utils.formatBytes32String(ens_FeeManager))
    console.log(ens_FeeManager+"resolver: "+resolver.toString())

    b = await ens.recordExists(ethers.utils.formatBytes32String(ens_TornadoStakingRewards))
    console.log(b)
    tx = await ens.setRecord(ethers.utils.formatBytes32String(ens_TornadoStakingRewards), ownerAddress, calculateTornadoStakingRewardsAddress, ttl)
    receipt = await tx.wait()
    // console.log('Transaction receipt: '+JSON.stringify(receipt).toString());
    d = ens_TornadoStakingRewards + " reserve to: " + calculateTornadoStakingRewardsAddress + "\n";
    console.log(d);
    fs.appendFileSync(outputPath, d)
    resolver = await ens.resolver(ethers.utils.formatBytes32String(ens_TornadoStakingRewards))
    console.log(ens_TornadoStakingRewards+"resolver: "+resolver.toString())

    b = await ens.recordExists(ethers.utils.formatBytes32String(ens_RelayerRegistry))
    console.log(b)
    tx = await ens.setRecord(ethers.utils.formatBytes32String(ens_RelayerRegistry), ownerAddress, calculateRelayerRegistryAddress, ttl)
    receipt = await tx.wait()
    // console.log('Transaction receipt: '+JSON.stringify(receipt).toString());
    d = ens_RelayerRegistry + " reserve to: " + calculateRelayerRegistryAddress + "\n";
    console.log(d);
    fs.appendFileSync(outputPath, d)
    resolver = await ens.resolver(ethers.utils.formatBytes32String(ens_RelayerRegistry))
    console.log(ens_RelayerRegistry+"resolver: "+resolver.toString())

    b = await ens.recordExists(ethers.utils.formatBytes32String(ens_InstanceRegistry))
    console.log(b)
    tx = await ens.setRecord(ethers.utils.formatBytes32String(ens_InstanceRegistry), ownerAddress, calculateInstanceRegistryAddress, ttl)
    receipt = await tx.wait()
    // console.log('Transaction receipt: '+JSON.stringify(receipt).toString());
    d = ens_InstanceRegistry + " reserve to: " + calculateInstanceRegistryAddress + "\n";
    console.log(d);
    fs.appendFileSync(outputPath, d)
    resolver = await ens.resolver(ethers.utils.formatBytes32String(ens_InstanceRegistry))
    console.log(ens_InstanceRegistry+"resolver: "+resolver.toString())

    b = await ens.recordExists(ethers.utils.formatBytes32String(ens_TornadoRouter))
    console.log(b)
    tx = await ens.setRecord(ethers.utils.formatBytes32String(ens_TornadoRouter), ownerAddress, calculateTornadoRouterAddress, ttl)
    receipt = await tx.wait()
    // console.log('Transaction receipt: '+JSON.stringify(receipt).toString());
    d = ens_TornadoRouter + " reserve to: " + calculateTornadoRouterAddress + "\n";
    console.log(d);
    fs.appendFileSync(outputPath, d)
    resolver = await ens.resolver(ethers.utils.formatBytes32String(ens_TornadoRouter))
    console.log(ens_TornadoRouter+"resolver: "+resolver.toString())

    nonce2 = await getPendingNonce(ownerAddress)
    console.log("nonce2 after: "+nonce2)
    config.nonce2 = nonce2
    
    // 将修改后的配置对象转换为字符串
    const updatedConfigFileContent = `module.exports = ${JSON.stringify(config, null, 2)}`;

    // 将修改后的配置内容写入文件
    let configPath = path.join(__dirname,  'config.js')
    fs.writeFileSync(configPath, updatedConfigFileContent, 'utf8');

}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
