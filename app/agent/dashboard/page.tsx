import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import AgentDashboard from "@/components/agent-dashboard"

export default async function AgentDashboardPage() {
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
      redirect("/auth/login")
    }

    // Check if user is an agent
    const { data: agent } = await supabase.from("agents").select("*").eq("user_id", user.id).single()

    if (!agent) {
      redirect("/register/agent")
    }

    return <AgentDashboard agent={agent} />
  } catch (error) {
    console.error("Error in agent dashboard:", error)
    redirect("/auth/login")
  }
}
