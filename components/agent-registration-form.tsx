"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { supabase } from "@/lib/supabase/client"
import { Loader2, Check } from "lucide-react"
import Link from "next/link"

interface SubscriptionPlan {
  id: string
  name: string
  duration_months: number
  price: number
}

export default function AgentRegistrationForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [selectedPlan, setSelectedPlan] = useState<string>("")
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    fetchSubscriptionPlans()
  }, [])

  const fetchSubscriptionPlans = async () => {
    const { data, error } = await supabase.from("subscription_plans").select("*").order("price", { ascending: true })

    if (data && !error) {
      setPlans(data)
      if (data.length > 0) {
        setSelectedPlan(data[0].id)
      }
    }
  }

  const generateAgentId = () => {
    const prefix = "DFA"
    const timestamp = Date.now().toString().slice(-6)
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0")
    return `${prefix}${timestamp}${random}`
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
    } else if (!/^[0-9+\-\s()]+$/.test(formData.phone)) {
      newErrors.phone = "Phone number is invalid"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    if (!selectedPlan) {
      newErrors.plan = "Please select a subscription plan"
    }

    if (!agreeToTerms) {
      newErrors.terms = "You must agree to the terms and conditions"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      })

      if (authError) {
        setErrors({ submit: authError.message })
        return
      }

      if (authData.user) {
        // Generate agent ID
        const agentId = generateAgentId()

        // Create agent record
        const { error: agentError } = await supabase.from("agents").insert({
          user_id: authData.user.id,
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          agent_id: agentId,
          subscription_plan_id: selectedPlan,
          status: "pending",
        })

        if (agentError) {
          setErrors({ submit: agentError.message })
          return
        }

        // Redirect to success page with agent ID
        router.push(`/register/success?agentId=${agentId}`)
      }
    } catch (error) {
      setErrors({ submit: "An unexpected error occurred" })
    } finally {
      setLoading(false)
    }
  }

  const selectedPlanData = plans.find((p) => p.id === selectedPlan)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Agent Registration</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{errors.submit}</div>
          )}

          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Personal Information</h3>

            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <Input
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Enter your full name"
                className={errors.fullName ? "border-red-500" : ""}
              />
              {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email Address</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter your email"
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Phone Number</label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="e.g., +233 24 123 4567"
                className={errors.phone ? "border-red-500" : ""}
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <Input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Create a password"
                className={errors.password ? "border-red-500" : ""}
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Confirm Password</label>
              <Input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="Confirm your password"
                className={errors.confirmPassword ? "border-red-500" : ""}
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>
          </div>

          {/* Subscription Plans */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Choose Your Subscription Plan</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {plans.map((plan) => (
                <Card
                  key={plan.id}
                  className={`cursor-pointer transition-all ${
                    selectedPlan === plan.id ? "ring-2 ring-green-500 bg-green-50" : "hover:shadow-md"
                  }`}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{plan.name}</h4>
                      {selectedPlan === plan.id && <Check className="h-5 w-5 text-green-600" />}
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">{plan.duration_months} months</Badge>
                      <span className="text-2xl font-bold text-green-600">₵{plan.price}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {errors.plan && <p className="text-red-500 text-sm">{errors.plan}</p>}
          </div>

          {/* Payment Instructions */}
          {selectedPlanData && (
            <div className="bg-blue-50 border border-blue-200 p-4 rounded">
              <h4 className="font-semibold text-blue-900 mb-2">Payment Instructions</h4>
              <p className="text-blue-800 text-sm mb-2">
                After registration, pay ₵{selectedPlanData.price} via Mobile Money to:
              </p>
              <div className="bg-white p-3 rounded border">
                <p className="font-mono text-lg">0551999901</p>
                <p className="text-sm text-gray-600">Use your Agent ID as reference</p>
              </div>
            </div>
          )}

          {/* Terms and Conditions */}
          <div className="flex items-start space-x-2">
            <Checkbox
              id="terms"
              checked={agreeToTerms}
              onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
            />
            <label htmlFor="terms" className="text-sm text-gray-700">
              I agree to the{" "}
              <Link href="/terms" className="text-green-600 hover:underline" target="_blank">
                Terms and Conditions
              </Link>
            </label>
          </div>
          {errors.terms && <p className="text-red-500 text-sm">{errors.terms}</p>}

          <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              "Register as Agent"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
