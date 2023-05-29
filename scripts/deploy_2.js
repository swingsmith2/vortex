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