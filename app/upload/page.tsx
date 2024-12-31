'use client';

import { useState } from 'react';
import { useWeb3 } from '@/context/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ethers } from 'ethers';
import { useToast } from "@/hooks/use-toast";
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

export default function CreateSkill() {
  const { contract } = useWeb3();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    price: '',
  });

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

      const tx = await contract.createSkill(
        formData.title,
        formData.description,
        formData.image,
        ethers.utils.parseEther(formData.price)
      );
      toast({
        title: 'Creating Skill',
        description: 'Transaction submitted. Waiting for confirmation...',
      });
      await tx.wait();
      toast({
        title: 'Success',
        description: 'Skill created successfully!',
      });
      setFormData({ title: '', description: '', image: '', price: ''});
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create skill',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-20">
      <h1 className="text-2xl text-start md:text-center font-bold mb-6 text-purple-800">Upload a New Course</h1>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Create New Skill</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Course Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Course Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price (in Flow)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Course Image</Label>
              <Input
            type="url"
            placeholder="Image URL"
            value={formData.image}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, image: e.target.value })}
            required
          />
            </div>

            <Button type="submit" disabled={isLoading} className="w-full bg-purple-600 hover:bg-purple-700">
              {isLoading ? 'Creating...' : 'Upload Course'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

