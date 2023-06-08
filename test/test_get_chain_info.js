const {ethers, network, upgrades} = require("hardhat");

async function getBalance(address) {
    return await ethers.provider.getBalance(address)
}

async function getChainId() {
    let network = await ethers.provider.getNetwork()
    return network.chainId
}

async function main() {
    let signers = await ethers.getSigners()
    let owner = signers[0]
    let ownerAddress = owner.address

    let bal = await getBalance(ownerAddress)
    bal = ethers.utils.formatEther(bal)
    console.log("Address:",ownerAddress," Balance:",bal)

    let id = await getChainId()
    console.log("ChainId:",id)
}
main()