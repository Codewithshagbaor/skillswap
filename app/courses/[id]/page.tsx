"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, GraduationCap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { getContract } from '@/lib/contract';
import { useWeb3 } from '@/context/AuthContext';
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from 'lucide-react';

const fetchSkillData = async (skillId: string) => {
  try {
    const contract = getContract();
    const skillInfo = await contract.getSkillInfo(skillId);

    return {
      id: skillId,
      title: skillInfo.title,
      description: skillInfo.description,
      price: ethers.utils.formatEther(skillInfo.price),
      instructor: skillInfo.creator,
      image: skillInfo.image || "/api/placeholder/400/300",
    };
  } catch (error) {
    console.error("Error fetching skill data:", error);
    throw new Error("Failed to load skill data.");
  }
};

export default function SkillPage() {
  const { account, contract } = useWeb3();
  const params = useParams();
  const { toast } = useToast();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id || "";
  const [skill, setSkill] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [purchaseLoading, setPurchaseLoading] = useState<string | null>(null);

  const purchaseSkill = async (skill: any) => {
    if (!contract || !account) return;

    try {
      setPurchaseLoading(skill.id);
      const tx = await contract.purchaseSkill(skill.id, {
        value: ethers.utils.parseEther(skill.price),
      });
      await tx.wait();
      alert('Skill purchased successfully!');
    } catch (error) {
      console.error('Error purchasing skill:', error);
      alert('Failed to purchase skill');
    } finally {
      setPurchaseLoading(null);
    }
  };

  useEffect(() => {
    const loadSkill = async () => {
      try {
        const skillData = await fetchSkillData(id);
        setSkill(skillData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadSkill();
    }
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <p>Loading skill details...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-500">{error}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 mt-10 md:m-20">
      <div className="container px-4 py-8 mx-auto">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="relative aspect-video mb-6">
              <Image
                src={skill.image}
                alt={skill.title}
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <h1 className="text-3xl font-bold mb-4">{skill.title}</h1>
            <p className="text-muted-foreground mb-6">{skill.description}</p>
          </div>
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-6">
              <div className="grid gap-6">
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-purple-600">{skill.price} Flow</span>
                </div>
                <div className="grid gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    {skill.instructor}
                  </div>
                </div>
                {account?.toLowerCase() !== skill.instructor.toLowerCase() ? (
              <Button
                className="w-full bg-purple-600 hover:bg-purple-700"
                onClick={() => purchaseSkill(skill)}
                disabled={purchaseLoading === skill.id}
              >
                {purchaseLoading === skill.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Purchase Skill'
                )}
              </Button>
            ) : (
              <p className="text-sm text-muted-foreground">Your skill</p>
            )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
