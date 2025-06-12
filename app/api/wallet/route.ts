import { NextResponse } from "next/server"
import { auth } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const userId = session.user.id
    const wallet = await prisma.wallet.findUnique({
      where: { userId },
    })

    if (!wallet) {
      // If no wallet exists, return default values
      return NextResponse.json({ balance: "0.00", points: 0 })
    }

    return NextResponse.json({
      balance: wallet.balance.toFixed(2),
      points: wallet.points,
    })
  } catch (error) {
    console.error("Error fetching wallet:", error)
    return NextResponse.json({ message: "Failed to fetch wallet" }, { status: 500 })
  }
}
