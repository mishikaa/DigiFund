import { ethers } from 'ethers';
import CampaignFactory from '@artifacts/contracts/campaign.sol/CampaignFactory.json';
import Campaign from '@artifacts/contracts/campaign.sol/Campaign.json';

const fetchCampaignDetails = async (address) => {
    try {
      const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);
      const public_address = process.env.NEXT_PUBLIC_ADDRESS;

      if (public_address) {
            const contract = new ethers.Contract(address, Campaign.abi, provider);
            const details = await contract.campaignDetails();
            
            const donations = contract.filters.donated();
            const allDonations = await contract.queryFilter(donations);

            // Destructuring 
            const { title, requiredAmount, receivedAmount, image, category, desc, owner } = details;
            const formattedRequiredAmount = ethers.formatEther(requiredAmount);
            const formattedReceivedAmount = ethers.formatEther(receivedAmount);  
            
            const Data = 
            {
                title,
                requiredAmount: formattedRequiredAmount,
                receivedAmount: formattedReceivedAmount,
                image,
                desc,
                category,
                owner,
            }
            
            const DonationData = allDonations.map((e) => {
                return {
                    donor: e.args.donor,
                    amount: ethers.formatEther(e.args.amount),
                    timestamp: parseInt(e.args.timestamp)
                }
            })

            return {Data, DonationData};
      } 
    } catch(error) {
        console.error(error)
    }
};


export default fetchCampaignDetails;
