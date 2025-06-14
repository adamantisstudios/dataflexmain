"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DollarSign, Calendar, ShoppingCart, User, LogOut } from "lucide-react"
import { supabase } from "@/lib/supabase/client"

interface Agent {
  id: string
  full_name: string
  email: string
  phone: string
  agent_id: string
  status: string
  subscription_start: string
  subscription_end: string
}

interface AgentDashboardProps {
  agent: Agent
}

export default function AgentDashboard({ agent }: AgentDashboardProps) {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalEarnings: 0,
    thisMonthOrders: 0,
    activeStatus: agent.status,
  })

  const [recentOrders, setRecentOrders] = useState([])
  const [products, setProducts] = useState([])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    // Fetch orders
    const { data: orders } = await supabase
      .from("orders")
      .select("*")
      .eq("agent_id", agent.id)
      .order("order_date", { ascending: false })

    if (orders) {
      setRecentOrders(orders.slice(0, 5))
      setStats((prev) => ({
        ...prev,
        totalOrders: orders.length,
        totalEarnings: orders.reduce((sum, order) => sum + Number.parseFloat(order.total_price), 0),
      }))
    }

    // Fetch products
    const { data: productsData } = await supabase.from("products").select("*").order("provider")

    if (productsData) {
      setProducts(productsData)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = "/"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Agent Dashboard</h1>
              <p className="text-gray-600">Welcome back, {agent.full_name}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge
                variant={agent.status === "active" ? "default" : "secondary"}
                className={agent.status === "active" ? "bg-green-600" : ""}
              >
                {agent.status.toUpperCase()}
              </Badge>
              <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₵{stats.totalEarnings.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Agent ID</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{agent.agent_id}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Subscription</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm">
                {agent.subscription_end
                  ? `Expires: ${new Date(agent.subscription_end).toLocaleDateString()}`
                  : "Pending Activation"}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="bundles" className="space-y-4">
          <TabsList>
            <TabsTrigger value="bundles">Buy Bundles</TabsTrigger>
            <TabsTrigger value="orders">Order History</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="bundles" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Available Data Bundles</CardTitle>
              </CardHeader>
              <CardContent>
                {agent.status !== "active" ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">Your account is pending approval.</p>
                    <p className="text-sm text-gray-500">
                      Please ensure you've made payment and wait for admin approval.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {products.slice(0, 9).map((product) => (
                      <Card key={product.id} className="border">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">{product.name}</span>
                            <Badge variant="outline">{product.provider}</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-2xl font-bold text-green-600">₵{product.price}</span>
                            <Button size="sm">Buy Now</Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                {recentOrders.length === 0 ? (
                  <p className="text-gray-600 text-center py-4">No orders yet</p>
                ) : (
                  <div className="space-y-2">
                    {recentOrders.map((order: any) => (
                      <div key={order.id} className="flex justify-between items-center p-3 border rounded">
                        <div>
                          <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
                          <p className="text-sm text-gray-600">{new Date(order.order_date).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">₵{order.total_price}</p>
                          <Badge variant="outline">{order.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Full Name</label>
                  <p className="text-gray-900">{agent.full_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <p className="text-gray-900">{agent.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Phone</label>
                  <p className="text-gray-900">{agent.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Agent ID</label>
                  <p className="text-gray-900 font-mono">{agent.agent_id}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
