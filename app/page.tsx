"use client";

import React, { useState, useEffect } from 'react';
import { useWeb3 } from '@/context/AuthContext';
import SplashScreen from '@/components/splashscreen/SplashScreen';
import SkillsList from '@/components/course-grid/course-grid';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

const Page: React.FC = () => {
  const { account, contract, connectWallet } = useWeb3();
  const [showSplash, setShowSplash] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle splash screen
  useEffect(() => {
    const hasSeenSplashScreen = localStorage.getItem('hasSeenSplashScreen');
    
    if (!hasSeenSplashScreen) {
      const timer = setTimeout(() => {
        setShowSplash(false);
        localStorage.setItem('hasSeenSplashScreen', 'true');
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      setShowSplash(false);
    }
  }, []);

  // Handle wallet connection
  const handleConnectWallet = async () => {
    try {
      setIsConnecting(true);
      setError(null);
      await connectWallet();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="container mx-auto mt-12 pt-8 pb-5 md:py-8">
        <h1 className="text-2xl md:text-4xl font-bold text-center text-purple-800">
          Welcome to SkillSwap
        </h1>
      </div>

      <section className="container py-2 md:pt-5 md:pb-20 px-4 md:px-10 mx-auto">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!account ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Connect Your Wallet</h2>
            <p className="text-muted-foreground mb-6">
              Connect your wallet to explore available courses and start learning
            </p>
            <Button
              onClick={handleConnectWallet}
              disabled={isConnecting}
              size="lg"
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isConnecting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                'Connect Wallet'
              )}
            </Button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-center md:text-start mb-8">
              <h2 className="text-xl md:text-3xl font-bold tracking-tight">
                Available Courses
              </h2>
              <p className="mt-2 text-muted-foreground">
                Explore our curated collection of Web3 courses and start learning today
              </p>
            </div>
            
            <SkillsList />
          </div>
        )}
      </section>
    </div>
  );
};

export default Page;