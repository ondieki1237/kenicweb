"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Bell,
  Settings,
  Users,
  BookOpen,
  Menu,
  X,
  Plus,
  TrendingUp,
  DollarSign,
  Activity,
  Globe,
  AlertTriangle,
  CheckCircle,
  Search,
  User,
  Receipt,
  Home,
} from "lucide-react"
import DomainSearch from "@/components/domain-search"
import DomainManagement from "@/components/domain-management"
import UserProfile from "@/components/user-profile"
import BillingManagement from "@/components/billing-management"
import CommunityHub from "@/components/community-hub"
import LearningHub from "@/components/learning-hub"
import Link from "next/link"
import ProtectedRoute from "@/components/protected-route"
import { useAuth } from "@/contexts/auth-context"
import { useRouter, useSearchParams } from "next/navigation"
import { domainApi, billingApi } from "@/lib/api"
// import { Pie } from "react-chartjs-2";

interface UserDomain {
  _id: string;
  name: string;
  extension: string;
  fullDomain: string;
  status: "active" | "expiring" | "expired" | "pending";
  expiryDate: string;
  daysUntilExpiry: number;
  autoRenew: boolean;
  registrar: string;
  price: number;
}

interface UserActivity {
  _id: string;
  action: string;
  domain?: string;
  type: "success" | "info" | "warning" | "error";
  timestamp: string;
}

