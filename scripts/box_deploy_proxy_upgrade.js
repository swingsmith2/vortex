const { ethers, upgrades } = require("hardhat");

async function main() {
    // TODO Check this address is right before deploying.
    const deployedProxyAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";

    const BoxV2 = await ethers.getContractFactory(
        "BoxV2"
    );
    console.log("Upgrading BoxV2...");

    await upgrades.upgradeProxy(deployedProxyAddress, BoxV2);
    console.log("BoxV2 upgraded");
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });