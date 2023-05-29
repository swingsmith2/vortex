// test/Box.js
// Load dependencies
const { ethers, network, upgrades } = require("hardhat");
const fs = require("fs");
const path = require("path");
const BigNumber = require('bignumber.js');
const {toBytes32} = require("../dependencies/openzeppelin/scripts/generate/templates/conversion");
const {string} = require("hardhat/internal/core/params/argumentTypes");
const outputPath = path.join(__dirname, '..', 'build', 'Addresses.txt')

async function main() {
    let signers = await ethers.getSigners();
    let owner = signers[0]
    // console.log(owner)
    // //注册ENS
    // let ens = await ethers.getContractAt("ENSRegistry","0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9", owner)
    // let b = await ens.recordExists(ethers.utils.formatBytes32String("tornado.governance.eth"))
    // console.log(b)
    // let tx = await ens.setRecord(ethers.utils.formatBytes32String("tornado.governance.eth"), owner.address, owner.address, 100)
    // let receipt = await tx.wait()
    // // console.log('Transaction receipt: '+JSON.stringify(receipt).toString());
    // let d = "ENS tornado.governance.eth reserve to: " + owner.address + "\n";
    // console.log(d);
    // fs.appendFileSync(outputPath, d)
    // let resolver = await ens.resolver(ethers.utils.formatBytes32String("tornado.governance.eth"))
    // console.log("resolver: "+resolver.toString())
    //
    // //TORN
    // let vesting = {
    //     to : ethers.utils.formatBytes32String("tornado.governance.eth"),
    //     amount : (new BigNumber(10000000).times(new BigNumber(10).pow(18),10)).toFixed().toString()
    // }
    // let vestings = [vesting,]
    // let TORN = await ethers.getContractFactory("TORN", owner);
    // let torn = await TORN.deploy(ethers.utils.formatBytes32String("tornado.governance.eth"), 1, vestings)
    // await torn.deployed()
    // d = "TORN deployed to: " + torn.address + "\n";
    // console.log(d);
    // fs.appendFileSync(outputPath, d)


}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });