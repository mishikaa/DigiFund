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
  const [userDonations, setUserDonations] = useState<DonorData[]>([]);
  const [donationAmount, setDonationAmount] = useState<number>(0);
  const [description, setDescription] = useState('');
  const [change, setChange] = useState(false);

  const DonateFunds = async() => {
    try {
      await window.ethereum.request({method: "eth_requestAccounts"});
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      let contract;
      if(address) {
        contract = new ethers.Contract(address, Campaign.abi, signer);
        // Converting donation amount to Ether
        const donationAmountInEther = ethers.parseEther(donationAmount.toString());
  
        const transaction = await contract.donate({value: donationAmountInEther});
        await transaction.wait();
        console.log(transaction)
  
        setChange(!change);
        setDonationAmount(0);
  
        toast.success('Donation successful!');
      }
    } catch (error) {
      toast.error(`Unable to make donation. Please try again later.`)
    }
  };

  useEffect(() => {
    const fetchCampaignData = async () => {
      try {
        const fetchedDetails = await fetchCampaignDetails(address);
        // console.log(fetchedDetails);
        
        if(fetchedDetails) {
          setData(fetchedDetails.Data);

          // Fetching the description from the pinata Url
          const response = await fetch(`${fetchedDetails.Data.desc}`);
          const res = await response.text();

          if(res)
            setDescription(res);

          // Setting all the donations
          
          setDonations(fetchedDetails.DonationData)
          
          // Setting user specific donations
          setUserDonations(fetchedDetails.UserDonationData);
        }
      } catch (error) {
        toast.error(`Error fetching Campaign details ${error}`);
      }
    };  

    fetchCampaignData();
  }, [change]);

   return (
    <Wrapper>
      {data && (
        <DetailsWrapper>
          <Title>{data.title}</Title>

          <ContentWrapper>
            <SectionWrapper>
              <ImageWrapper>
                <Image src={data.image} layout="fill" objectFit='contain' alt="Campaign Image" />
              </ImageWrapper>
              <Description>{description} ~ <i></i></Description>
            </SectionWrapper>
            <SectionWrapper>
              <Text>
                <strong>Required Amount:</strong> {parseFloat(data.requiredAmount) - parseFloat(data.receivedAmount)} Matic
              </Text>
              <Text>
                <strong>Received Amount:</strong>{data.receivedAmount} Matic
              </Text>
              <Text>
                <strong>Owner&apos;s address:</strong> {data.owner}
              </Text>
              <DonationSection>
                <DonationInput
                  type="number"
                  value={donationAmount}
                  placeholder='Enter amount to donate'
                  onChange={(e) => setDonationAmount(parseFloat(e.target.value))}
                />
                <DonateButton onClick={DonateFunds}>Donate</DonateButton>
              </DonationSection>

              <DonationItem>
                <strong>Recent Donations:</strong>
                  {donations.map((donation, index) => (
                    <Donation key={index}>
                      <DonationText>{donation.donor.slice(0, 6)}...{donation.donor.slice(39)}</DonationText>
                      <DonationText>{donation.amount} Matic</DonationText>
                      <DonationText>{new Date(donation.timestamp * 1000).toLocaleString()}</DonationText>
                    </Donation>
                  ))}
              </DonationItem>

              <DonationItem>
                <strong>Past Donations:</strong>
                <ul>
                  {userDonations.map((donation, index) => (
                    <Donation key={index}>
                      <DonationText>{donation.donor.slice(0, 6)}...{donation.donor.slice(39)}</DonationText>
                      <DonationText>{donation.amount} Matic</DonationText>
                      <DonationText>{new Date(donation.timestamp * 1000).toLocaleString()}</DonationText>
                    </Donation>
                  ))}
                </ul>
              </DonationItem>
            </SectionWrapper>
          </ContentWrapper>
        </DetailsWrapper>
      )}
    </Wrapper>
  );
};


const Wrapper = styled.div`
  width: 100%;
  `;

const Title = styled.div`
  font-size: 32px;
  text-align: center;
  font-weight: bold;
  text-transform: uppercase;
  margin-bottom: 2.6rem;
  `;
const media = {
  laptop: `@media (max-width: 1024px)`,
  tablet: `@media (max-width: 768px)`,
  mobile: `@media (max-width: 480px)`
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

  ${media.tablet} {
    margin: 0 8%;
  }

  ${media.mobile} {
    margin: 0 4%;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  ${media.laptop} {
    flex-direction: column;
  }
`;

const SectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  align-items: center;

  ${media.tablet} {
    margin-top: 20px;
    width: 80%;
  }
`;

const ImageWrapper = styled.div`
  display: flex;
  width: 80%;
  position: relative;
  height: 50vh;
  margin-bottom: 16px;
  border-radius: 16px;
  overflow: hidden;

  ${media.tablet} {
    width: 80%;
  }
`;

const Description = styled.p`
  text-align: center;
  font-size: 18px;
  color: #dbd9d9;
  width: 80%;
  margin-bottom: 16px;

  ${media.tablet} {
    width: 100%;
  }
`;

const Text = styled.p`
  line-height: 1.25rem;
  font-size: 18px;
  margin-bottom: 8px;

  ${media.tablet} {
    text-align: center;
  }
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
  background-color: ${(props) => props.theme.bgSubDiv};
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

const DonationItem = styled.div`
  margin-top: 16px;
  text-align: left;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  li {
    margin-bottom: 4px;
  }
`;

const Donation = styled.div`
  width: 100%;
  background-color: ${(props)=>props.theme.bgSubDiv};
  padding: 4px 8px;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  padding: 2px;
  `;

const DonationText = styled.div`
  padding: 2px 4px;
`;

export default Details;
