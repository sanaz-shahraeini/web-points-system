import { NextResponse } from "next/server"
import { auth } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"
import { Decimal } from "@prisma/client/runtime/library"

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const { amount } = await req.json()

  if (typeof amount !== "number" || amount <= 0) {
    return NextResponse.json({ message: "Invalid amount" }, { status: 400 })
  }

  try {
    const userId = session.user.id
    const decimalAmount = new Decimal(amount)

    await prisma.$transaction(async (tx) => {
      // Find or create the user's wallet
      const wallet = await tx.wallet.upsert({
        where: { userId },
        update: { balance: { increment: decimalAmount } },
        create: { userId, balance: decimalAmount, points: 0 },
      })

      await tx.transaction.create({
        data: {
          amount: decimalAmount,
          type: "CHARGE",
          description: `Charged wallet with $${decimalAmount.toFixed(2)}`,
          senderId: userId,
          recipientId: userId, // Self-transaction for charges
        },
      })
    })

    return NextResponse.json({ message: "Wallet charged successfully" })
  } catch (error) {
    console.error("Error charging wallet:", error)
    return NextResponse.json({ message: "Failed to charge wallet" }, { status: 500 })
  }
}
