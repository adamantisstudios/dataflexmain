import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import AdminLoginForm from "@/components/admin-login-form"

export default async function AdminLoginPage() {
  if (!isSupabaseConfigured) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-white">Connect Supabase to get started</h1>
          <p className="text-gray-400">Please configure your Supabase environment variables</p>
        </div>
      </div>
    )
  }

  try {
    const supabase = await createClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (session) {
      // Check if user is admin
      const { data: admin } = await supabase.from("admin_users").select("*").eq("user_id", session.user.id).single()

      if (admin) {
        redirect("/admin/dashboard")
      } else {
        // User is logged in but not an admin
        redirect("/")
      }
    }
  } catch (error) {
    console.error("Error checking admin session:", error)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 px-4 py-12 sm:px-6 lg:px-8">
      <AdminLoginForm />
    </div>
  )
}
