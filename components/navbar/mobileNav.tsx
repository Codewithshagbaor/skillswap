'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Home, Search, Upload, User } from 'lucide-react'
import { useWeb3 } from '@/context/AuthContext'

const navItems = [
  { icon: Home, label: 'Home', href: '/' },
  { icon: Search, label: 'Search', href: '/search' },
  { icon: Upload, label: 'Upload', href: '/upload' },
  { icon: User, label: 'Profile', href: '/profile' },
]

export function MobileNav() {
  const pathname = usePathname()
  const { account, connectWallet } = useWeb3()

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t">
      <div className="flex justify-around items-center h-16">
        {account ? (
          navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center w-full h-full ${
                  isActive ? 'text-purple-600' : 'text-gray-500'
                }`}
              >
                <item.icon className="h-6 w-6" />
                <span className="text-xs mt-1">{item.label}</span>
              </Link>
            )
          })
        ) : (
          <Button variant="default" className="bg-purple-600 hover:bg-purple-700 text-white font-semibold w-32" onClick={connectWallet}>
            Connect Wallet
          </Button>
        )}
      </div>
    </nav>
  )
}