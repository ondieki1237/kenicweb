"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  ShoppingCart,
  Info,
} from "lucide-react";
import Link from "next/link";
import { getCart as fetchCart } from "@/lib/cart";
import DomainSearch from "@/components/domain-search";
import DomainManagement from "@/components/domain-management";
import UserProfile from "@/components/user-profile";
import BillingManagement from "@/components/billing-management";
import CommunityHub from "@/components/community-hub";
import LearningHub from "@/components/learning-hub";
import ProtectedRoute from "@/components/protected-route";
import { useAuth } from "@/contexts/auth-context";
import { useRouter, useSearchParams } from "next/navigation";
import { domainApi, billingApi } from "@/lib/api";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";

// Register Chart.js components
Chart.register(ArcElement, Tooltip, Legend);

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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const { user, logout } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Cart count state
  const [cartCount, setCartCount] = useState<number>(0);

  const refreshCartCount = async () => {
    try {
      if (!user?.id) {
        setCartCount(0);
        return;
      }
      const res = await fetchCart(user.id);
      const items = res?.cart || res?.items || [];
      setCartCount(Array.isArray(items) ? items.length : 0);
    } catch (err) {
      console.error("Failed to load cart count:", err);
      setCartCount(0);
    }
  };

  useEffect(() => {
    if (!user) return;
    refreshCartCount();
  }, [user]);

  // Real data state
  const [userDomains, setUserDomains] = useState<UserDomain[]>([]);
  const [recentActivity, setRecentActivity] = useState<UserActivity[]>([]);
  const [billingSummary, setBillingSummary] = useState<BillingSummary>({
    totalSpent: 0,
    pendingPayments: 0,
    monthlySpend: 0,
  });
  const [loading, setLoading] = useState(true);
  const [registrars, setRegistrars] = useState<any[]>([]);
  const [apiStatus, setApiStatus] = useState<"online" | "offline" | "checking">("checking");

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "search") setActiveTab("search");
  }, [searchParams]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const [domainsRes, activityRes, billingRes] = await Promise.all([
          domainApi.getUserDomains(),
          domainApi.getUserActivity(),
          billingApi.getBillingSummary(),
        ]);

        setUserDomains(domainsRes.domains || []);
        setRecentActivity(activityRes.activities || []);
        setBillingSummary(
          billingRes.summary || {
            totalSpent: 0,
            pendingPayments: 0,
            monthlySpend: 0,
          }
        );
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    domainApi
      .getRegistrars()
      .then((res) => setRegistrars(res.registrars || []))
      .catch(() => setRegistrars([]));
  }, [user]);

  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_API_URL || "https://mili-hack.onrender.com/")
      .then((res) => setApiStatus(res.ok ? "online" : "offline"))
      .catch(() => setApiStatus("offline"));
  }, []);

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
  };

  const welcomeMessage = user
    ? `${text.welcome}, ${user.firstName} ${user.lastName}! 👋`
    : `${text.welcome}! 👋`;

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  // Calculate dashboard stats
  const totalDomains = userDomains.length;
  const expiringDomains = userDomains.filter((d) => d.status === "expiring").length;
  const activeServices = userDomains.filter((d) => d.status === "active").length;

  // Pie chart data for billing overview
  const pieChartData = {
    labels: ["Total Spent", "Pending Payments", "Monthly Spend"],
    datasets: [
      {
        data: [
          billingSummary.totalSpent,
          billingSummary.pendingPayments,
          billingSummary.monthlySpend,
        ],
        backgroundColor: ["#16A34A", "#EF4444", "#111827"],
        borderColor: ["#fff", "#fff", "#fff"],
        borderWidth: 2,
      },
    ],
  };

  const getLocalLogo = (reg: any) => {
    const base = (reg.slug || reg.name || "").toString().toLowerCase();
    const slug = base.replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    return `/logos/${slug}.png`;
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100 dark:bg-neutral transition-colors duration-300">
        <header className="bg-white dark:bg-neutral/90 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto flex items-center justify-between px-3 sm:px-4 py-3">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden hover:bg-gray-100 dark:hover:bg-neutral/70"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                aria-label="Open menu"
              >
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
              <Link href="/" className="flex items-center space-x-2 hover:opacity-90 transition-opacity">
                <img src="/kenic-official-logo.png" alt="KeNIC Logo" className="h-7 w-auto sm:h-8" />
                <span className="text-lg font-heading-bold hidden sm:inline-block dark:text-gray-100">KeNIC</span>
              </Link>
            </div>

            {/* Desktop search */}
            <div className="hidden sm:flex flex-1 mx-4 max-w-lg">
              <input
                type="search"
                placeholder={text.searchPlaceholder}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-green-500/30 transition"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.currentTarget.value) {
                    setActiveTab("search");
                    // optionally pass value to DomainSearch via state or router
                  }
                }}
              />
            </div>

            {/* Mobile search button */}
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                className="sm:hidden hover:bg-gray-100 dark:hover:bg-neutral/70"
                onClick={() => setMobileSearchOpen(true)}
                aria-label="Search"
              >
                <Search className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-gray-100 dark:hover:bg-neutral/70"
                title={text.notifications}
              >
                <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-red-500 text-white">
                  3
                </Badge>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                asChild
                title={text.backToHome}
                className="hover:bg-green-100 dark:hover:bg-green-900/50"
              >
                <Link href="/">
                  <Home className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                </Link>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                asChild
                title="Cart"
                className="relative hover:bg-gray-100 dark:hover:bg-neutral/70"
              >
                <Link href="/cart" className="relative inline-flex items-center">
                  <ShoppingCart className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                  {cartCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs bg-red-500 text-white">
                      {cartCount}
                    </Badge>
                  )}
                </Link>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                title={text.logout}
                className="hover:bg-gray-100 dark:hover:bg-neutral/70 font-body text-gray-600 dark:text-gray-300 hidden sm:inline-flex"
              >
                {text.logout}
              </Button>

              <Avatar
                className="h-9 w-9 cursor-pointer ring-2 ring-green-500/30 dark:ring-green-500/50 hover:ring-green-500/50 dark:hover:ring-green-500/70 transition-all"
                onClick={() => setActiveTab("profile")}
              >
                <AvatarImage src="/customer-avatar-sarah.png" />
                <AvatarFallback className="font-body text-gray-600 dark:text-gray-300">
                  {user && user.firstName && user.lastName ? `${user.firstName[0]}${user.lastName[0]}` : "JM"}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>

          {/* Mobile full-screen search overlay */}
          {mobileSearchOpen && (
            <div className="sm:hidden fixed inset-0 z-50 bg-black/40 flex items-start p-4">
              <div className="w-full bg-white dark:bg-neutral/95 rounded-xl p-3 shadow-lg">
                <div className="flex items-center gap-2">
                  <input
                    autoFocus
                    type="search"
                    placeholder={text.searchPlaceholder}
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 focus:outline-none"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && e.currentTarget.value) {
                        setActiveTab("search");
                        setMobileSearchOpen(false);
                      }
                    }}
                  />
                  <Button variant="ghost" onClick={() => setMobileSearchOpen(false)} aria-label="Close search">
                    Close
                  </Button>
                </div>
              </div>
            </div>
          )}
        </header>

        <div className="flex max-w-7xl mx-auto w-full">
          <aside
            className={`${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            } fixed inset-y-0 left-0 z-40 w-full max-w-xs sm:max-w-xs md:max-w-sm bg-white/95 dark:bg-neutral/95 backdrop-blur-md border-r border-gray-200/50 dark:border-gray-700/50 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 pt-16 lg:pt-0 h-screen lg:h-auto`}
          >
            <nav className="p-4 space-y-1 overflow-y-auto h-full lg:h-auto">
              <Button
                variant="ghost"
                className="w-full justify-start hover:bg-green-100 dark:hover:bg-green-900/50 font-body text-gray-700 dark:text-gray-200"
                asChild
              >
                <Link href="/">
                  <div className="flex items-center"><Home className="mr-3 h-4 w-4" />{text.backToHome}</div>
                </Link>
              </Button>

              {[
                { tab: "overview", icon: Activity, label: text.dashboard },
                { tab: "domains", icon: Globe, label: text.domains },
                { tab: "search", icon: Search, label: text.search },
                { tab: "billing", icon: Receipt, label: text.billing },
                { tab: "community", icon: Users, label: text.community },
                { tab: "learning", icon: BookOpen, label: text.learning },
                { tab: "profile", icon: User, label: text.profile },
                { tab: "settings", icon: Settings, label: text.settings },
              ].map(({ tab, icon: Icon, label }) => (
                <Button
                  key={tab}
                  variant={activeTab === tab ? "default" : "ghost"}
                  className={`w-full justify-start font-body text-gray-700 dark:text-gray-200 ${
                    activeTab === tab ? "btn-primary" : "hover:bg-green-100 dark:hover:bg-green-900/50"
                  }`}
                  onClick={() => {
                    setActiveTab(tab);
                    setSidebarOpen(false);
                  }}
                >
                  <Icon className="mr-3 h-4 w-4" />
                  <span className="truncate">{label}</span>
                </Button>
              ))}

              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                <div className="text-xs text-muted-foreground mb-2">Quick stats</div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center justify-between bg-white dark:bg-neutral/50 px-3 py-2 rounded-md shadow-sm">
                    <div>
                      <div className="text-xs text-muted-foreground">Domains</div>
                      <div className="text-lg font-heading-bold">{totalDomains}</div>
                    </div>
                    <Globe className="h-5 w-5 text-black dark:text-gray-100" />
                  </div>

                  <div className="flex items-center justify-between bg-white dark:bg-neutral/50 px-3 py-2 rounded-md shadow-sm">
                    <div>
                      <div className="text-xs text-muted-foreground">Expiring</div>
                      <div className="text-lg font-heading-bold text-red-600">{expiringDomains}</div>
                    </div>
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  </div>
                </div>
              </div>

              <div className="mt-6 text-xs text-muted-foreground flex items-center gap-2">
                <span>API Status:</span>
                <span
                  className={`w-2 h-2 rounded-full ${apiStatus === "online" ? "bg-green-500" : "bg-red-500"}`}
                ></span>
                <span className="capitalize">{apiStatus}</span>
              </div>
            </nav>
          </aside>

          <main className="flex-1 p-3 sm:p-4 lg:p-6">
            <div className="mb-6 animate-fade-in">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading-bold text-gray-800 dark:text-gray-100 mb-1">
                {welcomeMessage}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 font-body text-sm sm:text-base leading-relaxed">
                Manage your .KE domains and grow your online presence.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 mb-6">
              {[
                {
                  title: text.totalDomains,
                  value: totalDomains,
                  icon: Globe,
                  color: "text-green-500",
                },
                {
                  title: text.expiringDomains,
                  value: expiringDomains,
                  icon: AlertTriangle,
                  color: "text-red-500",
                },
                {
                  title: text.activeServices,
                  value: activeServices,
                  icon: CheckCircle,
                  color: "text-green-600",
                },
                {
                  title: text.monthlySpend,
                  value: `KSh ${billingSummary.monthlySpend.toLocaleString()}`,
                  icon: DollarSign,
                  color: "text-black",
                },
              ].map(({ title, value, icon: Icon, color }, index) => (
                <Card
                  key={index}
                  className="card-glass hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <CardContent className="p-4 sm:p-6 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-body">{title}</p>
                      <p className={`text-lg sm:text-2xl font-heading-bold ${color}`}>{value}</p>
                    </div>
                    <Icon className={`h-7 w-7 sm:h-8 sm:w-8 ${color} animate-float-gentle`} />
                  </CardContent>
                </Card>
              ))}

              <Card
                className="card-glass border-2 border-dashed border-green-500/40 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer col-span-2 sm:col-span-1 lg:col-span-1"
                onClick={() => setActiveTab("search")}
              >
                <CardContent className="p-4 sm:p-6 flex flex-col items-center justify-center h-full">
                  <Plus className="h-7 w-7 text-green-500 mb-2 animate-bounce" />
                  <p className="text-lg sm:text-xl font-heading-bold text-green-500 dark:text-green-400">Register New Domain</p>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">Find and secure your next .KE domain</p>
                </CardContent>
              </Card>
            </div>

            {activeTab === "overview" && (
              <>
                <div className="mb-4 sm:mb-6">
                  <input
                    type="text"
                    placeholder="Quick search for a .KE domain..."
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-neutral/50 focus:ring-2 focus:ring-green-500/40 font-body text-sm sm:text-base shadow-sm transition-all"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && e.currentTarget.value) {
                        setActiveTab("search");
                      }
                    }}
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className="lg:col-span-2">
                    <Card className="card-glass">
                      <CardHeader>
                        <CardTitle className="flex items-center font-heading text-lg sm:text-xl text-gray-800 dark:text-gray-100">
                          <Globe className="mr-2 h-4 w-4" />
                          Domain Portfolio
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {loading ? (
                          <div className="space-y-3">
                            {[1, 2, 3].map((i) => (
                              <div key={i} className="animate-pulse">
                                <div className="h-12 sm:h-16 bg-gray-200 dark:bg-neutral/50 rounded-lg"></div>
                              </div>
                            ))}
                          </div>
                        ) : userDomains.length > 0 ? (
                          <div className="space-y-3">
                            {userDomains.slice(0, 5).map((domain, index) => (
                              <div
                                key={domain._id}
                                className={`flex items-center justify-between p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-700 ${
                                  index % 2 === 0 ? "bg-white/50 dark:bg-neutral/50" : "bg-gray-50/50 dark:bg-neutral/70"
                                } hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors cursor-pointer`}
                                onClick={() => setActiveTab("domains")}
                              >
                                <div className="flex items-center space-x-3">
                                  <div
                                    className={`w-3 h-3 rounded-full ${
                                      domain.status === "active"
                                        ? "bg-green-500"
                                        : domain.status === "expiring"
                                        ? "bg-red-500"
                                        : "bg-gray-500"
                                    }`}
                                  />
                                  <div>
                                    <p className="font-medium text-sm sm:text-base text-gray-800 dark:text-gray-100">{domain.fullDomain}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                      Expires: {new Date(domain.expiryDate).toLocaleDateString()} (
                                      {domain.daysUntilExpiry} days)
                                    </p>
                                  </div>
                                </div>
                                <Badge
                                  variant={domain.status === "active" ? "default" : "destructive"}
                                  className="capitalize bg-green-500 dark:bg-green-600 text-white text-xs"
                                >
                                  {domain.status}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                            <Globe className="h-10 w-10 mx-auto mb-3 opacity-50" />
                            <p>No domains registered yet</p>
                            <Button
                              className="mt-3 btn-primary"
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

                  <div className="space-y-4">
                    <Card className="card-glass">
                      <CardHeader>
                        <CardTitle className="text-base sm:text-lg font-heading text-gray-800 dark:text-gray-100">
                          {text.quickActions}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {[
                          { label: text.addDomain, icon: Plus, action: () => setActiveTab("search") },
                          { label: text.manageSettings, icon: Settings, action: () => setActiveTab("profile") },
                          { label: text.viewAnalytics, icon: TrendingUp, action: () => {} },
                        ].map(({ label, icon: Icon, action }, index) => (
                          <Button
                            key={index}
                            className="w-full justify-start btn-glass font-body text-gray-700 dark:text-gray-200"
                            onClick={action}
                          >
                            <Icon className="mr-3 h-4 w-4" />
                            <span className="truncate">{label}</span>
                          </Button>
                        ))}
                      </CardContent>
                    </Card>

                    <Card className="card-glass">
                      <CardHeader>
                        <CardTitle className="text-base sm:text-lg font-heading text-gray-800 dark:text-gray-100">
                          {text.recentActivity}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {loading ? (
                          <div className="space-y-3">
                            {[1, 2, 3].map((i) => (
                              <div key={i} className="animate-pulse">
                                <div className="h-12 bg-gray-200 dark:bg-neutral/50 rounded"></div>
                              </div>
                            ))}
                          </div>
                        ) : recentActivity.length > 0 ? (
                          <div className="space-y-3">
                            {recentActivity.slice(0, 5).map((activity) => (
                              <div key={activity._id} className="flex items-start space-x-3">
                                <div className="mt-2">
                                  {activity.type === "success" && (
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                  )}
                                  {activity.type === "warning" && (
                                    <AlertTriangle className="h-4 w-4 text-red-500" />
                                  )}
                                  {activity.type === "error" && (
                                    <AlertTriangle className="h-4 w-4 text-red-500" />
                                  )}
                                  {activity.type === "info" && <Info className="h-4 w-4 text-black" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{activity.action}</p>
                                  {activity.domain && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{activity.domain}</p>
                                  )}
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {new Date(activity.timestamp).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                            <p className="text-sm">No recent activity</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <Card className="card-glass mt-6">
                  <CardHeader>
                    <CardTitle className="flex items-center font-heading text-lg sm:text-xl text-gray-800 dark:text-gray-100">
                      <Globe className="mr-2 h-4 w-4" />
                      Accredited Registrars
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {registrars.length === 0 ? (
                        <div className="text-gray-500 dark:text-gray-400">No registrars found.</div>
                      ) : (
                        registrars.slice(0, 6).map((reg) => (
                          <div
                            key={reg._id || reg.name}
                            className="p-2 sm:p-3 rounded-lg bg-white/50 dark:bg-neutral/50 flex flex-col items-center shadow-sm hover:shadow-md transition-shadow"
                          >
                            <img
                              src={getLocalLogo(reg)}
                              alt={reg.name}
                              className="h-8 w-8 mb-1 object-contain"
                              onError={(e) => {
                                const img = e.currentTarget as HTMLImageElement;
                                img.onerror = null;
                                img.src = reg.logoUrl || "/logos/hostpinacle.webp";
                              }}
                            />
                            <span className="text-sm font-medium text-gray-800 dark:text-gray-100">{reg.name}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">{reg.website}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="card-glass mt-6">
                  <CardHeader>
                    <CardTitle className="flex items-center font-heading text-lg sm:text-xl text-gray-800 dark:text-gray-100">
                      <DollarSign className="mr-2 h-4 w-4" />
                      Billing Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center">
                      <div className="w-40 h-40 sm:w-48 sm:h-48 mb-4">
                        <Pie
                          data={pieChartData}
                          options={{
                            responsive: true,
                            maintainAspectRatio: true,
                            plugins: {
                              legend: {
                                position: "bottom",
                                labels: { color: "#374151" },
                              },
                            },
                          }}
                        />
                      </div>
                      <div className="flex flex-col sm:flex-row justify-between w-full text-sm text-gray-500 dark:text-gray-400 gap-2">
                        <span>Pending: KSh {billingSummary.pendingPayments.toLocaleString()}</span>
                        <span>Monthly: KSh {billingSummary.monthlySpend.toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {activeTab === "domains" && <DomainManagement />}
            {activeTab === "search" && <DomainSearch />}
            {activeTab === "billing" && <BillingManagement />}
            {activeTab === "profile" && <UserProfile />}
            {activeTab === "community" && <CommunityHub />}
            {activeTab === "learning" && <LearningHub />}

            {/* Mobile bottom nav */}
            <div className="lg:hidden fixed bottom-3 left-1/2 transform -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-md bg-white/95 dark:bg-neutral/95 rounded-xl shadow-lg p-2 flex justify-between items-center">
              {[
                { tab: "overview", icon: Activity, label: "Home" },
                { tab: "domains", icon: Globe, label: "Domains" },
                { tab: "search", icon: Search, label: "Search" },
                { tab: "billing", icon: Receipt, label: "Billing" },
                { tab: "profile", icon: User, label: "Profile" },
              ].map(({ tab, icon: Icon, label }) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className={`flex-1 flex flex-col items-center justify-center text-xs sm:text-sm py-2 rounded-md ${
                    activeTab === tab ? "bg-black/5 dark:bg-white/5" : "hover:bg-gray-50 dark:hover:bg-neutral/80"
                  }`}
                >
                  <Icon className={`h-5 w-5 ${activeTab === tab ? "text-black dark:text-white" : "text-gray-600 dark:text-gray-300"}`} />
                  <span className="mt-1">{label}</span>
                </button>
              ))}
            </div>

            {sidebarOpen && (
              <div
                className="fixed inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-sm z-30 lg:hidden"
                onClick={() => setSidebarOpen(false)}
              />
            )}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}