// test/Box.js
// Load dependencies
const { ethers, network, upgrades } = require("hardhat");
const fs = require("fs");
const path = require("path");
const BigNumber = require('bignumber.js');
const util = require("ethereumjs-util");
const outputPath = path.join(__dirname, '..', 'build', 'Addresses.txt')
const config = require('./config')

// const { Web3 } = require('web3');
// const util = require("ethereumjs-util"); //  web3.js has native ESM builds and (`import Web3 from 'web3'`)
// // Set up a connection to the Ganache network
// const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

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
    let signers = await ethers.getSigners();
    let owner = signers[0]
    let ownerAddress = signers[0].address
    // let nonce = await getPendingNonce(ownerAddress)
    let nonce = 0
    const ttl = 1
    const ens_gov = "governance.eth"
    const ens_InstanceRegistry = "InstanceRegistry.eth"
    const ens_FeeManager = "FeeManager.eth"
    const ens_TornadoStakingRewards = "StakingRewards.eth"
    const ens_RelayerRegistry = "RelayerRegistry.eth"
    const ens_TornadoRouter = "TornadoRouter.eth"
    //要改的
    let hasher_address = config.hasher_address
    let usdt_address = config.usdt_address
    let verifier_address = config.verifier_address
    let eNSRegistry_address = config.eNSRegistry_address
    let nonce2 = config.nonce2

    let calculateTornAddress = calculateAddress(ownerAddress, nonce2)
    let calculateTornadoCash_Eth_01_Address = calculateAddress(ownerAddress, ++nonce2)
    let calculateTornadoCash_erc20_Address = calculateAddress(ownerAddress, ++nonce2)
    let calculateFeeManagerAddress = calculateAddress(ownerAddress, ++nonce2)
    let calculateTornadoStakingRewardsAddress = calculateAddress(ownerAddress, ++nonce2)
    let calculateRelayerRegistryAddress = calculateAddress(ownerAddress, ++nonce2)
    let calculateInstanceRegistryAddress = calculateAddress(ownerAddress, ++nonce2)
    let calculateTornadoRouterAddress = calculateAddress(ownerAddress, ++nonce2)

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
    let TornadoCash_Eth_01 = await ethers.getContractFactory("TornadoCash_Eth_01",owner)
    let tornadoCash_Eth_01 = await TornadoCash_Eth_01.deploy(verifier_address, new BigNumber(10).pow(17).toFixed().toString(), 31, ownerAddress, hasher_address)
    await tornadoCash_Eth_01.deployed()
    if (tornadoCash_Eth_01.address.toLowerCase().toString() === calculateTornadoCash_Eth_01_Address.toLowerCase().toString())
        console.log("发布地址与预先计算地址一致，tornadoCash_Eth_01: "+tornadoCash_Eth_01.address.toString()+" calculate address: "+calculateTornadoCash_Eth_01_Address)
    else console.log("发布地址与预先计算地址不一致，tornadoCash_Eth_01: "+tornadoCash_Eth_01.address.toString()+" calculate address: "+calculateTornadoCash_Eth_01_Address)

    d = "TornadoCash_Eth_01 deployed to: " + tornadoCash_Eth_01.address + "\n";
    console.log(d);
    fs.appendFileSync(outputPath, d)

    //TornadoCash_erc20
    let TornadoCash_erc20 = await ethers.getContractFactory("TornadoCash_erc20",owner);
    let tornadoCash_erc20 = await TornadoCash_erc20.deploy(verifier_address, new BigNumber(100).times(new BigNumber(10).pow(6), 10).toFixed().toString(), 31, ownerAddress, usdt_address, hasher_address)
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
    let relayerRegistry = await RelayerRegistry.deploy(torn.address,ownerAddress,eNSRegistry_address,ethers.utils.formatBytes32String(ens_TornadoStakingRewards),ethers.utils.formatBytes32String(ens_FeeManager))
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