import { NextResponse } from "next/server"
import { auth } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"
import { Decimal } from "@prisma/client/runtime/library"
import { PrismaClient } from "@prisma/client"

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const { recipientUsername, points } = await req.json()

  if (typeof points !== "number" || points <= 0 || !Number.isInteger(points)) {
    return NextResponse.json({ message: "Invalid points amount" }, { status: 400 })
  }
  if (!recipientUsername || typeof recipientUsername !== "string") {
    return NextResponse.json({ message: "Invalid recipient username" }, { status: 400 })
  }

  try {
    const senderId = session.user.id

    // First, check if sender has enough points (outside transaction)
    const senderWallet = await prisma.wallet.findUnique({
      where: { userId: senderId },
    })

    if (!senderWallet || senderWallet.points < points) {
      return NextResponse.json({ message: "Insufficient points for transfer" }, { status: 400 })
    }

    // Find or create recipient (outside transaction)
    let recipientUser = await prisma.user.findFirst({
      where: { name: recipientUsername },
    })

    if (!recipientUser) {
      recipientUser = await prisma.user.findUnique({
        where: { email: recipientUsername },
      })
    }

    if (!recipientUser) {
      recipientUser = await prisma.user.create({
        data: {
          email: `${recipientUsername.toLowerCase()}@demo.com`,
          name: recipientUsername,
          password: "demo-user-password", // This is just for demo purposes
        },
      })
    }

    if (senderId === recipientUser.id) {
      return NextResponse.json({ message: "Cannot transfer points to yourself" }, { status: 400 })
    }

    // Check if recipient has a wallet
    const recipientWallet = await prisma.wallet.findUnique({
      where: { userId: recipientUser.id },
    })

    // Now perform the actual transfer with a higher timeout
    await prisma.$transaction(
      async (tx) => {
        // Debit sender
        await tx.wallet.update({
          where: { userId: senderId },
          data: { points: { decrement: points } },
        })

        // Credit recipient
        if (recipientWallet) {
          await tx.wallet.update({
            where: { userId: recipientUser.id },
            data: { points: { increment: points } },
          })
        } else {
          await tx.wallet.create({
            data: {
              userId: recipientUser.id,
              balance: new Decimal(0),
              points: points,
            },
          })
        }

        // Create transaction records
        await tx.transaction.create({
          data: {
            amount: new Decimal(points),
            type: "TRANSFER",
            description: `Transferred ${points} points to ${recipientUser.name || recipientUser.email}`,
            senderId: senderId,
            recipientId: recipientUser.id,
          },
        })

        await tx.transaction.create({
          data: {
            amount: new Decimal(points),
            type: "TRANSFER",
            description: `Received ${points} points from ${session.user?.name || session.user?.email}`,
            senderId: senderId,
            recipientId: recipientUser.id,
          },
        })
      },
      {
        timeout: 10000, // Increase timeout to 10 seconds
      }
    )

    return NextResponse.json({ message: "Points transferred successfully" })
  } catch (error: any) {
    console.error("Error transferring points:", error)
    return NextResponse.json({ message: error.message || "Failed to transfer points" }, { status: 500 })
  }
}
