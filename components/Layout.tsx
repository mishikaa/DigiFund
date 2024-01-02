"use client";
import React, { createContext, useState, ReactNode } from 'react';
import Header from '@components/Header';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import themes from '@components/Themes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface LayoutProps {
  children: ReactNode;
}

interface AppContextType {
  theme: 'light' | 'dark';
  changeTheme: () => void;
}


const App = createContext<AppContextType | undefined>(undefined);

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  const changeTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <App.Provider value={{changeTheme, theme}}>
      <GlobalStyle />
      <ThemeProvider theme={themes[theme]}>
        <ToastContainer />
        <LayoutWrapper >
          <Header />
          {children}
        </LayoutWrapper>
      </ThemeProvider>
    </App.Provider>
  );
};

const GlobalStyle = createGlobalStyle`
   body {
        margin: 0;
        padding: 0;
        z-index: 0;
   }
`;

const LayoutWrapper = styled.div<{ theme: any }>`
  min-height: 100vh;
  background-color: ${(props) => props.theme.bgColor};
  background-image: ${(props) => props.theme.bgImage};
  color: ${(props) => props.theme.color};
`;

export default Layout;
export { App };
