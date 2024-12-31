'use client';

import { useState, useEffect } from 'react';
import { useWeb3 } from '@/context/AuthContext'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface Transaction {
  hash: string;
  type: 'purchase' | 'create' | 'profile';
  timestamp: number;
  status: 'success' | 'failed';
}

export function TransactionHistory() {
  const { contract, account } = useWeb3();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!contract || !account) return;

      try {
        // Get events from contract
        const filter = {
          fromBlock: 0,
          toBlock: 'latest',
        };

        const skillCreatedEvents = await contract.queryFilter(contract.filters.SkillCreated(null, account), filter.fromBlock, filter.toBlock);
        const skillPurchasedEvents = await contract.queryFilter(contract.filters.SkillPurchased(null, account), filter.fromBlock, filter.toBlock);
        const profileSetEvents = await contract.queryFilter(contract.filters.ProfileSet(account), filter.fromBlock, filter.toBlock);

        const allTransactions = [
          ...skillCreatedEvents.map(event => ({
            hash: event.transactionHash,
            type: 'create' as const,
            timestamp: event.blockNumber,
            status: 'success' as const
          })),
          ...skillPurchasedEvents.map(event => ({
            hash: event.transactionHash,
            type: 'purchase' as const,
            timestamp: event.blockNumber,
            status: 'success' as const
          })),
          ...profileSetEvents.map(event => ({
            hash: event.transactionHash,
            type: 'profile' as const,
            timestamp: event.blockNumber,
            status: 'success' as const
          }))
        ].sort((a, b) => b.timestamp - a.timestamp);

        setTransactions(allTransactions);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [contract, account]);

  if (isLoading) {
    return <Loader2 className="h-8 w-8 animate-spin" />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-purple-800">Transaction History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {transactions.map(tx => (
            <div key={tx.hash} className="flex justify-between items-center p-2 bg-gray-100 rounded">
              <div>
                <p className="font-bold">{tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}</p>
                <p className="text-sm text-gray-500">
                  <a 
                    href={`https://evm-testnet.flowscan.org/tx/${tx.hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {tx.hash.slice(0, 6)}...{tx.hash.slice(-4)}
                  </a>
                </p>
              </div>
              <span className={tx.status === 'success' ? 'text-green-500' : 'text-red-500'}>
                {tx.status.toLocaleUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}