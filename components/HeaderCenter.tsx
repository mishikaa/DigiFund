'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import styled from 'styled-components';

const HeaderCenter: React.FC = () => {
  const pathname = usePathname();

  return (
    <HeaderCenterWrapper>
      <Link href="/">
        <HeaderLinks $active={pathname === "/" ? "true" : "false"}>
          Campaigns
        </HeaderLinks>
      </Link>
      <Link href="/createCampaign">
        <HeaderLinks $active={pathname === "/createCampaign" ? "true" : "false"}>
          Create Campaign
        </HeaderLinks>
      </Link>
      <Link href="/dashboard">
        <HeaderLinks $active={pathname === "/dashboard" ? "true" : "false"}>
          Dashboard
        </HeaderLinks>
      </Link>
    </HeaderCenterWrapper>
  );
};

const HeaderCenterWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-items: center;
  background-color: ${(props) => props.theme.bgDiv};
  color: ${(props) => props.theme.color};
  height: 60%;
  gap: 8px;
  border-radius: 12px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

interface HeaderLinksProps {
  $active: string;
}

const HeaderLinks = styled.div<HeaderLinksProps>`
  color: ${(props) => props.theme.color};
  background-color: ${(props) =>
    props.$active === "true" ? props.theme.bgSubDiv : props.theme.bgDiv};
  padding: 6px 12px;
  border-radius: 12px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-items: center;
  cursor: pointer;
  margin: 3px;
`;

export default HeaderCenter;
