"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
// Remove this line:
// import { Textarea } from "@/components/ui/textarea"
import { Smartphone, TrendingUp, MessageCircle, Star, Gift, DollarSign, BarChart3, Zap, X, Send } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabase/client"

interface Product {
  id: string
  name: string
  provider: string
  price: number
  validity: string
}

export default function LandingPage() {
  // Add this fallback data at the top of the component:
  const fallbackProducts = [
    // MTN
    { id: "mtn-1gb", name: "1GB", provider: "MTN", price: 6.0, validity: "3 months" },
    { id: "mtn-2gb", name: "2GB", provider: "MTN", price: 12.0, validity: "3 months" },
    { id: "mtn-5gb", name: "5GB", provider: "MTN", price: 27.0, validity: "3 months" },
    // AirtelTigo
    { id: "at-1gb", name: "1GB", provider: "AirtelTigo", price: 6.0, validity: "3 months" },
    { id: "at-2gb", name: "2GB", provider: "AirtelTigo", price: 10.0, validity: "3 months" },
    { id: "at-5gb", name: "5GB", provider: "AirtelTigo", price: 25.0, validity: "3 months" },
    // Telecel
    { id: "telecel-5gb", name: "5GB", provider: "Telecel", price: 28.0, validity: "3 months" },
    { id: "telecel-10gb", name: "10GB", provider: "Telecel", price: 47.0, validity: "3 months" },
  ]
  const [currentSlide, setCurrentSlide] = useState(0)
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProvider, setSelectedProvider] = useState<string>("all")
  const [showWhatsAppChat, setShowWhatsAppChat] = useState(false)
  const [whatsappMessage, setWhatsappMessage] = useState(
    "Hi! I'm interested in becoming a DataFlex Agent. Can you help me get started?",
  )

  const slides = [
    {
      title: "Become a Data Bundle Agent",
      subtitle: "Join thousands of agents earning with DataFlex",
      cta: "Register Now",
      link: "/register/agent",
    },
    {
      title: "Discounted Data Bundles",
      subtitle: "Get up to 40% discount on all networks",
      cta: "View Pricing",
      link: "#pricing",
    },
    {
      title: "Real-time Support",
      subtitle: "24/7 chat support for all agents",
      cta: "Learn More",
      link: "#features",
    },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  useEffect(() => {
    fetchProducts()
  }, [])

  // Update the fetchProducts function:
  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("provider", { ascending: true })
      .order("price", { ascending: true })

    if (data && !error && data.length > 0) {
      setProducts(data)
    } else {
      // Use fallback data if database is empty or not configured
      setProducts(fallbackProducts)
    }
  }

  const groupedProducts = products.reduce(
    (acc, product) => {
      if (!acc[product.provider]) {
        acc[product.provider] = []
      }
      acc[product.provider].push(product)
      return acc
    },
    {} as Record<string, Product[]>,
  )

  const filteredProducts =
    selectedProvider === "all" ? groupedProducts : { [selectedProvider]: groupedProducts[selectedProvider] || [] }

  const sendWhatsAppMessage = () => {
    const encodedMessage = encodeURIComponent(whatsappMessage)
    const whatsappUrl = `https://wa.me/233242799990?text=${encodedMessage}`
    window.open(whatsappUrl, "_blank")
    setShowWhatsAppChat(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <img
                src="/assets/logo.png"
                alt="DataFlex Agents Logo"
                className="h-8 w-8 mr-2"
                onError={(e) => {
                  e.currentTarget.style.display = "none"
                  e.currentTarget.nextElementSibling?.classList.remove("hidden")
                }}
              />
              <Smartphone className="h-8 w-8 text-green-600 mr-2 hidden" />
              <span className="text-2xl font-bold text-gray-900">DataFlex Agents</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#benefits" className="text-gray-700 hover:text-green-600">
                Benefits
              </a>
              <a href="#pricing" className="text-gray-700 hover:text-green-600">
                Pricing
              </a>
              <a href="#testimonials" className="text-gray-700 hover:text-green-600">
                Testimonials
              </a>
            </nav>
            <div className="flex space-x-4">
              <Link href="/auth/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link href="/register/agent">
                <Button className="bg-green-600 hover:bg-green-700">Register</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with Slider and Benefits */}
      <section className="relative">
        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Hero Slider */}
          <div className="relative h-96 overflow-hidden rounded-xl">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
                  index === currentSlide ? "translate-x-0" : "translate-x-full"
                }`}
                style={{
                  background: `linear-gradient(135deg, ${
                    index === 0 ? "#10B981, #059669" : index === 1 ? "#3B82F6, #1D4ED8" : "#8B5CF6, #7C3AED"
                  })`,
                }}
              >
                <div className="flex items-center justify-center h-full text-white text-center px-6">
                  <div>
                    <h1 className="text-3xl md:text-5xl font-bold mb-4">{slide.title}</h1>
                    <p className="text-lg md:text-xl mb-6">{slide.subtitle}</p>
                    <Link href={slide.link}>
                      <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
                        {slide.cta}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}

            {/* Slide indicators */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full ${index === currentSlide ? "bg-white" : "bg-white/50"}`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
          </div>

          {/* Agent Benefits Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-green-200">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">🎉 Become a DataFlex Agent</h2>
              <p className="text-gray-600">Join Ghana's most dynamic data reseller platform and start earning today!</p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-semibold text-green-800">💰 ₵35 Registration</span>
                  <Badge className="bg-green-600">3 Months Valid</Badge>
                </div>
                <p className="text-sm text-green-700">🔁 Renewable based on your performance and activity</p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">Agent Benefits:</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center">
                    <span className="text-green-600 mr-2">🔹</span>
                    Discounted data bundles across all networks
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-600 mr-2">🔹</span>
                    Earn commissions on every referral
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-600 mr-2">🔹</span>
                    Access your personal Agent Dashboard
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-600 mr-2">🔹</span>
                    Bulk purchase discounts
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-600 mr-2">🔹</span>
                    Real-time analytics and order tracking
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-600 mr-2">🔹</span>
                    Monthly performance bonuses
                  </li>
                </ul>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800 font-medium">
                  💸 Earn up to ₵300 in free bonuses just by staying active and being one of the top agents!
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <span className="font-medium">📉 Note:</span> Our prices are dynamic. A ₵6 MTN bundle can drop to ₵4
                  within 24 hours — and stay that low for days. Stay active to enjoy price drops and increase your
                  earnings!
                </p>
              </div>
            </div>

            <Link href="/register/agent">
              <Button className="w-full bg-green-600 hover:bg-green-700 text-lg py-3">
                <Gift className="mr-2 h-5 w-5" />
                Start Earning Today!
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="benefits" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose DataFlex Agents?</h2>
            <p className="text-xl text-gray-600">Everything you need to succeed as a data bundle reseller</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center">
              <CardHeader>
                <DollarSign className="h-12 w-12 text-green-600 mb-4 mx-auto" />
                <CardTitle>Low Registration Fee</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Start from just ₵35 for 3 months subscription</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <TrendingUp className="h-12 w-12 text-blue-600 mb-4 mx-auto" />
                <CardTitle>High Discounts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Get up to 40% discount on all network bundles</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <BarChart3 className="h-12 w-12 text-purple-600 mb-4 mx-auto" />
                <CardTitle>Real-time Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Track your sales and earnings in real-time</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Zap className="h-12 w-12 text-orange-600 mb-4 mx-auto" />
                <CardTitle>Dynamic Pricing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Benefit from price drops and maximize profits</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Enhanced Pricing Section */}
      <section id="pricing" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Live Bundle Pricing</h2>
            <p className="text-xl text-gray-600">Current discounted rates for all networks</p>
            <p className="text-sm text-blue-600 mt-2">
              💡 Prices update dynamically - check back regularly for the best deals!
            </p>
          </div>

          {/* Provider Filter */}
          <div className="flex justify-center mb-8">
            <div className="flex space-x-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setSelectedProvider("all")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedProvider === "all" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                All Networks
              </button>
              {Object.keys(groupedProducts).map((provider) => (
                <button
                  key={provider}
                  onClick={() => setSelectedProvider(provider)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedProvider === provider
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {provider}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(filteredProducts).map(([provider, providerProducts]) => (
              <Card key={provider} className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <img
                        src={`/assets/${provider.toLowerCase()}-logo.png`}
                        alt={`${provider} Logo`}
                        className="h-8 w-8 mr-2 bg-white rounded p-1"
                        onError={(e) => {
                          e.currentTarget.style.display = "none"
                        }}
                      />
                      {provider}
                    </div>
                    <Badge variant="secondary" className="bg-white text-gray-900">
                      {providerProducts.length} bundles
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="max-h-80 overflow-y-auto">
                    {providerProducts.map((product, index) => (
                      <div
                        key={product.id}
                        className={`flex justify-between items-center p-3 ${
                          index % 2 === 0 ? "bg-gray-50" : "bg-white"
                        } hover:bg-green-50 transition-colors`}
                      >
                        <div>
                          <span className="font-medium text-gray-900">{product.name}</span>
                          <p className="text-xs text-gray-500">{product.validity}</p>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-green-600 text-lg">₵{product.price}</span>
                          {product.price <= 10 && (
                            <Badge className="ml-2 bg-red-500 text-white text-xs">Hot Deal!</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 bg-gray-50 border-t">
                    <Link href="/register/agent">
                      <Button className="w-full bg-green-600 hover:bg-green-700">Get These Prices</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Agents Say</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Kwame Asante",
                role: "Top Agent - Accra",
                content: "DataFlex has transformed my business. I'm earning ₵2000+ monthly!",
                rating: 5,
                image: "/assets/agent-1.jpg",
              },
              {
                name: "Ama Serwaa",
                role: "Agent - Kumasi",
                content: "The support is amazing and the discounts are real. Highly recommended!",
                rating: 5,
                image: "/assets/agent-2.jpg",
              },
              {
                name: "John Mensah",
                role: "Agent - Tamale",
                content: "Easy to use platform with great profit margins. Love it!",
                rating: 5,
                image: "/assets/agent-3.jpg",
              },
            ].map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <img
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      className="h-12 w-12 rounded-full mr-4 object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder-user.jpg"
                      }}
                    />
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600">"{testimonial.content}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <img
                  src="/assets/logo-white.png"
                  alt="DataFlex Agents Logo"
                  className="h-8 w-8 mr-2"
                  onError={(e) => {
                    e.currentTarget.style.display = "none"
                    e.currentTarget.nextElementSibling?.classList.remove("hidden")
                  }}
                />
                <Smartphone className="h-8 w-8 text-green-400 mr-2 hidden" />
                <span className="text-xl font-bold">DataFlex Agents</span>
              </div>
              <p className="text-gray-400">Empowering agents across Ghana with discounted data bundles.</p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/register/agent" className="hover:text-white">
                    Register as Agent
                  </Link>
                </li>
                <li>
                  <Link href="/auth/login" className="hover:text-white">
                    Login
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white">
                    Terms & Conditions
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>WhatsApp: +233 24 279 9990</li>
                <li>Email: support@dataflexagents.com</li>
                <li>Hours: 24/7</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Payment Info</h3>
              <p className="text-gray-400">Mobile Money: 0551999901</p>
              <p className="text-sm text-gray-500 mt-2">Use your Agent ID as reference</p>
              <Link href="/admin/login" className="text-xs text-gray-600 hover:text-gray-400 mt-4 block">
                Admin Access
              </Link>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 DataFlex Agents. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Enhanced WhatsApp Chat Widget */}
      <div className="fixed bottom-4 right-4 z-50">
        {showWhatsAppChat && (
          <div className="bg-white rounded-lg shadow-xl border mb-4 w-80 max-w-sm">
            <div className="bg-green-500 text-white p-4 rounded-t-lg flex items-center justify-between">
              <div className="flex items-center">
                <MessageCircle className="h-5 w-5 mr-2" />
                <span className="font-medium">WhatsApp Chat</span>
              </div>
              <button onClick={() => setShowWhatsAppChat(false)} className="text-white hover:text-gray-200">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-600 mb-3">Send us a message on WhatsApp:</p>
              {/* Replace the Textarea component in the WhatsApp chat with a regular textarea: */}
              <textarea
                value={whatsappMessage}
                onChange={(e) => setWhatsappMessage(e.target.value)}
                placeholder="Type your message..."
                className="mb-3 resize-none w-full p-2 border rounded-md"
                rows={3}
              />
              <Button onClick={sendWhatsAppMessage} className="w-full bg-green-500 hover:bg-green-600">
                <Send className="h-4 w-4 mr-2" />
                Send Message
              </Button>
            </div>
          </div>
        )}

        <Button
          size="lg"
          className="rounded-full bg-green-500 hover:bg-green-600 shadow-lg"
          onClick={() => setShowWhatsAppChat(!showWhatsAppChat)}
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    </div>
  )
}
