"use client";

// Importing necessary libraries and components
import styled from 'styled-components';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { ethers } from 'ethers';
import CampaignFactory from '@artifacts/contracts/campaign.sol/CampaignFactory.json';
import { useEffect, useState } from 'react';
import CampaignCard from '@/components/CampaignCard';

// Main Dashboard component
export default function Dashboard() {
  const [campaignsData, setCampaignsData] = useState<Array<{
    title: any;
    image: any;
    owner: any;
    timeStamp: number;
    amount: string;
    address: any;
  }>>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const web3Provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await web3Provider.getSigner();
        const address = signer.address;

        const provider = new ethers.JsonRpcProvider(
          process.env.NEXT_PUBLIC_RPC_URL
        );

        const public_address = process.env.NEXT_PUBLIC_ADDRESS;
        if(public_address) {
          const contract = new ethers.Contract(
            public_address,
            CampaignFactory.abi,
            provider
          );
  
          const getAllCampaigns = contract.filters.campaignCreated(null, null, address);
          const allCampaigns = await contract.queryFilter(getAllCampaigns);
  
          const allData = allCampaigns.map((e) => {
          const eventData:any = e;
        
          return {
            title: eventData.args?.title,
            image: eventData.args?.imgURI,
            owner: eventData.args?.owner,
            timeStamp: parseInt(eventData.args?.timestamp),
            amount: ethers.formatEther(eventData.args?.requiredAmount),
            address: eventData.args?.campaignAddress,
          };
        });
  
          setCampaignsData(allData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <HomeWrapper>
      {/* Filter Section */}
      <FilterWrapper>
        <FilterAltIcon style={{ fontSize: 40 }} />
        <Category onClick={() => {}}>All</Category>
        <Category onClick={() => {}}>Health</Category>
        <Category onClick={() => {}}>Education</Category>
        <Category onClick={() => {}}>Animal</Category>
      </FilterWrapper>
      {/* Cards Container */}
      <CardsWrapper>
        {/* Mapping through campaignData and rendering CampaignCard component */}
        {campaignsData.map((campaign, index) => (
          <CampaignCard key={index} data={campaign} />
        ))}
      </CardsWrapper>
    </HomeWrapper>
  );
}

// Styled components
const FilterWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 80%;
  margin-top: 15px;
`;

const HomeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const Category = styled.div`
  padding: 10px 15px;
  background-color: ${(props) => props.theme.bgDiv};
  margin: 0px 15px;
  border-radius: 8px;
  font-family: 'Poppins';
  font-weight: normal;
  cursor: pointer;
`;

const CardsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  width: 80%;
  margin-top: 25px;
`;
