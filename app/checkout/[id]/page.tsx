'use client'

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useParams } from "next/navigation"
import { useState } from "react"

export default function CheckoutPage() {
  const params = useParams() // Access the dynamic route id
  const [isConnecting, setIsConnecting] = useState(false)

  const id = params?.id
  console.log("The ID is:", id)

  const handleConnectWallet = async () => {
    setIsConnecting(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Wallet connected successfully')
    } catch (error) {
      console.error('Failed to connect wallet:', error)
    } finally {
      setIsConnecting(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 mt-20">
      <div className="container px-4 py-8 mx-auto max-w-md">
        <Card className="p-6">
          <div className="grid gap-6 text-center">
            <h1 className="text-2xl font-bold">Connect Your Wallet</h1>
            <p className="text-muted-foreground">
              To complete your purchase, please connect your Web3 wallet
            </p>
            <Button 
              onClick={handleConnectWallet} 
              disabled={isConnecting}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isConnecting ? "Connecting..." : "Connect Wallet"}
            </Button>
          </div>
        </Card>
      </div>
    </main>
  )
}