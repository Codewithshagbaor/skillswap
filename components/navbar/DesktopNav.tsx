import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from 'lucide-react'

export default function DesktopNav() {
    return (
        // Desktop Navbar
        <header className="fixed flex items-center justify-between w-full h-16 px-2 md:px-10 bg-white shadow-md">
            <div className='w-1/4'>
                <Link href="/" className="flex items-center ">
                    <Image src="/img/logo.png" alt="Logo" width={40} height={40} />
                    <h1 className="text-lg md:text-xl font-bold text-purple-800 ml-2">SkillSwap</h1>
                </Link>
            </div>

            {/* search bar */}
            <div className="hidden md:flex items-center ml-4 md:ml-6 lg:ml-8 relative max-w-lg">
                <Search className="absolute left-2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="find courses, skills....."
                    className="pl-8 w-full max-w-[200px] md:max-w-[300px]"
                />
            </div>

            {/* nav links */}
            <nav className="flex items-center space-x-4">
                <span className='hidden md:flex items-center space-x-4'>
                    <Link href="/" className="text-gray-600 hover:border-b-purple-800 hover:border-b-2 duration-100 transition">
                        Home
                    </Link>
                    <Link href="/upload" className="text-gray-600 hover:border-b-purple-800 hover:border-b-2 duration-100 transition">
                        Upload
                    </Link>
                    <Link href="/profile" className="text-gray-600 hover:border-b-purple-800 hover:border-b-2 duration-100 transition">
                        Profile
                    </Link>
                </span>

                <Button variant="default" className="bg-purple-600 hover:bg-purple-700 text-white font-semibold w-32">
                    Connect Wallet
                </Button>
            </nav>
        </header>
    )
}
