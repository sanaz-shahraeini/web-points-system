import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { SignupForm } from "@/components/auth-forms"
import { ThemeToggle } from "@/components/theme-toggle"

export default async function SignupPage() {
  const session = await auth()
  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-950">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <SignupForm />
    </div>
  )
}
