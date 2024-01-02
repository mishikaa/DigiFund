"use  client";
import { ethers } from 'ethers';
import { useState } from 'react';
import styled from 'styled-components';

declare global {
  interface Window {
    ethereum?: any; // This will allow 'ethereum' on the window object
  }
}

const networks = {
  polygon: {
    chainId: `0x${Number(80001).toString(16)}`,
    chainName: "Polygon Testnet",
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18
    },
    rpcUrls: ["https://rpc-mumbai.maticvigil.com/"],
    blockExplorerUrls: ["https://polygonscan.com/"]
  }
};

const Wallet = () => {
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState<number | undefined>();
  const ethereum = typeof window !== 'undefined' ? window.ethereum : undefined;

  const connectWallet = async () => {
    if (ethereum !== 'undefined') {
      await ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.BrowserProvider(ethereum);

      const network = await provider.getNetwork();
      if (network.name !== "matic-mumbai") {
        await ethereum.request({
          method: "wallet_addEthereumChain",
          params: [{
            ...networks["polygon"]
          }]
        });
      }
      const signer = await provider.getSigner();
      let _address = await signer.getAddress();
      setAddress(_address);
      
      // Convert balance to bigint before setting
      let _balance = parseFloat(ethers.formatEther(await provider.getBalance(_address)));
      setBalance(_balance);
    }
  };

  return (
    <WalletWrapper onClick={connectWallet}>
      {address ? <Address>{address.slice(0,6)}...{address.slice(39)}</Address> : <Address>Connect Wallet</Address>}
      {balance && <Balance>{balance.toFixed(3)} matic</Balance>}
    </WalletWrapper>
  );
}

const WalletWrapper = styled.div`
  background-color: ${(props) => props.theme.bgDiv};
  border-radius: 12px;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-items: center;
  cursor: pointer;
`

const Address = styled.h4`
  background-color: ${(props) => props.theme.bgSubDiv};
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80%;
  cursor: pointer;
  text-transform: uppercase;
  margin: 4px;
  font-size: small;
  padding: 0 5px;
  border-radius: 8px;
`

const Balance = styled.h4`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-transform: uppercase;
  font-size: small;
  padding: 0 5px;
`
export default Wallet;
