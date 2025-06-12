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

    const transactions = await prisma.transaction.findMany({
      where: {
        OR: [{ senderId: userId }, { recipientId: userId }],
      },
      include: {
        sender: {
          select: { id: true, email: true, name: true },
        },
        recipient: {
          select: { id: true, email: true, name: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    // Format transactions for display
    const formattedTransactions = transactions.map((tx) => {
      const isSender = tx.senderId === userId
      const isRecipient = tx.recipientId === userId

      let typeLabel = ""
      let amountDisplay = ""
      let partyInfo = ""

      switch (tx.type) {
        case "CHARGE":
          typeLabel = "Wallet Charge"
          amountDisplay = `+ $${tx.amount.toFixed(2)}`
          partyInfo = "Self"
          break
        case "CONVERSION":
          typeLabel = "Points Conversion"
          amountDisplay = `- $${tx.amount.toFixed(2)} / + ${tx.amount.toNumber() * 100} points` // Assuming 1:100 ratio
          partyInfo = "Self"
          break
        case "TRANSFER":
          if (isSender && isRecipient) {
            //  but for self-transfers 
            typeLabel = "Points Transfer (Self)"
            amountDisplay = `${tx.amount.toFixed(0)} points`
            partyInfo = "Self"
          } else if (isSender) {
            typeLabel = "Points Sent"
            amountDisplay = `- ${tx.amount.toFixed(0)} points`
            partyInfo = `To: ${tx.recipient.name || tx.recipient.email}`
          } else if (isRecipient) {
            typeLabel = "Points Received"
            amountDisplay = `+ ${tx.amount.toFixed(0)} points`
            partyInfo = `From: ${tx.sender.name || tx.sender.email}`
          }
          break
        default:
          typeLabel = "Unknown"
          amountDisplay = tx.amount.toFixed(2)
          partyInfo = ""
      }

      return {
        id: tx.id,
        type: typeLabel,
        amount: amountDisplay,
        description: tx.description,
        date: tx.createdAt.toLocaleString(),
        party: partyInfo,
      }
    })

    return NextResponse.json(formattedTransactions)
  } catch (error) {
    console.error("Error fetching transactions:", error)
    return NextResponse.json({ message: "Failed to fetch transactions" }, { status: 500 })
  }
}
