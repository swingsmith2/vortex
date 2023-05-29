const hre = require("hardhat");

async function main() {
    // TODO Check this address is right before deploying.
    let contractAddress = ""
    await hre.run("verify:verify", {
        address: contractAddress,
        constructorArguments: [
            50,
            "a string argument",
            {
                x: 10,
                y: 5,
            },
            "0xabcdef",
        ],
    });
    console.log("BoxV2 verify success");
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });