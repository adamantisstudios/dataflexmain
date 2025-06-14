"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Shield } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { adminSignIn } from "@/lib/admin-actions"

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full bg-red-600 hover:bg-red-700 text-white py-6 text-lg font-medium rounded-lg h-[60px]"
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Signing in...
        </>
      ) : (
        <>
          <Shield className="mr-2 h-4 w-4" />
          Admin Sign In
        </>
      )}
    </Button>
  )
}

export default function AdminLoginForm() {
  const router = useRouter()
  const [state, formAction] = useActionState(adminSignIn, null)

  useEffect(() => {
    if (state?.success) {
      router.push("/admin/dashboard")
    }
  }, [state, router])

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <Shield className="h-12 w-12 text-red-600" />
        </div>
        <CardTitle className="text-2xl">Admin Access</CardTitle>
        <p className="text-gray-600">Sign in to admin dashboard</p>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          {state?.error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{state.error}</div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Admin Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="admin@dataflexagents.com"
                required
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <Input id="password" name="password" type="password" required className="w-full" />
            </div>
          </div>

          <SubmitButton />

          <div className="text-center">
            <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
              ← Back to main site
            </Link>
          </div>
        </form>

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
          <h4 className="font-medium text-yellow-800 mb-2">Default Admin Credentials:</h4>
          <p className="text-sm text-yellow-700">
            <strong>Email:</strong> admin@dataflexagents.com
            <br />
            <strong>Password:</strong> Admin123!
          </p>
          <p className="text-xs text-yellow-600 mt-2">Please change these credentials after first login</p>
        </div>
      </CardContent>
    </Card>
  )
}
