import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import AdminDashboard from "@/components/admin-dashboard"

export default async function AdminDashboardPage() {
  if (!isSupabaseConfigured) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Connect Supabase to access dashboard</h1>
          <p className="text-gray-600">Please configure your Supabase environment variables</p>
        </div>
      </div>
    )
  }

  try {
    const supabase = await createClient()
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user) {
      redirect("/admin/login")
    }

    // Check if user is an admin
    const { data: admin } = await supabase.from("admin_users").select("*").eq("user_id", user.id).single()

    if (!admin) {
      redirect("/admin/login")
    }

    return <AdminDashboard admin={admin} />
  } catch (error) {
    console.error("Error in admin dashboard:", error)
    redirect("/admin/login")
  }
}
