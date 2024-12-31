import { useEffect, useState } from 'react';
import { getContract } from '@/lib/contract';
import { ethers } from 'ethers';
import { CourseCard } from "@/components/course-card/course-card";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Skill {
  id: number;
  title: string;
  price: string;
  ownerAddress: string;
  isAvailable: boolean;
  description: string;
  instructor?: string;
  image: string;
}

interface SkillsListProps {
}

const SkillsList = ({}: SkillsListProps) => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSkills = async () => {
    // Reset states at the start of each fetch
    setError(null);
    setIsLoading(true);

    try {


      const contract = getContract();
      if (!contract) {
        throw new Error('Failed to initialize contract');
      }

      // Fetch skill IDs
      const skillIds = await contract.listSkills();

      // Fetch individual skills with error handling for each
      const fetchedSkills = await Promise.all(
        skillIds.map(async (id: number) => {
          try {
            const skill = await contract.getSkillInfo(id);
            
            // Validate required fields
            if (!skill.title || !skill.price) {
              throw new Error(`Invalid skill data for ID ${id}`);
            }

            return {
              id,
              title: skill.title,
              price: ethers.utils.formatEther(skill.price),
              ownerAddress: skill.creator,
              isAvailable: true,
              description: skill.description || "No description available",
              instructor: skill.creator ? 
                `${skill.creator.slice(0, 6)}...${skill.creator.slice(-4)}` : 
                "Anonymous",
              image: skill.image || "/api/placeholder/400/300",
            };
          } catch (skillError) {
            console.error(`Error fetching skill ${id}:`, skillError);
            return null;
          }
        })
      );

      // Filter out any failed skill fetches
      const validSkills = fetchedSkills.filter((skill): skill is Skill => skill !== null);
      setSkills(validSkills);

    } catch (error) {
      const errorMessage = error instanceof Error ? 
        error.message : 
        'An unknown error occurred while fetching skills';
      
      setError(errorMessage);
      console.error('Skills fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
      fetchSkills();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-600 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="my-4">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (skills.length === 0) {
    return (
      <div className="text-center text-muted-foreground p-4">
        No skills available at this time.
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {status && <p>{status}</p>}
      {skills.map((skill) => (
        <CourseCard
          key={skill.id}
          course={{
            id: skill.id.toString(),
            title: skill.title,
            description: skill.description,
            price: `${skill.price} Flow`,
            instructor: skill.instructor || "Anonymous",
            image: skill.image,
          }}
        />
      ))}
    </div>
  );
};

export default SkillsList;
