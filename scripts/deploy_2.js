// test/Box.js
// Load dependencies
const {ethers, network, upgrades} = require("hardhat");
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
    // let nonce = 0
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
    let calculateFeeManagerAddress = calculateAddress(ownerAddress, ++nonce2)
    let calculateTornadoStakingRewardsAddress = calculateAddress(ownerAddress, ++nonce2)
    let calculateRelayerRegistryAddress = calculateAddress(ownerAddress, ++nonce2)
    let calculateInstanceRegistryAddress = calculateAddress(ownerAddress, ++nonce2)
    let calculateTornadoRouterAddress = calculateAddress(ownerAddress, ++nonce2)
    // let calculateTornadoCash_Eth_01_Address = calculateAddress(ownerAddress, ++nonce2)
    // let calculateTornadoCash_erc20_Address = calculateAddress(ownerAddress, ++nonce2)

    //TORN
    let recipient = {
        to: ethers.utils.formatBytes32String(ens_gov),
        amount: new BigNumber(10000000).times(new BigNumber(10).pow(18)).toFixed().toString()
    }
    let TORN = await ethers.getContractFactory("TORN", owner);
    let torn = await TORN.deploy(ethers.utils.formatBytes32String(ens_gov), 1, [recipient])
    await torn.deployed()
    if (torn.address.toLowerCase().toString() === calculateTornAddress.toLowerCase().toString())
        console.log("发布地址与预先计算地址一致，TORN: " + torn.address.toString() + " calculate address: " + calculateTornAddress)
    else console.log("发布地址与预先计算地址不一致，TORN: " + torn.address.toString() + " calculate address: " + calculateTornAddress)

    d = "TORN deployed to: " + torn.address + "\n";
    console.log(d);
    fs.appendFileSync(outputPath, d)

    //FeeManager
    let FeeManager = await ethers.getContractFactory("FeeManager", owner);
    let feeManager = await FeeManager.deploy(torn.address, ownerAddress, ethers.utils.formatBytes32String(ens_InstanceRegistry))
    await feeManager.deployed()
    if (feeManager.address.toLowerCase().toString() === calculateFeeManagerAddress.toLowerCase().toString())
        console.log("发布地址与预先计算地址一致，feeManager: " + feeManager.address.toString() + " calculate address: " + calculateFeeManagerAddress)
    else console.log("发布地址与预先计算地址不一致，feeManager: " + feeManager.address.toString() + " calculate address: " + calculateFeeManagerAddress)

    d = "feeManager deployed to: " + feeManager.address + "\n";
    console.log(d);
    fs.appendFileSync(outputPath, d)

    //TornadoStakingRewards
    let TornadoStakingRewards = await ethers.getContractFactory("TornadoStakingRewards", owner);
    let tornadoStakingRewards = await TornadoStakingRewards.deploy(ownerAddress, torn.address, ethers.utils.formatBytes32String(ens_RelayerRegistry))
    await tornadoStakingRewards.deployed()
    if (tornadoStakingRewards.address.toLowerCase().toString() === calculateTornadoStakingRewardsAddress.toLowerCase().toString())
        console.log("发布地址与预先计算地址一致，tornadoStakingRewards: " + tornadoStakingRewards.address.toString() + " calculate address: " + calculateTornadoStakingRewardsAddress)
    else console.log("发布地址与预先计算地址不一致，tornadoStakingRewards: " + tornadoStakingRewards.address.toString() + " calculate address: " + calculateTornadoStakingRewardsAddress)

    d = "tornadoStakingRewards deployed to: " + tornadoStakingRewards.address + "\n";
    console.log(d);
    fs.appendFileSync(outputPath, d)

    //RelayerRegistry
    let RelayerRegistry = await ethers.getContractFactory("RelayerRegistry", owner);
    let relayerRegistry = await RelayerRegistry.deploy(torn.address, ownerAddress, eNSRegistry_address, ethers.utils.formatBytes32String(ens_TornadoStakingRewards), ethers.utils.formatBytes32String(ens_FeeManager))
    await relayerRegistry.deployed()
    if (relayerRegistry.address.toLowerCase().toString() === calculateRelayerRegistryAddress.toLowerCase().toString())
        console.log("发布地址与预先计算地址一致，relayerRegistry: " + relayerRegistry.address.toString() + " calculate address: " + calculateRelayerRegistryAddress)
    else console.log("发布地址与预先计算地址不一致，relayerRegistry: " + relayerRegistry.address.toString() + " calculate address: " + calculateRelayerRegistryAddress)

    d = "relayerRegistry deployed to: " + relayerRegistry.address + "\n";
    console.log(d);
    fs.appendFileSync(outputPath, d)

    //InstanceRegistry
    let InstanceRegistry = await ethers.getContractFactory("InstanceRegistry", owner);
    let instanceRegistry = await InstanceRegistry.deploy(ownerAddress)
    await instanceRegistry.deployed()
    if (instanceRegistry.address.toLowerCase().toString() === calculateInstanceRegistryAddress.toLowerCase().toString())
        console.log("发布地址与预先计算地址一致，instanceRegistry: " + instanceRegistry.address.toString() + " calculate address: " + calculateInstanceRegistryAddress)
    else console.log("发布地址与预先计算地址不一致，instanceRegistry: " + instanceRegistry.address.toString() + " calculate address: " + calculateInstanceRegistryAddress)

    d = "instanceRegistry deployed to: " + instanceRegistry.address + "\n";
    console.log(d);
    fs.appendFileSync(outputPath, d)

    //TornadoRouter
    let TornadoRouter = await ethers.getContractFactory("TornadoRouter", owner);
    let tornadoRouter = await TornadoRouter.deploy(ownerAddress, ethers.utils.formatBytes32String(ens_InstanceRegistry), ethers.utils.formatBytes32String(ens_RelayerRegistry))
    await tornadoRouter.deployed()
    if (tornadoRouter.address.toLowerCase().toString() === calculateTornadoRouterAddress.toLowerCase().toString())
        console.log("发布地址与预先计算地址一致，tornadoRouter: " + tornadoRouter.address.toString() + " calculate address: " + calculateTornadoRouterAddress)
    else console.log("发布地址与预先计算地址不一致，tornadoRouter: " + tornadoRouter.address.toString() + " calculate address: " + calculateTornadoRouterAddress)

    d = "tornadoRouter deployed to: " + tornadoRouter.address + "\n";
    console.log(d);
    fs.appendFileSync(outputPath, d)

    //部署ETH和ERC20实例，初始各4个
    //TornadoCash_Eth_01
    let TornadoCash_Eth_01 = await ethers.getContractFactory("TornadoCash_Eth_01", owner)
    let tornadoCash_Eth_01 = await TornadoCash_Eth_01.deploy(verifier_address, new BigNumber(10).pow(17).toFixed().toString(), 31, ownerAddress, hasher_address)
    await tornadoCash_Eth_01.deployed()
    d = "TornadoCash_Eth_01 deployed to: " + tornadoCash_Eth_01.address + "\n";
    console.log(d);
    fs.appendFileSync(outputPath, d)

    let TornadoCash_Eth_1 = await ethers.getContractFactory("TornadoCash_Eth_01", owner)
    let tornadoCash_Eth_1 = await TornadoCash_Eth_1.deploy(verifier_address, new BigNumber(10).pow(18).toFixed().toString(), 31, ownerAddress, hasher_address)
    await tornadoCash_Eth_1.deployed()
    d = "TornadoCash_Eth_1 deployed to: " + tornadoCash_Eth_1.address + "\n";
    console.log(d);
    fs.appendFileSync(outputPath, d)

    let TornadoCash_Eth_10 = await ethers.getContractFactory("TornadoCash_Eth_01", owner)
    let tornadoCash_Eth_10 = await TornadoCash_Eth_10.deploy(verifier_address, new BigNumber(10).times(new BigNumber(10).pow(18), 10).toFixed().toString(), 31, ownerAddress, hasher_address)
    await tornadoCash_Eth_10.deployed()
    d = "TornadoCash_Eth_10 deployed to: " + tornadoCash_Eth_10.address + "\n";
    console.log(d);
    fs.appendFileSync(outputPath, d)

    let TornadoCash_Eth_100 = await ethers.getContractFactory("TornadoCash_Eth_01", owner)
    let tornadoCash_Eth_100 = await TornadoCash_Eth_100.deploy(verifier_address, new BigNumber(100).times(new BigNumber(10).pow(18), 10).toFixed().toString(), 31, ownerAddress, hasher_address)
    await tornadoCash_Eth_100.deployed()
    d = "TornadoCash_Eth_100 deployed to: " + tornadoCash_Eth_100.address + "\n";
    console.log(d);
    fs.appendFileSync(outputPath, d)

    //TornadoCash_erc20 USDT
    let TornadoCash_erc20_USDT100 = await ethers.getContractFactory("TornadoCash_erc20", owner);
    let tornadoCash_erc20_USDT100 = await TornadoCash_erc20_USDT100.deploy(verifier_address, new BigNumber(100).times(new BigNumber(10).pow(6), 10).toFixed().toString(), 31, ownerAddress, usdt_address, hasher_address)
    await tornadoCash_erc20_USDT100.deployed()
    d = "TornadoCash_erc20_USDT100 deployed to: " + tornadoCash_erc20_USDT100.address + "\n";
    console.log(d);
    fs.appendFileSync(outputPath, d)

    let TornadoCash_erc20_USDT1000 = await ethers.getContractFactory("TornadoCash_erc20", owner);
    let tornadoCash_erc20_USDT1000 = await TornadoCash_erc20_USDT1000.deploy(verifier_address, new BigNumber(1000).times(new BigNumber(10).pow(6), 10).toFixed().toString(), 31, ownerAddress, usdt_address, hasher_address)
    await tornadoCash_erc20_USDT1000.deployed()
    d = "TornadoCash_erc20_USDT1000 deployed to: " + tornadoCash_erc20_USDT1000.address + "\n";
    console.log(d);
    fs.appendFileSync(outputPath, d)

    let TornadoCash_erc20_USDT10000 = await ethers.getContractFactory("TornadoCash_erc20", owner);
    let tornadoCash_erc20_USDT10000 = await TornadoCash_erc20_USDT10000.deploy(verifier_address, new BigNumber(10000).times(new BigNumber(10).pow(6), 10).toFixed().toString(), 31, ownerAddress, usdt_address, hasher_address)
    await tornadoCash_erc20_USDT10000.deployed()
    d = "TornadoCash_erc20_USDT10000 deployed to: " + tornadoCash_erc20_USDT10000.address + "\n";
    console.log(d);
    fs.appendFileSync(outputPath, d)

    let TornadoCash_erc20_USDT100000 = await ethers.getContractFactory("TornadoCash_erc20", owner);
    let tornadoCash_erc20_USDT100000 = await TornadoCash_erc20_USDT100000.deploy(verifier_address, new BigNumber(100000).times(new BigNumber(10).pow(6), 10).toFixed().toString(), 31, ownerAddress, usdt_address, hasher_address)
    await tornadoCash_erc20_USDT100000.deployed()
    d = "TornadoCash_erc20_USDT100000 deployed to: " + tornadoCash_erc20_USDT100000.address + "\n";
    console.log(d);
    fs.appendFileSync(outputPath, d)

    //以下为初始化
    //InstanceRegistry
    //ETH01
    const Instance_ETH01 = {
        isERC20: false,
        token: '0x0000000000000000000000000000000000000000',
        state: 1,
        uniswapPoolSwappingFee: 30,
        protocolFeePercentage: 3
    };
    const Tornado_ETH01 = {
        addr: tornadoCash_Eth_01.address,
        instance: Instance_ETH01
    }

    const Instance_ETH1 = {
        isERC20: false,
        token: '0x0000000000000000000000000000000000000000',
        state: 1,
        uniswapPoolSwappingFee: 30,
        protocolFeePercentage: 3
    };
    const Tornado_ETH1 = {
        addr: tornadoCash_Eth_1.address,
        instance: Instance_ETH1
    }

    const Instance_ETH10 = {
        isERC20: false,
        token: '0x0000000000000000000000000000000000000000',
        state: 1,
        uniswapPoolSwappingFee: 30,
        protocolFeePercentage: 3
    };
    const Tornado_ETH10 = {
        addr: tornadoCash_Eth_10.address,
        instance: Instance_ETH10
    }

    const Instance_ETH100 = {
        isERC20: false,
        token: '0x0000000000000000000000000000000000000000',
        state: 1,
        uniswapPoolSwappingFee: 30,
        protocolFeePercentage: 3
    };
    const Tornado_ETH100 = {
        addr: tornadoCash_Eth_100.address,
        instance: Instance_ETH100
    }

    //USDT100
    const Instance_USDT100 = {
        isERC20: true,
        token: usdt_address,
        state: 1,
        uniswapPoolSwappingFee: 30,
        protocolFeePercentage: 3
    };
    const Tornado_USDT100 = {
        addr: tornadoCash_erc20_USDT100.address,
        instance: Instance_USDT100
    }

    const Instance_USDT1000 = {
        isERC20: true,
        token: usdt_address,
        state: 1,
        uniswapPoolSwappingFee: 30,
        protocolFeePercentage: 3
    };
    const Tornado_USDT1000 = {
        addr: tornadoCash_erc20_USDT1000.address,
        instance: Instance_USDT1000
    }

    const Instance_USDT10000 = {
        isERC20: true,
        token: usdt_address,
        state: 1,
        uniswapPoolSwappingFee: 30,
        protocolFeePercentage: 3
    };
    const Tornado_USDT10000 = {
        addr: tornadoCash_erc20_USDT10000.address,
        instance: Instance_USDT10000
    }

    const Instance_USDT100000 = {
        isERC20: true,
        token: usdt_address,
        state: 1,
        uniswapPoolSwappingFee: 30,
        protocolFeePercentage: 3
    };
    const Tornado_USDT100000 = {
        addr: tornadoCash_erc20_USDT100000.address,
        instance: Instance_USDT100000
    }

    //
    let intances = [
        Tornado_ETH01,
        Tornado_ETH1,
        Tornado_ETH10,
        Tornado_ETH100,
        Tornado_USDT100,
        Tornado_USDT1000,
        Tornado_USDT10000,
        Tornado_USDT100000
    ]
    let tx = await instanceRegistry.initialize(intances, ethers.utils.formatBytes32String(ens_TornadoRouter))
    let receipt = await tx.wait()
    console.log("InstanceRegistry初始化执行结果,status:" + receipt.status.toString())

    //RelayerRegistry
    tx = await relayerRegistry.initialize(ethers.utils.formatBytes32String(ens_TornadoRouter))
    receipt = await tx.wait()
    console.log("RelayerRegistry初始化执行结果,status:" + receipt.status.toString())

    let instanceData = await instanceRegistry.getAllInstances()
    console.log(instanceData)
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });