'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import WalletConnectProvider from '@walletconnect/web3-provider';
import SkillMarketABI from '@/contracts/SkillMarket.json';

declare global {
  interface Window {
    ethereum: any;
  }
}

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
      let web3Provider;

      if (window.ethereum) {
        web3Provider = window.ethereum;
      } else {
        web3Provider = new WalletConnectProvider({
          rpc: {
            [parseInt(flowEvmChainId, 16)]: 'https://evm-testnet.flow.com',
          },
        });
        await web3Provider.enable();
      }

      const accounts = await web3Provider.request({
        method: 'eth_requestAccounts',
      });

      await web3Provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: flowEvmChainId }],
      }).catch(async (switchError: any) => {
        if (switchError.code === 4902) {
          await web3Provider.request({
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

      const ethersProvider = new ethers.providers.Web3Provider(web3Provider);
      const signer = ethersProvider.getSigner();
      const contract = new ethers.Contract(contractAddress, SkillMarketABI, signer);

      setAccount(accounts[0]);
      setProvider(ethersProvider);
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