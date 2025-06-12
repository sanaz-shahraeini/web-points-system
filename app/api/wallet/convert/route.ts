import { NextResponse } from "next/server"
import { auth } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"
import { Decimal } from "@prisma/client/runtime/library"

const CONVERSION_RATIO = 100 // $1 = 100 points

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
    const pointsToConvert = Math.floor(decimalAmount.toNumber() * CONVERSION_RATIO)

    await prisma.$transaction(async (tx) => {
      const wallet = await tx.wallet.findUnique({
        where: { userId },
      })

      if (!wallet || wallet.balance.lessThan(decimalAmount)) {
        throw new Error("Insufficient wallet balance")
      }

      await tx.wallet.update({
        where: { userId },
        data: {
          balance: { decrement: decimalAmount },
          points: { increment: pointsToConvert },
        },
      })

      await tx.transaction.create({
        data: {
          amount: decimalAmount,
          type: "CONVERSION",
          description: `Converted $${decimalAmount.toFixed(2)} to ${pointsToConvert} points`,
          senderId: userId,
          recipientId: userId, // Self-transaction for conversions
        },
      })
    })

    return NextResponse.json({ message: "Conversion successful" })
  } catch (error: any) {
    console.error("Error converting wallet to points:", error)
    return NextResponse.json({ message: error.message || "Failed to convert wallet to points" }, { status: 500 })
  }
}
