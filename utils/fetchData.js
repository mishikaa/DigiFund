import { ethers } from 'ethers';
import CampaignFactory from '@artifacts/contracts/campaign.sol/CampaignFactory.json';

const fetchData = async () => {
  try {
    const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);
    const public_address = process.env.NEXT_PUBLIC_ADDRESS;

    if (public_address) {
      const contract = new ethers.Contract(public_address, CampaignFactory.abi, provider);
      const getCampaigns = contract.filters.campaignCreated();
      const allCampaigns = await contract.queryFilter(getCampaigns);

      const allData = allCampaigns.map((log) => {
        const parsedLog = contract.interface.parseLog({
          topics: [...log.topics],
          data: log.data,
        });

        if (parsedLog) {
          return {
            title: parsedLog.args.title,
            image: parsedLog.args.imgURL,
            owner: parsedLog.args.owner,
            timestamp: parseInt(parsedLog.args.timestamp),
            amount: ethers.formatEther(parsedLog.args.requiredAmount),
            address: parsedLog.args.campaignAddress
          };
        }
        return null;
      }).filter((item) => item !== null);

      return { data: allData };
    } else {
      throw new Error("Public address is not defined.");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export default fetchData;
