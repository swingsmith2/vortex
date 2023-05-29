// test/Box.js
// Load dependencies
const { ethers, network, upgrades } = require("hardhat");
const fs = require("fs");
const path = require("path");
const BigNumber = require('bignumber.js');

const jsonPath = path.join(__dirname, '..', 'build', 'Hasher.json');
const outputPath = path.join(__dirname, '..', 'build', 'Addresses.txt')

async function main() {
    //hasher
    const jsonStrBuffer = fs.readFileSync(jsonPath, 'utf8');
    // console.log(jsonStrBuffer.toString());
    let obj = JSON.parse(jsonStrBuffer.toString())

    let signers = await ethers.getSigners();

    let Box = new ethers.ContractFactory(obj.abi, obj.bytecode, signers[0])
    let box = await Box.deploy();
    await box.deployed();

    fs.appendFileSync(outputPath, "\n/********************* Start ********************/\n")
    let d = "Hasher deployed to: " + box.address + "\n"
    console.log(d);
    fs.appendFileSync(outputPath, d)

    //USDT
    let USDT = await ethers.getContractFactory("ERC20Token",signers[0]);
    let usdt = await USDT.deploy(new BigNumber(10000000).times(new BigNumber(10).pow(6), 10).toFixed().toString(), "Tether USD", "USDT", 6);
    await usdt.deployed();
    d = "USDT deployed to: " + usdt.address + "\n";
    console.log(d);
    fs.appendFileSync(outputPath, d)

    //Verifier
    let Verifier = await ethers.getContractFactory("Verifier",signers[0]);
    let verifier = await Verifier.deploy();
    await verifier.deployed();
    d = "Verifier deployed to: " + verifier.address + "\n";
    console.log(d);
    fs.appendFileSync(outputPath, d)

    //ENSRegistry
    let ENSRegistry = await ethers.getContractFactory("ENSRegistry",signers[0]);
    let eNSRegistry = await ENSRegistry.deploy()
    await eNSRegistry.deployed()
    d = "ENSRegistry deployed to: " + eNSRegistry.address + "\n";
    console.log(d);
    fs.appendFileSync(outputPath, d)

    //注册ENS tornado.governance.eth
    let ens = await ethers.getContractAt("ENSRegistry",eNSRegistry.address, signers[0])
    let b = await ens.recordExists(ethers.utils.formatBytes32String("tornado.governance.eth"))
    console.log(b)
    let tx = await ens.setRecord(ethers.utils.formatBytes32String("tornado.governance.eth"), signers[0].address, signers[0].address, 100)
    let receipt = await tx.wait()
    // console.log('Transaction receipt: '+JSON.stringify(receipt).toString());
    d = "ENS tornado.governance.eth reserve to: " + signers[0].address + "\n";
    console.log(d);
    fs.appendFileSync(outputPath, d)
    let resolver = await ens.resolver(ethers.utils.formatBytes32String("tornado.governance.eth"))
    console.log("resolver: "+resolver.toString())
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });