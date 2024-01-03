import React, { useContext } from 'react';
import styled from 'styled-components';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import { App } from '@utils/AppContext';

import Wallet from './Wallet';

interface ThemeToggler {
  theme: 'light' | 'dark';
  changeTheme: () => void;
}

const HeaderRight: React.FC = () => {
  const ThemeToggler = useContext(App);

  return (
    <HeaderRightWrapper>
      <Wallet />
      {isThemeToggler(ThemeToggler) && (
        <ThemeToggle onClick={ThemeToggler.changeTheme}>
          {ThemeToggler.theme === 'light' ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </ThemeToggle>
      )}
    </HeaderRightWrapper>
  );
};

const HeaderRightWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-items: center;
  height: 60%;
  gap: 8px;
  border-radius: 12px;
  margin-right: 8px;

  @media (max-width: 768px) {
    flex-direction: column;
    margin-right: 0;
  }
`;

const ThemeToggle = styled.div`
  background-color: ${(props) => props.theme.bgDiv};
  padding: 0 12px;
  border-radius: 12px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-items: center;
  cursor: pointer;
`;

// Function to check if the object is of type ThemeToggler
const isThemeToggler = (obj: any): obj is ThemeToggler => {
  return obj && typeof obj === 'object' && 'changeTheme' in obj;
};

export default HeaderRight;
