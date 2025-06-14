"use server"

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { isSupabaseConfigured } from "@/lib/supabase/server"

export async function adminSignIn(prevState: any, formData: FormData) {
  if (!isSupabaseConfigured) {
    return { error: "Supabase is not configured" }
  }

  if (!formData) {
    return { error: "Form data is missing" }
  }

  const email = formData.get("email")
  const password = formData.get("password")

  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
            } catch {
              // The `setAll` method was called from a Server Component.
            }
          },
        },
      },
    )

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.toString(),
      password: password.toString(),
    })

    if (error) {
      return { error: error.message }
    }

    if (data.user) {
      // Check if user is an admin
      const { data: admin, error: adminError } = await supabase
        .from("admin_users")
        .select("*")
        .eq("user_id", data.user.id)
        .single()

      if (adminError || !admin) {
        // Sign out the user if they're not an admin
        await supabase.auth.signOut()
        return { error: "Access denied. Admin privileges required." }
      }

      return { success: true }
    }

    return { error: "Authentication failed" }
  } catch (error) {
    console.error("Admin login error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}
