const { ethers, network, upgrades } = require("hardhat");
const BigNumber = require('bignumber.js');
const path = require("path");
const fs = require("fs");
const jsonPath = path.join(__dirname, '..', 'build', 'Hasher.json');

async function main() {
  const jsonStrBuffer = fs.readFileSync(jsonPath, 'utf8');
  // console.log(jsonStrBuffer.toString());
  let obj = JSON.parse(jsonStrBuffer.toString())

  let signers = await ethers.getSigners();
  let owner = signers[0]
  let ownerAddress = signers[0].address

  let hasherAddr = "0xa6e99A4ED7498b3cdDCBB61a6A607a4925Faa1B7"
  let hasher = await ethers.getContractAt(obj.abi, hasherAddr, owner)

  const ZERO_VALUE = "21663839004416932945382355908790599225266501822907911457504978515578255421292"
  const FIELD_SIZE = "21888242871839275222246405745257275088548364400416034343698204186575808495617"
  let R = ZERO_VALUE
  let C = "0"
  let x = await hasher.MiMCSponge(R, C)
  console.log("x:"+x)
  let xArr = x.toString().split(",")
  R, C = xArr[0], xArr[1]
  R = new BigNumber(R).plus(new BigNumber(ZERO_VALUE)).mod(new BigNumber(FIELD_SIZE),10).toFixed().toString()
  x = await hasher.MiMCSponge(R, C)
  console.log("x:"+x)
  xArr = x.toString().split(",")
  R, C = xArr[0], xArr[1]
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });