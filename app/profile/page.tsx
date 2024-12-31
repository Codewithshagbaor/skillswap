"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import React, { useState, useEffect } from 'react';
import { ProfileSetup } from '@/components/user-profile/ProfileSetup';
import { TransactionHistory } from '@/components/user-profile/TransactionHistory';
import { useWeb3 } from '@/context/AuthContext'
import { ethers } from 'ethers';
import { Button } from '@/components/ui/button';
import { useTelegramAuth } from '@/context/TelegramAuthContext';
import { Loader2 } from 'lucide-react';

interface UserSkill {
  id: string;
  title: string;
  price: string;
  purchases: number;
}

const UnauthorizedState = () => {
  const { connectWallet } = useWeb3();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-purple-800">Unauthorized Access</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-6 text-muted-foreground">Please connect your wallet to view your profile</p>
          <Button onClick={connectWallet} className="bg-purple-600 hover:bg-purple-700">
            Connect Wallet
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

const LoadingState = () => (
  <div className="flex justify-center items-center min-h-screen">
    <Loader2 className="h-8 w-8 animate-spin" />
    <p className="text-gray-500 dark:text-gray-400">Loading...</p>
  </div>
);

export default function ProfilePage() {
  const { account, contract, disconnect } = useWeb3();
  const [profileSet, setProfileSet] = useState(false);
  const [profileUrl, setProfileUrl] = useState('');
  const [userSkills, setUserSkills] = useState<UserSkill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const { userID, username, windowHeight } = useTelegramAuth();
  
  useEffect(() => {
    const initialize = async () => {
      if (!account) {
        setIsInitialized(true);
        setIsLoading(false);
        return;
      }

      if (!contract) {
        setIsLoading(false);
        return;
      }

      try {
        const [isSet, url, skillIds] = await Promise.all([
          contract.isProfileSet(account),
          contract.getProfileURL(account),
          contract.listSkillsByUser(account)
        ]);

        const skills = await Promise.all(
          skillIds.map(async (id: number) => {
            const skill = await contract.getSkillInfo(id);
            return {
              id: id.toString(),
              title: skill.title,
              price: ethers.utils.formatEther(skill.price),
              purchases: 0
            };
          })
        );

        setProfileSet(isSet);
        setProfileUrl(url);
        setUserSkills(skills);
      } catch (error) {
        console.error('Error initializing profile:', error);
      } finally {
        setIsInitialized(true);
        setIsLoading(false);
      }
    };

    initialize();
  }, [contract, account]);

  // Don't render anything until we've initialized
  if (!isInitialized) {
    return <LoadingState />;
  }

  // Show unauthorized state if no account is connected
  if (!account) {
    return <UnauthorizedState />;
  }

  // Show loading state while fetching data
  if (isLoading) {
    return <LoadingState />;
  }
  
  // Show profile setup if profile is not set
  if (!profileSet) {
    return <ProfileSetup />;
  }

  return (
    <div className="container mx-auto px-4 py-20">
      <h1 className="text-2xl font-bold mb-6 text-purple-800">User Profile</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={username || 'Not available'} alt={username || 'Not available'} />
              <AvatarFallback>{(username || 'N').charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-purple-800">{username || 'Not available'}</CardTitle>
              <p className="text-sm text-muted-foreground">Address: {account}</p>
              <p className="text-sm text-muted-foreground">User ID: {userID || 'Not available'}</p>
              <p className="text-sm text-muted-foreground">Profile URL: {profileUrl}</p>
            </div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-purple-800">Course Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Courses Uploaded</dt>
                <dd className="text-2xl font-bold">{userSkills.length}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Courses Purchased</dt>
                <div className="space-y-2 mt-2">
                  {userSkills.map(skill => (
                    <div key={skill.id} className="flex justify-between items-center p-2 bg-gray-100 rounded">
                      <span>{skill.title}</span>
                      <span>{skill.price} FLOW</span>
                    </div>
                  ))}
                </div>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>
      <br />
      <div className="grid gap-6 md:grid-cols-2">
        <TransactionHistory />
      </div>
      <div className="flex justify-center mt-6">
        <Button onClick={disconnect} variant="destructive">Disconnect Wallet</Button>
      </div>
    </div>
  );
}