'use client'

import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useWeb3 } from '@/context/AuthContext';
import { useToast } from "@/hooks/use-toast"

export function ProfileSetup() {
    
    const { contract } = useWeb3();
    const { toast } = useToast();
    const [profileURL, setProfileURL] = useState('');
    const [isLoading, setIsLoading] = useState(false);
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      try {
        if (!contract) {
          toast({
            title: 'Error',
            description: 'Contract is not available',
            variant: 'destructive',
          });
          setIsLoading(false);
          return;
        }
        const tx = await contract.setProfile(profileURL);
        toast({
          title: 'Profile Setup',
          description: 'Transaction submitted. Waiting for confirmation...',
        });
        await tx.wait();
        toast({
          title: 'Success',
          description: 'Profile has been set successfully!',
        });
      } catch (error: any) {
        toast({
          title: 'Error',
          description: error.message || 'Failed to set profile',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
  
  return (
    <div className="container mx-auto px-4 py-20">
      <h1 className="text-2xl text-start md:text-center font-bold mb-6 text-purple-800">Set Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
        <div className="space-y-2">
          <Label htmlFor="url">Profile Url</Label>
          <Input
              type="url"
              placeholder="Enter your profile URL"
              value={profileURL}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProfileURL(e.target.value)}
              required
            />
            <span>*We support Telegrahp Visit- https://telegra.ph/ *</span>
        </div>
        <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
            {isLoading ? 'Setting up...' : 'Set Profile'}
        </Button>
      </form>
    </div>
  )
}

