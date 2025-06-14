"use client"

import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Copy, MessageCircle } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function RegistrationSuccessPage() {
  const searchParams = useSearchParams()
  const agentId = searchParams.get("agentId")
  const [copied, setCopied] = useState(false)

  const copyAgentId = () => {
    if (agentId) {
      navigator.clipboard.writeText(agentId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <CardTitle className="text-2xl text-green-600">Registration Successful!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                Your agent account has been created successfully. Your unique Agent ID is:
              </p>

              <div className="bg-gray-100 p-4 rounded-lg border-2 border-dashed border-gray-300">
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-2xl font-mono font-bold text-gray-900">{agentId}</span>
                  <Button variant="outline" size="sm" onClick={copyAgentId} className="ml-2">
                    <Copy className="h-4 w-4" />
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 p-4 rounded">
              <h3 className="font-semibold text-blue-900 mb-2">Next Steps:</h3>
              <ol className="list-decimal list-inside space-y-2 text-blue-800 text-sm">
                <li>Save your Agent ID (you'll need it for payment reference)</li>
                <li>
                  Send Mobile Money payment to: <strong>0551999901</strong>
                </li>
                <li>Use your Agent ID as the payment reference</li>
                <li>Wait for admin approval (usually within 24 hours)</li>
                <li>Check your email for activation confirmation</li>
              </ol>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded">
              <h3 className="font-semibold text-yellow-900 mb-2">Important:</h3>
              <p className="text-yellow-800 text-sm">
                Your account is currently <strong>pending approval</strong>. You'll receive an email once your payment
                is confirmed and your account is activated.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={() => window.open("https://wa.me/233551999901", "_blank")}
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Contact Support
              </Button>

              <Link href="/auth/login" className="flex-1">
                <Button variant="outline" className="w-full">
                  Login to Dashboard
                </Button>
              </Link>
            </div>

            <div className="text-center text-sm text-gray-500">
              <p>Need help? Contact us on WhatsApp: +233 55 199 9901</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
