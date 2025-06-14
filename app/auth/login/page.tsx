import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import LoginForm from "@/components/login-form"

export default async function LoginPage() {
  // If Supabase is not configured, show setup message directly
  if (!isSupabaseConfigured) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#161616]">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-white">Connect Supabase to get started</h1>
          <p className="text-gray-400">Please configure your Supabase environment variables</p>
        </div>
      </div>
    )
  }

  try {
    // Check if user is already logged in
    const supabase = await createClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // If user is logged in, redirect to home page
    if (session) {
      redirect("/")
    }
  } catch (error) {
    console.error("Error checking session:", error)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#161616] px-4 py-12 sm:px-6 lg:px-8">
      <LoginForm />
    </div>
  )
}
