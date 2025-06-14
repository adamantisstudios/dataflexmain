import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import LandingPage from "@/components/landing-page"

export default async function Home() {
  // If Supabase is not configured, show landing page directly
  if (!isSupabaseConfigured) {
    return <LandingPage />
  }

  try {
    const supabase = await createClient()
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    // If there's an error or no user, show landing page
    if (error || !user) {
      return <LandingPage />
    }

    // Check if user is an agent or admin
    const { data: agent } = await supabase.from("agents").select("*").eq("user_id", user.id).single()

    const { data: admin } = await supabase.from("admin_users").select("*").eq("user_id", user.id).single()

    if (agent) {
      redirect("/agent/dashboard")
    } else if (admin) {
      redirect("/admin/dashboard")
    }

    // If user exists but is neither agent nor admin, show landing page
    return <LandingPage />
  } catch (error) {
    console.error("Error in Home page:", error)
    return <LandingPage />
  }
}
