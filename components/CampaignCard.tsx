'use client';

import Image from 'next/image';
import React from 'react';
import styled from 'styled-components';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import PaidIcon from '@mui/icons-material/Paid';
import EventIcon from '@mui/icons-material/Event';
import Link from 'next/link';

interface DataProps {
  title: string;
  image: string;
  owner: string;
  timestamp: number;
  amount: string; 
  address: any;
}

const CampaignCard:React.FC<{data: DataProps}> = ({ data }) => {
  return (
    <Card>
      <ImageWrapper>
        <Image
          src={data.image}
          alt="Campaign-image"
          layout="fill"
        />
      </ImageWrapper>
      <CardContent>
        <Title>{data.title}</Title>
        <CardData>
          <Text>
            <AccountBoxIcon />
            <Subtitle>Owner</Subtitle>
          </Text>
          <Text>{`${data.owner.slice(0, 6)}...${data.owner.slice(39)}`}</Text>
        </CardData>
        <CardData>
          <Text>
            <PaidIcon />
            <Subtitle>Amount</Subtitle>
          </Text>
          <Text>{`${data.amount} Matic`}</Text>
        </CardData>
        <CardData>
          <Text>
            <EventIcon />
            <Subtitle>Started On</Subtitle>
          </Text>
          <Text>
            {new Date(data.timestamp * 1000).toLocaleString()}
          </Text> 
         </CardData>
        <CampaignDetails>
          <DetailItem>
            <Button><Link href={`/details/${data.address}`}>View Details</Link></Button>
          </DetailItem>
        </CampaignDetails>
      </CardContent>
    </Card>
  );
};

const Card = styled.div`
  background-color: ${(props) => props.theme.bgDiv};
  border-radius: 12px;
  overflow: hidden;
  width: 100%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin: 16px;

  &:hover {
    transform: translateY(-10px);
    transition: transform 0.5s;
  }

  &:not(:hover) {
    transition: transform 0.5s;
  }

  @media (min-width: 768px) {
    width: 48%;
  }

  @media (min-width: 1024px) {
    width: 30%;
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  height: 30vh;
  border-radius: 12px 12px 0 0;
`;

const CardContent = styled.div`
  padding: 16px;
`;

const Title = styled.h2`
  font-family: 'Roboto';
  font-size: 24px;
  margin: 0;
`;

const Subtitle = styled.span`
  padding: 4px;
`
const CardData = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
  background-color: ${(props) => props.theme.bgSubDiv};
  padding: 10px;
  cursor: pointer;
`;

const Text = styled.p`
  display: flex;
  align-items: center;
  margin: 0;
  padding: 0;
  font-family: 'Roboto';
  font-size: 16px;
`;

const CampaignDetails = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 12px;
`;

const DetailItem = styled.div`
  flex: 1;
  text-align: center;
`;

const Button = styled.button`
  display: block;
  width: 100%;
  padding: 12px;
  background-color: #00b712;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-family: 'Roboto';
  text-transform: uppercase;
  font-size: 14px;
  font-weight: bold;

  &:hover {
    background-color: #5aff15;
  }
`;

export default CampaignCard;
