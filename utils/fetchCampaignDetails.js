import { ethers } from 'ethers';
import Campaign from '@artifacts/contracts/campaign.sol/Campaign.json';

const fetchCampaignDetails = async (address) => {
    try {
        const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);

        await window.ethereum.request({method: "eth_requestAccounts"});
        const provider2 = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider2.getSigner();
        const currentUserAddress = signer.address;
        
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
        
        const userDonations = contract.filters.donated(currentUserAddress);
        const userAllDonations  = await contract.queryFilter(userDonations);
        const DonationData = allDonations.map((e) => {
            return {
                donor: e.args.donor,
                amount: ethers.formatEther(e.args.amount),
                timestamp: parseInt(e.args.timestamp)
            }
        })

            const UserDonationData = userAllDonations.map((e) => {
                return {
                    donor: e.args.donor,
                    amount: ethers.formatEther(e.args.amount),
                    timestamp: parseInt(e.args.timestamp)
                }
            })

            return {Data, DonationData, UserDonationData};
    } catch(error) {
        console.error(error)
    }
};


export default fetchCampaignDetails;
