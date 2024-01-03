'use client';

import '@styles/globals.css'
import React, { createContext, useState } from 'react';
import Header from '@components/Header';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import themes from '@components/Themes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface AppContextType {
  theme: 'light' | 'dark';
  changeTheme: () => void;
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
})
{
  const App = createContext<AppContextType | undefined>(undefined);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  const changeTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <html lang="en">
      <body>
        <App.Provider value={{changeTheme, theme}}>
          <GlobalStyle />
          <ThemeProvider theme={themes[theme]}>
            <ToastContainer />
            <LayoutWrapper >
              <Header App={App}/>
              {children}
            </LayoutWrapper>
          </ThemeProvider>
        </App.Provider>
      </body>
    </html>
  )
}

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
