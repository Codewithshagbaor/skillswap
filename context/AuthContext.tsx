'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

declare global {
  interface Window {
    ethereum: any;
  }
}
import { ethers } from 'ethers';
import SkillMarketABI from '@/contracts/SkillMarket.json';

interface Web3ContextType {
  account: string | null;
  contract: ethers.Contract | null;
  provider: ethers.providers.Web3Provider | null;
  isLoading: boolean;
  connectWallet: () => Promise<void>;
  disconnect: () => void;
}

const Web3Context = createContext<Web3ContextType>({
  account: null,
  contract: null,
  provider: null,
  isLoading: true,
  connectWallet: async () => {},
  disconnect: () => {},
});

const contractAddress = '0xa2E76FcC07aaC6A2730c14F65110B4FCC1998D31';
const flowEvmChainId = '0x221';

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [account, setAccount] = useState<string | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) return;

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: flowEvmChainId }],
      }).catch(async (switchError: any) => {
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: flowEvmChainId,
              chainName: 'Flow EVM Testnet',
              nativeCurrency: { name: 'Flow Token', symbol: 'FLOW', decimals: 18 },
              rpcUrls: ['https://evm-testnet.flow.com'],
              blockExplorerUrls: ['https://evm-testnet.flowscan.org'],
            }],
          });
        }
      });

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, SkillMarketABI, signer);

      setAccount(accounts[0]);
      setProvider(provider);
      setContract(contract);
      localStorage.setItem('walletConnected', 'true');
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  const disconnect = () => {
    setAccount(null);
    setProvider(null);
    setContract(null);
    localStorage.removeItem('walletConnected');
  };

  useEffect(() => {
    const init = async () => {
      const shouldConnect = localStorage.getItem('walletConnected') === 'true';
      if (shouldConnect) {
        await connectWallet();
      }
      setIsLoading(false);
    };

    init();

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnect();
        } else {
          setAccount(accounts[0]);
        }
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', () => {});
        window.ethereum.removeListener('chainChanged', () => {});
      }
    };
  }, []);

  return (
    <Web3Context.Provider value={{
      account,
      contract,
      provider,
      isLoading,
      connectWallet,
      disconnect,
    }}>
      {children}
    </Web3Context.Provider>
  );
}

export const useWeb3 = () => useContext(Web3Context);