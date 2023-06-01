// test/Box.js
// Load dependencies
const { ethers, network, upgrades } = require("hardhat");
const fs = require("fs");
const path = require("path");
const BigNumber = require('bignumber.js');
const {toBytes32} = require("../dependencies/openzeppelin/scripts/generate/templates/conversion");
const {string} = require("hardhat/internal/core/params/argumentTypes");
const outputPath = path.join(__dirname, '..', 'build', 'Addresses.txt')

const { Web3 } = require('web3'); //  web3.js has native ESM builds and (`import Web3 from 'web3'`)
// Set up a connection to the Ganache network
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

// deterministically computes the smart contract address given
// the account the will deploy the contract (factory contract)
// the salt as uint256 and the contract bytecode
function buildCreate2Address(creatorAddress, saltHex, byteCode) {
    return `0x${web3.utils.sha3(`0x${[
        'ff',
        creatorAddress,
        saltHex,
        web3.utils.sha3(byteCode)
    ].map(x => x.replace(/0x/, ''))
        .join('')}`).slice(-40)}`.toLowerCase()
}

// converts an int to uint256
function numberToUint256(value) {
    const hex = value.toString(16)
    return `0x${'0'.repeat(64-hex.length)}${hex}`
}

// encodes parameter to pass as contract argument
function encodeParam(dataType, data) {
    return web3.eth.abi.encodeParameter(dataType, data)
}

// returns true if contract is deployed on-chain
async function isContract(address) {
    const code = await web3.eth.getCode(address)
    return code.slice(2).length > 0
}

async function main() {

    let signers = await ethers.getSigners();
    let owner = signers[0]

    let Deploy = await ethers.getContractFactory("Deploy", owner);
    let deploy = await Deploy.deploy()
    await deploy.deployed()
    d = "Deploy deployed to: " + deploy.address + "\n";
    console.log(d);
    fs.appendFileSync(outputPath, d)

    let tx = await deploy.deploy_2(123456789)
    let rec = await tx.wait()
    console.log("status：" + JSON.stringify(rec.status))
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });