"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import DesktopNav from '@/components/navbar/DesktopNav';
import SplashScreen from '@/components/splashscreen/SplashScreen';

const Page: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <div className=''>
      <DesktopNav />
      <div className="">
        <div className="container mx-auto py-8">
          <h1 className="text-2xl md:text-4xl font-bold text-center text-purple-800">Welcome to SkillSwap</h1>
          <p className="text-center text-gray-600 mt-2">
            Learn new skills, teach others, and earn money
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;