// test/Box.js
// Load dependencies
const { ethers, network, upgrades } = require("hardhat");
const fs = require("fs");
const path = require("path");
const BigNumber = require('bignumber.js');
const {toBytes32} = require("../dependencies/openzeppelin/scripts/generate/templates/conversion");
const {string} = require("hardhat/internal/core/params/argumentTypes");
const outputPath = path.join(__dirname, '..', 'build', 'Addresses.txt')

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
    let nonce = await getPendingNonce(ownerAddress)
    //预先计算地址并注册ENS
    let calculateUsdtAddress = calculateAddress(ownerAddress, nonce)

    let USDT = await ethers.getContractFactory("ERC20Token",owner);
    let usdt = await USDT.deploy(new BigNumber(10000000).times(new BigNumber(10).pow(6), 10).toFixed().toString(), "Tether USD", "USDT", 6);
    await usdt.deployed();

    if (usdt.address.toLowerCase().toString() === calculateUsdtAddress.toLowerCase().toString())
        console.log("发布地址与预先计算地址一致，usdt: "+usdt.address.toString()+" calculate address: "+calculateUsdtAddress)
    else console.log("发布地址与预先计算地址不一致，usdt: "+usdt.address.toString()+" calculate address: "+calculateUsdtAddress)

    d = "USDT deployed to: " + usdt.address + "\n";
    console.log(d);
    fs.appendFileSync(outputPath, d)
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });