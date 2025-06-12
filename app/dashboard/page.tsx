"use client"

import { useState, useEffect, useCallback } from "react"
import { signOut, useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  WalletOverview,
  ChargeWalletForm,
  ConvertPointsForm,
  TransferPointsForm,
  TransactionHistoryTable,
} from "@/components/dashboard-components"
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

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const { toast } = useToast()
  const [wallet, setWallet] = useState<WalletData | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoadingData, setIsLoadingData] = useState(true)

  const fetchData = useCallback(async () => {
    if (status === "authenticated") {
      setIsLoadingData(true)
      try {
        const [walletRes, transactionsRes] = await Promise.all([fetch("/api/wallet"), fetch("/api/transactions")])

        const walletData = await walletRes.json()
        const transactionsData = await transactionsRes.json()

        if (walletRes.ok) {
          setWallet(walletData)
        } else {
          console.error("Failed to fetch wallet:", walletData.message)
          setWallet(null)
        }

        if (transactionsRes.ok) {
          setTransactions(transactionsData)
        } else {
          console.error("Failed to fetch transactions:", transactionsData.message)
          setTransactions([])
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        toast({
          title: "Error",
          description: "Failed to load dashboard data.",
          variant: "destructive",
        })
      } finally {
        setIsLoadingData(false)
      }
    }
  }, [status, toast])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (status === "unauthenticated") {
    redirect("/login")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Welcome, {session?.user?.name || session?.user?.email}!</h1>
        <Button onClick={() => signOut()} variant="outline">
          Sign Out
        </Button>
      </header>

      {isLoadingData ? (
        <div className="flex min-h-[200px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <WalletOverview wallet={wallet} />
          <ChargeWalletForm onActionSuccess={fetchData} />
          <ConvertPointsForm onActionSuccess={fetchData} />
          <div className="lg:col-span-3">
            <TransferPointsForm onActionSuccess={fetchData} />
          </div>
          <div className="lg:col-span-3">
            <TransactionHistoryTable transactions={transactions} />
          </div>
        </div>
      )}
    </div>
  )
}
