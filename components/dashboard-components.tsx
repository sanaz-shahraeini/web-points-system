"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface WalletData {
  balance: string
  points: number
}

interface Transaction {
  id: string
  type: string
  amount: string
  description: string
  date: string
  party: string
}

export function WalletOverview({ wallet }: { wallet: WalletData | null }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Your Wallet</CardTitle>
        <CardDescription>Current balance and points.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center justify-between">
          <span className="text-lg font-medium">Wallet Balance:</span>
          <span className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">
            ${wallet?.balance ? Number.parseFloat(wallet.balance).toFixed(2) : "0.00"}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-lg font-medium">Total Points:</span>
          <span className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">{wallet?.points ?? 0}</span>
        </div>
      </CardContent>
    </Card>
  )
}

export function ChargeWalletForm({ onActionSuccess }: { onActionSuccess: () => void }) {
  const [amount, setAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const res = await fetch("/api/wallet/charge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Number.parseFloat(amount) }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Failed to charge wallet")
      toast({ title: "Success", description: "Wallet charged successfully!" })
      setAmount("")
      onActionSuccess()
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Charge Wallet</CardTitle>
        <CardDescription>Add funds to your digital wallet.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="charge-amount">Amount ($)</Label>
            <Input
              id="charge-amount"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="50.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className="w-full"
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Charge Wallet"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export function ConvertPointsForm({ onActionSuccess }: { onActionSuccess: () => void }) {
  const [amount, setAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const res = await fetch("/api/wallet/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Number.parseFloat(amount) }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Failed to convert")
      toast({ title: "Success", description: "Wallet converted to points successfully!" })
      setAmount("")
      onActionSuccess()
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Convert to Points</CardTitle>
        <CardDescription>Convert your wallet balance to points ($1 = 100 points).</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="convert-amount">Amount to Convert ($)</Label>
            <Input
              id="convert-amount"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="10.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className="w-full"
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Convert to Points"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export function TransferPointsForm({ onActionSuccess }: { onActionSuccess: () => void }) {
  const [recipientUsername, setRecipientUsername] = useState("")
  const [points, setPoints] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const res = await fetch("/api/points/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipientUsername, points: Number.parseInt(points) }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Failed to transfer points")
      toast({ title: "Success", description: "Points transferred successfully!" })
      setRecipientUsername("")
      setPoints("")
      onActionSuccess()
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transfer Points</CardTitle>
        <CardDescription>Send points to another user.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="recipient-username">Recipient Username</Label>
              <Input
                id="recipient-username"
                type="text"
                placeholder="username"
                value={recipientUsername}
                onChange={(e) => setRecipientUsername(e.target.value)}
                required
                className="w-full"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="points-amount">Points to Transfer</Label>
              <Input
                id="points-amount"
                type="number"
                step="1"
                min="1"
                placeholder="100"
                value={points}
                onChange={(e) => setPoints(e.target.value)}
                required
                className="w-full"
              />
            </div>
          </div>
          <Button type="submit" className="w-full sm:w-auto" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Transfer Points"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export function TransactionHistoryTable({ transactions }: { transactions: Transaction[] }) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
        <CardDescription>A complete record of your wallet and point activities.</CardDescription>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <p className="text-center text-muted-foreground">No transactions yet.</p>
        ) : (
          <div className="overflow-auto -mx-4 px-4 sm:mx-0 sm:px-0">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="whitespace-nowrap">Type</TableHead>
                  <TableHead className="whitespace-nowrap">Amount</TableHead>
                  <TableHead className="hidden sm:table-cell">Description</TableHead>
                  <TableHead className="hidden md:table-cell">Party</TableHead>
                  <TableHead className="text-right whitespace-nowrap">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell className="font-medium whitespace-nowrap">{tx.type}</TableCell>
                    <TableCell className="whitespace-nowrap">{tx.amount}</TableCell>
                    <TableCell className="hidden sm:table-cell">{tx.description}</TableCell>
                    <TableCell className="hidden md:table-cell">{tx.party}</TableCell>
                    <TableCell className="text-right whitespace-nowrap text-sm text-muted-foreground">{tx.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
