'use client';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import fetchCampaignDetails from '@utils/fetchCampaignDetails';
import { toast } from 'react-toastify';
import { ethers } from 'ethers';
import Campaign from '@artifacts/contracts/campaign.sol/Campaign.json';

interface CampaignData {
  title: string;
  requiredAmount: string;
  receivedAmount: string,
  image: string;
  desc: string;
  category: string;
  owner: string;
}

interface DonorData {
  donor: string;
  amount: string;
  timestamp: number;
}
interface DetailsData {
  Data: CampaignData;
  DonationData?: DonorData[]; 
}

const Details: React.FC = () => {  
  const  address = usePathname().split('/').pop();
  
  const [data, setData] = useState<CampaignData | null>(null)
  const [donations, setDonations] = useState<DonorData[]>([]);
  const [donationAmount, setDonationAmount] = useState();
  const [amount, setAmount] = useState<number>(0);
  const [description, setDescription] = useState('');
  const [change, setChange] = useState(false);

  const handleDonate = () => {
    
  };

  useEffect(() => {
    const request = async () => {
      let descriptionData;

      await window.ethereum.request({method: 'eth_requestAccounts'});
      const web3Provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await web3Provider.getSigner();
      const Address = await signer.getAddress();

      const provider = new ethers.JsonRpcProvider(
        process.env.NEXT_PUBLIC_RPC_URL
      )

      const contract = new ethers.Contract(
        Address,
        Campaign.abi,
        provider
      )

      const myDonations = contract.filters.donated(Address);
      const myAllDonations  = await contract.queryFilter(myDonations);
    }

    
    const fetchCampaignData = async () => {
      try {
        const fetchedDetails = await fetchCampaignDetails(address);
        console.log(fetchedDetails);
        
        if(fetchedDetails) {
          setData(fetchedDetails.Data);

          // Fetching the description from the pinata Url
          const response = await fetch(`${fetchedDetails.Data.desc}`);
          const res = await response.text();
          console.log(res)
          if(res)
            setDescription(res);

          // Setting the donations
          
          setDonations(fetchedDetails.DonationData)
        }
      } catch (error) {
        toast.error(`Error fetching Campaign details ${error}`);
      }
    };

    fetchCampaignData();
  }, []);

  return (
    <Wrapper>
      {data && (
        <DetailsWrapper>
        <Title>{data.title}</Title>
      
        <ContentWrapper>
            <SectionWrapper>
              <ImageWrapper>
                <Image src={data.image} layout="fill" alt="Campaign Image" />
              </ImageWrapper>
              <Description>{description} ~  <i></i></Description>
            </SectionWrapper>
            <SectionWrapper>
              
              <Text>
                  <strong>Required Amount:</strong> {data.requiredAmount} Matic
              </Text>
              <Text>
                <strong>Received Amount:</strong>{data.receivedAmount}Matic
              </Text>
              <Text>
                <strong>Onwer's address:</strong> {data.owner}
              </Text>
              <DonationSection>
                <DonationInput
                  type="number"
                  value={donationAmount}
                  placeholder='Enter amount to donate'
                  onChange={(e) => setDonationAmount(parseInt(e.target.value))}
                />
                <DonateButton onClick={handleDonate}>Donate</DonateButton>
              </DonationSection>
              <DonationHidescription>
                <strong>Recent Donations:</strong>
                <ul>
                  {donations.map((donation, index) => (
                    <li key={index}>Donation #{index + 1}: {donation} Matic</li>
                  ))}
                </ul>
              </DonationHidescription>
            </SectionWrapper>
        </ContentWrapper>
        </DetailsWrapper>
      )}
    </Wrapper>
  );
};

const DetailsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 16px;
  margin: 0 12%;
  background-color: ${(props) => props.theme.bgDiv};
  border-radius: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Wrapper = styled.div`
  width: 100%;
`;

const ContentWrapper = styled.div `
    display: flex;
    align-items: flex-start;
    justify-content: center;
    width: 100%;
`
const Title = styled.div`
  font-size: 32px;
  text-align: center;
  font-weight: bold;
  text-transform: uppercase;
  margin-bottom: 2.6rem;
`;

const SectionWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    align-items: center;
`
const ImageWrapper = styled.div`
  display: flex;
  width: 80%;
  position: relative;
  height: 50vh;
  margin-bottom: 16px;
  border-radius: 16px;
  overflow: hidden;
`;

const Description = styled.p`
  text-align: center;
  font-size: 18px;
  color: #dbd9d9;
  width: 80%;
  margin-bottom: 16px;
`;

const Text = styled.p`
  line-height: 1.25rem;
  font-size: 18px;
  margin-bottom: 8px;
`;

const DonationSection = styled.div`
  margin-top: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 8px;
`;

const DonationInput = styled.input`
  padding: 14px;
  flex: 1;
  margin-right: 8px;
  background-color: ${(props)=>props.theme.bgSubDiv};
  color: white;
  outline: none;
  border: none;
  border-radius: 2px;
`;

const DonateButton = styled.button`
  padding: 14px;
  flex: 1;
  background-color: #00b712;
  color: white;
  border: none;
  border-radius: 35px;
  cursor: pointer;
  transition: all .3s ease;
  &:hover {
    opacity: .8;
    transform: scale(1.1);
  }
`;

const DonationHidescription = styled.div`
  margin-top: 16px;
  text-align: left;

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li {
    margin-bottom: 4px;
  }
`;

export default Details;
