"use client";

import React, { useState, useEffect } from 'react';
import SplashScreen from '@/components/splashscreen/SplashScreen';
import { CourseGrid } from '@/components/course-grid/course-grid';

const Page: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hasSeenSplashScreen = localStorage.getItem('hasSeenSplashScreen');
  
    if (!hasSeenSplashScreen) {
      const timer = setTimeout(() => {
        setLoading(false);
        localStorage.setItem('hasSeenSplashScreen', 'true');
      }, 3000);

      return () => clearTimeout(timer);
    } else {
      setLoading(false);
    }
    
  }, []);

  if (loading) { 
    return <SplashScreen />;
  }

  
  return (
    <div className=''>
      <div className="">
        <div className="container mx-auto mt-12 pt-8 pb-5 md:py-8">
          <h1 className="text-2xl md:text-4xl font-bold text-center text-purple-800">Welcome to SkillSwap</h1>
        </div>
      </div>
      <section className="container py-2 md:pt-5 md:pb-20 px-2 md:px-10 mx-auto">
        <div className="bg-white">
          <div className="text-center md:text-start">
            <h1 className="text-xl md:text-3xl font-bold tracking-tight">Available Courses</h1>
            <p className="my-2 text-muted-foreground ">
              Explore our curated collection of Web3 courses and start learning today
            </p>
          </div>
        </div>
        <CourseGrid />
      </section>
    </div>
  );
};

export default Page;