interface BillingSummary {
  totalSpent: number;
  pendingPayments: number;
  monthlySpend: number;
}

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const { user, logout } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  // Real data state
  const [userDomains, setUserDomains] = useState<UserDomain[]>([])
  const [recentActivity, setRecentActivity] = useState<UserActivity[]>([])
  const [billingSummary, setBillingSummary] = useState<BillingSummary>({
    totalSpent: 0,
    pendingPayments: 0,
    monthlySpend: 0
  })
  const [loading, setLoading] = useState(true)
  const [registrars, setRegistrars] = useState<any[]>([])
  const [apiStatus, setApiStatus] = useState<"online" | "offline" | "checking">("checking")

  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab === "search") setActiveTab("search")
  }, [searchParams])

  // Fetch real data on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return
      
      try {
        setLoading(true)
        const [domainsRes, activityRes, billingRes] = await Promise.all([
          domainApi.getUserDomains(),
          domainApi.getUserActivity(),
          billingApi.getBillingSummary()
        ])

        setUserDomains(domainsRes.domains || [])
        setRecentActivity(activityRes.activities || [])
        setBillingSummary(billingRes.summary || {
          totalSpent: 0,
          pendingPayments: 0,
          monthlySpend: 0
        })
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [user])

  useEffect(() => {
    if (!user) return
    domainApi.getRegistrars()
      .then(res => setRegistrars(res.registrars || []))
      .catch(() => setRegistrars([]))
  }, [user])

  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_API_URL || "https://mili-hack.onrender.com/")
      .then(res => setApiStatus(res.ok ? "online" : "offline"))
      .catch(() => setApiStatus("offline"))
  }, [])

  const text = {
    dashboard: "Dashboard",
    domains: "My Domains",
    search: "Domain Search",
    community: "Community",
    learning: "Learning Hub",
    settings: "Settings",
    profile: "Profile",
    billing: "Billing",
    welcome: "Welcome back",
    totalDomains: "Total Domains",
    expiringDomains: "Expiring Soon",
    activeServices: "Active Services",
    monthlySpend: "Monthly Spend",
    searchPlaceholder: "Search for available .KE domains...",
    recentActivity: "Recent Activity",
    quickActions: "Quick Actions",
    renewDomain: "Renew Domain",
    addDomain: "Add New Domain",
    manageSettings: "Manage Settings",
    viewAnalytics: "View Analytics",
    backToHome: "Back to Home",
    notifications: "Notifications",
    logout: "Logout",
  }

  const welcomeMessage = user ? `${text.welcome}, ${user.firstName} ${user.lastName}! 👋` : `${text.welcome}! 👋`

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  // Calculate dashboard stats from real data
  const totalDomains = userDomains.length
  const expiringDomains = userDomains.filter(d => d.status === "expiring").length
  const activeServices = userDomains.filter(d => d.status === "active").length

  // try local /public/logos/* first, fallback to registrar logoUrl or default image
  const getLocalLogo = (reg: any) => {
    const base = (reg.slug || reg.name || "").toString().toLowerCase()
    const slug = base.replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
    return `/logos/${slug}.png`
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-muted/20 via-background to-background">
        <header className="bg-card/60 backdrop-blur-md border-b border-border/50 sticky top-0 z-50">
          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
              <div className="flex items-center space-x-3">
                <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                  <img src="/kenic-official-logo.png" alt="KeNIC Logo" className="h-8 w-auto cursor-pointer" />
                  <span className="text-xl font-heading-bold hidden sm:block">KeNIC Dashboard</span>
                </Link>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="relative hover:bg-muted/50" title={text.notifications}>
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-destructive animate-float-gentle">
                  3
                </Badge>
              </Button>

              <Button variant="ghost" size="sm" asChild title={text.backToHome} className="hover:bg-green-100">
                <Link href="/">
                  <Home className="h-5 w-5" />
                </Link>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                title={text.logout}
                className="hover:bg-muted/50 font-body-medium"
              >
                <span className="text-sm">Logout</span>
              </Button>

              <Avatar
                className="h-8 w-8 cursor-pointer ring-2 ring-primary/20 hover:ring-primary/40 transition-all"
                onClick={() => setActiveTab("profile")}
              >
                <AvatarImage src="/customer-avatar-sarah.png" />
                <AvatarFallback className="font-body-medium">
                  {user && user.firstName && user.lastName ? `${user.firstName[0]}${user.lastName[0]}` : "JM"}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        <div className="flex">
          <aside
            className={`${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            } fixed inset-y-0 left-0 z-40 w-64 bg-card/60 backdrop-blur-md border-r border-border/50 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 pt-16 lg:pt-0`}
          >
            <nav className="p-4 space-y-2">
              <Button variant="ghost" className="w-full justify-start hover:bg-green-100 font-body" asChild>
                <Link href="/">
                  <Home className="mr-3 h-4 w-4" />
                  {text.backToHome}
                </Link>
              </Button>

              <Button
                variant={activeTab === "overview" ? "default" : "ghost"}
                className={`w-full justify-start font-body ${activeTab === "overview" ? "btn-primary" : "hover:bg-green-100"}`}
                onClick={() => setActiveTab("overview")}
              >
                <Activity className="mr-3 h-4 w-4" />
                {text.dashboard}
              </Button>

              <Button
                variant={activeTab === "domains" ? "default" : "ghost"}
                className={`w-full justify-start font-body ${activeTab === "domains" ? "btn-primary" : "hover:bg-green-100"}`}
                onClick={() => setActiveTab("domains")}
              >
                <Globe className="mr-3 h-4 w-4" />
                {text.domains}
              </Button>
              <Button
                variant={activeTab === "search" ? "default" : "ghost"}
                className={`w-full justify-start font-body ${activeTab === "search" ? "btn-primary" : "hover:bg-green-100"}`}
                onClick={() => setActiveTab("search")}
              >
                <Search className="mr-3 h-4 w-4" />
                {text.search}
              </Button>
              <Button
                variant={activeTab === "billing" ? "default" : "ghost"}
                className={`w-full justify-start font-body ${activeTab === "billing" ? "btn-primary" : "hover:bg-green-100"}`}
                onClick={() => setActiveTab("billing")}
              >
                <Receipt className="mr-3 h-4 w-4" />
                {text.billing}
              </Button>
              <Button
                variant={activeTab === "community" ? "default" : "ghost"}
                className={`w-full justify-start font-body ${activeTab === "community" ? "btn-primary" : "hover:bg-green-100"}`}
                onClick={() => setActiveTab("community")}
              >
                <Users className="mr-3 h-4 w-4" />
                {text.community}
              </Button>
              <Button
                variant={activeTab === "learning" ? "default" : "ghost"}
                className={`w-full justify-start font-body ${activeTab === "learning" ? "btn-primary" : "hover:bg-green-100"}`}
                onClick={() => setActiveTab("learning")}
              >
                <BookOpen className="mr-3 h-4 w-4" />
                {text.learning}
              </Button>
              <Button
                variant={activeTab === "profile" ? "default" : "ghost"}
                className={`w-full justify-start font-body ${activeTab === "profile" ? "btn-primary" : "hover:bg-green-100"}`}
                onClick={() => setActiveTab("profile")}
              >
                <User className="mr-3 h-4 w-4" />
                {text.profile}
              </Button>
              <Button variant="ghost" className="w-full justify-start hover:bg-green-100 font-body">
                <Settings className="mr-3 h-4 w-4" />
                {text.settings}
              </Button>
            </nav>

            <div className="p-4 mt-8">
              <Card className="card-glass border-0">
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-heading-bold text-primary">{totalDomains}</div>
                    <div className="text-sm text-muted-foreground font-body">{text.totalDomains}</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="p-4 text-xs text-muted-foreground flex items-center space-x-2">
              <span>API Status:</span>
              <span className={`w-2 h-2 rounded-full ${apiStatus === "online" ? "bg-green-500" : "bg-red-500"}`}></span>
              <span>{apiStatus}</span>
            </div>
          </aside>

          <main className="flex-1 p-4 lg:p-6 lg:ml-0">
            <div className="mb-8 animate-gentle-fade-in">
              <h1 className="text-3xl md:text-4xl font-heading-bold mb-3">{welcomeMessage}</h1>
              <p className="text-muted-foreground font-body text-lg">
                Manage your .KE domains and grow your online presence.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="card-glass border-0 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground font-body">{text.totalDomains}</p>
                      <p className="text-3xl font-heading-bold">{totalDomains}</p>
                    </div>
                    <Globe className="h-8 w-8 text-primary animate-float-gentle" />
                  </div>
                </CardContent>
              </Card>

              <Card className="card-glass border-0 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground font-body">{text.expiringDomains}</p>
                      <p className="text-3xl font-heading-bold text-secondary">{expiringDomains}</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-secondary animate-float-gentle" />
                  </div>
                </CardContent>
              </Card>

              <Card className="card-glass border-0 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground font-body">{text.activeServices}</p>
                      <p className="text-3xl font-heading-bold text-green-600">{activeServices}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-600 animate-float-gentle" />
                  </div>
                </CardContent>
              </Card>

              <Card className="card-glass border-0 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground font-body">{text.monthlySpend}</p>
                      <p className="text-3xl font-heading-bold">KSh {billingSummary.monthlySpend.toLocaleString()}</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-blue-600 animate-float-gentle" />
                  </div>
                </CardContent>
              </Card>

              {/* Register New Domain CTA */}
              <Card className="card-glass border-2 border-dashed border-primary/40 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                onClick={() => setActiveTab("search")}
                tabIndex={0}
                aria-label="Register a new domain"
              >
                <CardContent className="p-6 flex flex-col items-center justify-center h-full">
                  <Plus className="h-10 w-10 text-primary mb-2 animate-bounce" />
                  <p className="text-lg font-heading-bold text-primary">Register New Domain</p>
                  <p className="text-sm text-muted-foreground mt-1">Find and secure your next .KE domain</p>
                </CardContent>
              </Card>

              {/* New: Create Website CTA (opens sandbox with a default slug) */}
              <Card
                className="card-glass border-2 border-dashed border-accent/30 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                onClick={() => router.push("/sandbox/website")}
                tabIndex={0}
                aria-label="Create your own website with zero code"
              >
                <CardContent className="p-6 flex flex-col items-center justify-center h-full">
                  <Globe className="h-10 w-10 text-accent mb-2 animate-pulse" />
                  <p className="text-lg font-heading-bold text-accent">Create your own Website</p>
                  <p className="text-sm text-muted-foreground mt-1">With zero code — launch instantly</p>
                </CardContent>
              </Card>
            </div>

            {activeTab === "overview" && (
              <>
                <div className="mb-6">
                  <input
                    type="text"
                    placeholder="Quick search for a .KE domain..."
                    className="w-full px-4 py-3 rounded-lg border border-border focus:ring-2 focus:ring-primary/40 font-body text-lg shadow-sm"
                    onKeyDown={e => {
                      if (e.key === "Enter" && e.currentTarget.value) {
                        setActiveTab("search")
                        // Optionally, pass the search value to DomainSearch via context or props
                      }
                    }}
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <Card className="card-glass border-0">
                      <CardHeader>
                        <CardTitle className="flex items-center font-heading">
                          <Globe className="mr-3 h-5 w-5" />
                          Domain Portfolio
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {loading ? (
                          <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                              <div key={i} className="animate-pulse">
                                <div className="h-16 bg-gray-200 rounded-lg"></div>
                              </div>
                            ))}
                          </div>
                        ) : userDomains.length > 0 ? (
                          <div className="space-y-4">
                            {userDomains.slice(0, 5).map((domain) => (
                              <div
                                key={domain._id}
                                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                                onClick={() => setActiveTab("domains")}
                              >
                                <div className="flex items-center space-x-4">
                                  <div
                                    className={`w-3 h-3 rounded-full ${
                                      domain.status === "active"
                                        ? "bg-green-500"
                                        : domain.status === "expiring"
                                          ? "bg-orange-500"
                                          : "bg-red-500"
                                    }`}
                                  />
                                  <div>
                                    <p className="font-medium">{domain.fullDomain}</p>
                                    <p className="text-sm text-muted-foreground">
                                      Expires: {new Date(domain.expiryDate).toLocaleDateString()} ({domain.daysUntilExpiry} days)
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Badge
                                    variant={domain.status === "active" ? "default" : "destructive"}
                                    className="capitalize"
                                  >
                                    {domain.status}
                                  </Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-muted-foreground">
                            <Globe className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No domains registered yet</p>
                            <Button 
                              className="mt-4" 
                              onClick={() => setActiveTab("search")}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Register Your First Domain
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-6">
                    <Card className="card-glass border-0">
                      <CardHeader>
                        <CardTitle className="text-lg font-heading">{text.quickActions}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Button
                          className="w-full justify-start btn-glass font-body"
                          onClick={() => setActiveTab("search")}
                        >
                          <Plus className="mr-3 h-4 w-4" />
                          {text.addDomain}
                        </Button>
                        <Button
                          className="w-full justify-start btn-glass font-body"
                          onClick={() => setActiveTab("profile")}
                        >
                          <Settings className="mr-3 h-4 w-4" />
                          {text.manageSettings}
                        </Button>
                        <Button className="w-full justify-start btn-glass font-body">
                          <TrendingUp className="mr-3 h-4 w-4" />
                          {text.viewAnalytics}
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="card-glass border-0">
                      <CardHeader>
                        <CardTitle className="text-lg font-heading">{text.recentActivity}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {loading ? (
                          <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                              <div key={i} className="animate-pulse">
                                <div className="h-12 bg-gray-200 rounded"></div>
                              </div>
                            ))}
                          </div>
                        ) : recentActivity.length > 0 ? (
                          <div className="space-y-4">
                            {recentActivity.slice(0, 5).map((activity) => (
                              <div key={activity._id} className="flex items-start space-x-3">
                                <div className="mt-2">
                                  {activity.type === "success" && <CheckCircle className="h-4 w-4 text-green-500" />}
                                  {activity.type === "warning" && <AlertTriangle className="h-4 w-4 text-orange-500" />}
                                  {activity.type === "error" && <AlertTriangle className="h-4 w-4 text-red-500" />}
                                  {activity.type === "info" && <Info className="h-4 w-4 text-blue-500" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium">{activity.action}</p>
                                  {activity.domain && (
                                    <p className="text-xs text-muted-foreground">{activity.domain}</p>
                                  )}
                                  <p className="text-xs text-muted-foreground">
                                    {new Date(activity.timestamp).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-4 text-muted-foreground">
                            <p className="text-sm">No recent activity</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </>
            )}

            {activeTab === "domains" && <DomainManagement />}
            {activeTab === "search" && <DomainSearch />}
            {activeTab === "billing" && <BillingManagement />}
            {activeTab === "profile" && <UserProfile />}
            {activeTab === "community" && <CommunityHub />}
            {activeTab === "learning" && <LearningHub />}

            {/* Accredited Registrars Section */}
            {activeTab === "overview" && (
              <Card className="card-glass border-0 mt-8">
                <CardHeader>
                  <CardTitle className="flex items-center font-heading">
                    <Globe className="mr-3 h-5 w-5" />
                    Accredited Registrars
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {registrars.length === 0 ? (
                      <div className="text-muted-foreground">No registrars found.</div>
                    ) : (
                      registrars.slice(0, 6).map((reg) => (
                        <div key={reg._id || reg.name} className="p-3 rounded-lg bg-muted flex flex-col items-center shadow-sm">
                          <img
                            src={getLocalLogo(reg)}
                            alt={reg.name}
                            className="h-8 w-8 mb-2 object-contain"
                            onError={(e) => {
                              const img = e.currentTarget as HTMLImageElement
                              img.onerror = null
                              img.src = reg.logoUrl || "/logos/hostpinacle.webp"
                            }}
                          />
                          <span className="font-medium text-center">{reg.name}</span>
                          <span className="text-xs text-muted-foreground">{reg.website}</span>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Billing Overview Card */}
            {activeTab === "overview" && (
              <Card className="card-glass border-0 mt-8">
                <CardHeader>
                  <CardTitle className="flex items-center font-heading">
                    <DollarSign className="mr-3 h-5 w-5" />
                    Billing Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center">
                    {/* Replace with a real chart if you add Chart.js */}
                    <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-primary/20 to-accent/30 flex items-center justify-center mb-2">
                      <span className="text-2xl font-bold text-primary">
                        KSh {billingSummary.totalSpent.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between w-full text-sm text-muted-foreground">
                      <span>Pending: KSh {billingSummary.pendingPayments.toLocaleString()}</span>
                      <span>Monthly: KSh {billingSummary.monthlySpend.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </main>
        </div>

        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </ProtectedRoute>
  )
}