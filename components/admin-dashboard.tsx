"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, ShoppingCart, DollarSign, LogOut, Shield, CheckCircle, XCircle, Clock } from "lucide-react"
import { supabase } from "@/lib/supabase/client"

interface Admin {
  id: string
  full_name: string
  email: string
}

interface AdminDashboardProps {
  admin: Admin
}

export default function AdminDashboard({ admin }: AdminDashboardProps) {
  const [stats, setStats] = useState({
    totalAgents: 0,
    activeAgents: 0,
    pendingAgents: 0,
    totalOrders: 0,
    totalRevenue: 0,
  })

  const [agents, setAgents] = useState([])
  const [orders, setOrders] = useState([])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    // Fetch agents
    const { data: agentsData } = await supabase.from("agents").select("*").order("created_at", { ascending: false })

    if (agentsData) {
      setAgents(agentsData)
      setStats((prev) => ({
        ...prev,
        totalAgents: agentsData.length,
        activeAgents: agentsData.filter((a) => a.status === "active").length,
        pendingAgents: agentsData.filter((a) => a.status === "pending").length,
      }))
    }

    // Fetch orders
    const { data: ordersData } = await supabase
      .from("orders")
      .select("*, agents(full_name, agent_id)")
      .order("order_date", { ascending: false })

    if (ordersData) {
      setOrders(ordersData)
      setStats((prev) => ({
        ...prev,
        totalOrders: ordersData.length,
        totalRevenue: ordersData.reduce((sum, order) => sum + Number.parseFloat(order.total_price), 0),
      }))
    }
  }

  const handleAgentStatusUpdate = async (agentId: string, newStatus: string) => {
    const { error } = await supabase
      .from("agents")
      .update({
        status: newStatus,
        subscription_start: newStatus === "active" ? new Date().toISOString() : null,
        subscription_end: newStatus === "active" ? new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString() : null,
      })
      .eq("id", agentId)

    if (!error) {
      fetchDashboardData()
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = "/admin/login"
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "suspended":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-red-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600">Welcome back, {admin.full_name}</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Agents</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAgents}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.activeAgents}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pendingAgents}</div>
            </CardContent>
          </Card>

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
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₵{stats.totalRevenue.toFixed(2)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="agents" className="space-y-4">
          <TabsList>
            <TabsTrigger value="agents">Manage Agents</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="agents" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Agent Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {agents.map((agent: any) => (
                    <div key={agent.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        {getStatusIcon(agent.status)}
                        <div>
                          <p className="font-medium">{agent.full_name}</p>
                          <p className="text-sm text-gray-600">{agent.email}</p>
                          <p className="text-xs text-gray-500">Agent ID: {agent.agent_id}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant={agent.status === "active" ? "default" : "secondary"}
                          className={agent.status === "active" ? "bg-green-600" : ""}
                        >
                          {agent.status.toUpperCase()}
                        </Badge>
                        {agent.status === "pending" && (
                          <Button
                            size="sm"
                            onClick={() => handleAgentStatusUpdate(agent.id, "active")}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Approve
                          </Button>
                        )}
                        {agent.status === "active" && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleAgentStatusUpdate(agent.id, "suspended")}
                          >
                            Suspend
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <p className="text-gray-600 text-center py-4">No orders yet</p>
                ) : (
                  <div className="space-y-2">
                    {orders.slice(0, 10).map((order: any) => (
                      <div key={order.id} className="flex justify-between items-center p-3 border rounded">
                        <div>
                          <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
                          <p className="text-sm text-gray-600">
                            {order.agents?.full_name} ({order.agents?.agent_id})
                          </p>
                          <p className="text-xs text-gray-500">{new Date(order.order_date).toLocaleDateString()}</p>
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

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Admin Information</h3>
                    <p className="text-sm text-gray-600">Name: {admin.full_name}</p>
                    <p className="text-sm text-gray-600">Email: {admin.email}</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Payment Information</h3>
                    <p className="text-sm text-gray-600">Mobile Money: 0551999901</p>
                    <p className="text-sm text-gray-600">WhatsApp Support: +233 24 279 9990</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
