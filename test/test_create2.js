// import
const {
    ethers,
    deployContract,
    deployFactory,
    getCreate2Address,
    isDeployed
} = require("solidity-create2-deployer");
const path = require("path");
const fs = require("fs");

const jsonPath = path.join(__dirname, '..', 'build', 'Hasher.json');
const outputPath = path.join(__dirname, '..', 'build', 'Addresses.txt')

const jsonStrBuffer = fs.readFileSync(jsonPath, 'utf8');
// console.log(jsonStrBuffer.toString());
let obj = JSON.parse(jsonStrBuffer.toString())

let signers = await ethers.getSigners();

// declare deployment parameters
const salt = "hello";
const bytecode = JSON.stringify(obj.bytecode);
const privateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
const constructorTypes = [];
const constructorArgs = [];
let url = "http://127.0.0.1:8545";
let provider = new ethers.providers.JsonRpcProvider(url);

// Calculate contract address
const computedAddress = getCreate2Address({
    salt: salt,
    contractBytecode: bytecode,
});

// Deploy contract
const { txHash, address, receipt } = await deployContract({
    salt: salt,
    contractBytecode: bytecode,
    signer: signers[0]
});

// Query if contract deployed at address
const success = await isDeployed(address, provider);

// Deploy create2 factory (for local chains only)
const factoryAddress = await deployFactory(provider);
console.log("factoryAddress: "+factoryAddress)