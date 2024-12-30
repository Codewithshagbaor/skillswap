"use client";
import Image from 'next/image';
import React from 'react';
import { motion } from 'framer-motion'

const SplashScreen: React.FC = () => {
    return (
        <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 1, delay: 2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-white"
        >
            <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    delay: 0.5
                }}
                className="relative w-32 h-32 rounded-3xl shadow-lg bg-white flex items-center justify-center flex-col"
            >
                <Image src="/img/logo.png" alt="Logo" width={100} height={100} />

                <h1 className=" text-purple-800 font-semibold">SkillSwap</h1>
            </motion.div>
            <div>

            </div>
        </motion.div>
    );
};

export default SplashScreen;