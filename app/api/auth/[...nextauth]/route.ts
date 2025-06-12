import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        name: { label: "Name", type: "text" },
        isSignUp: { label: "Is Sign Up", type: "boolean" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log("Missing credentials")
          return null
        }

        try {
          // Check if this is a signup attempt
          if (credentials.isSignUp) {
            // Check if user already exists
            const existingUser = await prisma.user.findUnique({
              where: { email: String(credentials.email) },
            })

            if (existingUser) {
              throw new Error("User with this email already exists")
            }

            // Create new user
            const hashedPassword = await bcrypt.hash(String(credentials.password), 10)
            const newUser = await prisma.user.create({
              data: {
                email: String(credentials.email),
                password: hashedPassword,
                name: String(credentials.name),
              },
            })

            console.log("Signup successful for:", credentials.email)
            return {
              id: newUser.id,
              email: newUser.email,
              name: newUser.name,
            }
          }

          // Handle login flow
          const user = await prisma.user.findUnique({
            where: { email: String(credentials.email) },
          })

          if (!user) {
            console.log("User not found:", credentials.email)
            return null
          }

          const isPasswordValid = await bcrypt.compare(
            String(credentials.password),
            user.password
          )

          if (!isPasswordValid) {
            console.log("Invalid password for user:", credentials.email)
            return null
          }

          console.log("Login successful for:", credentials.email)
          return {
            id: user.id,
            email: user.email,
            name: user.name,
          }
        } catch (error) {
          console.error("Auth error:", error)
          throw error
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token.id && session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
})

// Export the API route handlers
export const GET = handlers.GET
export const POST = handlers.POST
