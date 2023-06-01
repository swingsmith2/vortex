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
    let calculateUsdtAddress = calculateAddress(ownerAddress, nonce+1)
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
    let calculateVerifierAddress = calculateAddress(ownerAddress, nonce+2)
    let Verifier = await ethers.getContractFactory("Verifier",signers[0]);
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
    let calculateENSRegistryAddress = calculateAddress(ownerAddress, nonce+3)
    let ENSRegistry = await ethers.getContractFactory("ENSRegistry",signers[0]);
    let eNSRegistry = await ENSRegistry.deploy()
    await eNSRegistry.deployed()

    if (eNSRegistry.address.toLowerCase().toString() === calculateENSRegistryAddress.toLowerCase().toString())
        console.log("发布地址与预先计算地址一致，ENSRegistry: "+eNSRegistry.address.toString()+" calculate address: "+calculateENSRegistryAddress)
    else console.log("发布地址与预先计算地址不一致，ENSRegistry: "+eNSRegistry.address.toString()+" calculate address: "+calculateENSRegistryAddress)

    d = "ENSRegistry deployed to: " + eNSRegistry.address + "\n";
    console.log(d);
    fs.appendFileSync(outputPath, d)
    //
    // //注册ENS tornado.governance.eth
    let ens = await ethers.getContractAt("ENSRegistry",eNSRegistry.address, signers[0])
    let b = await ens.recordExists(ethers.utils.formatBytes32String("tornado.governance.eth"))
    console.log(b)
    let tx = await ens.setRecord(ethers.utils.formatBytes32String("tornado.governance.eth"), ownerAddress, ownerAddress, 100)
    let receipt = await tx.wait()
    // console.log('Transaction receipt: '+JSON.stringify(receipt).toString());
    d = "ENS tornado.governance.eth reserve to: " + ownerAddress + "\n";
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