'use client';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

import CampaignCard from '@/components/CampaignCard';
import { toast } from 'react-toastify';
import fetchData from '../utils/fetchData';

interface CampaignData {
  title: string;
  image: string;
  owner: string;
  timestamp: number;
  amount: string;
  address: string;
}

export default function Home() {
  const [filter, setFilter] = useState<CampaignData[]>([]);

   useEffect(() => {
    const fetchDataAsync = async () => {
      try {
        const { data: fetchedData } = await fetchData();
        // Filter out null values
        const filteredData = (fetchedData || []).filter(
          (item) => item !== null
        ) as CampaignData[];
        // console.log(filteredData)
        setFilter(filteredData);
      } catch (error) {
        toast.error('Error fetching data');
      }
    };

    fetchDataAsync();
  }, []);

  return (
    <HomeWrapper>

      {/* Filter Section */}
      <FilterWrapper>
        <FilterAltIcon style={{fontSize:40}} />
        <Category onClick={() => {}}>All</Category>
        <Category onClick={() => {}}>Health</Category>
        <Category onClick={() => {}}>Education</Category>
        <Category onClick={() => {}}>Animal</Category>
      </FilterWrapper>

      {/* Cards Container */}
      <CardsWrapper>
        {/* Card */}
        {filter.map((e) => {
          return (
            <CampaignCard key={e.title} data={e}/>
          )
        })}
      </CardsWrapper>
    </HomeWrapper>
  )
}


// Styles
const HomeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`
const FilterWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 80%;
  margin-top: 15px;
`
const Category = styled.div`
  padding: 10px 15px;
  background-color: ${(props) => props.theme.bgDiv};
  margin: 0px 15px;
  border-radius: 8px;
  font-family: 'Poppins';
  font-weight: normal;
  cursor: pointer;
`
const CardsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 80%;
  gap: 12px;
  margin-top: 25px;
`