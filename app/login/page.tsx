import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { LoginForm } from "@/components/auth-forms"
import { ThemeToggle } from "@/components/theme-toggle"
import { Loader2 } from "lucide-react"

export default async function LoginPage() {
  const session = await auth()
  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="relative min-h-screen bg-gray-100 dark:bg-gray-950">
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <div className="flex min-h-screen items-center justify-center">
        <LoginForm />
      </div>
    </div>
  )
}
