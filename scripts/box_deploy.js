// test/Box.js
// Load dependencies
const { ethers, network, upgrades } = require("hardhat");

async function main() {
    let Box = await ethers.getContractFactory("Box");
    let box = await Box.deploy();
    await box.deployed();
    console.log("Box deployed to:", box.address);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });