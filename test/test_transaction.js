const { ethers, network, upgrades } = require("hardhat");
async function main() {
    let hash = "0xc4f3993d1beeb5bbe0dcdc80404d2d1834c13d1d8321bc3c9d1cf9cf066db0f9"
    let tx = await ethers.provider.getTransaction(hash)
    console.log(tx)

    let rec = await ethers.provider.getTransactionReceipt(hash)
    console.log(rec)
}
main()