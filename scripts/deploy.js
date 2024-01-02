const hre = require('hardhat');

async function main() {
    const CampaignFactory = await hre.ethers.getContractFactory("CampaignFactory")
    const campaignFactory = await CampaignFactory.deploy();

    await campaignFactory.waitForDeployment();

    console.log(
        `CampaignFactory deployed to address: ${campaignFactory.target}` 
    );
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
})