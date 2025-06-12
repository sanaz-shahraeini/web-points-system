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
    <div className="relative flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-950">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <LoginForm />
      </div>
    </div>
  )
}
