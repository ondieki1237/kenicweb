"use client";

import { useState, useEffect } from "react"; // Added useEffect for auth state handling
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Bell,
  Settings,
  Users,
  BookOpen,
  Languages,
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
  ChevronDown,
} from "lucide-react";
import DomainSearch from "@/components/domain-search";
import DomainManagement from "@/components/domain-management";
import UserProfile from "@/components/user-profile";
import BillingManagement from "@/components/billing-management";
import CommunityHub from "@/components/community-hub";
import LearningHub from "@/components/learning-hub";
import Link from "next/link";
import ProtectedRoute from "@/components/protected-route";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSwahili, setIsSwahili] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  const userDomains = [
    {
      id: 1,
      name: "mybusiness.co.ke",
      status: "active",
      expiryDate: "2025-12-15",
      daysUntilExpiry: 120,
      autoRenew: true,
      registrar: "Safaricom",
    },
    {
      id: 2,
      name: "myshop.or.ke",
      status: "expiring",
      expiryDate: "2025-02-28",
      daysUntilExpiry: 15,
      autoRenew: false,
      registrar: "KCB Bank",
    },
    {
      id: 3,
      name: "portfolio.me.ke",
      status: "active",
      expiryDate: "2025-08-10",
      daysUntilExpiry: 85,
      autoRenew: true,
      registrar: "Equity Bank",
    },
  ];

  const recentActivity = [
    { action: "Domain renewed", domain: "mybusiness.co.ke", time: "2 hours ago", type: "success" },
    { action: "DNS updated", domain: "myshop.or.ke", time: "1 day ago", type: "info" },
    { action: "Payment processed", domain: "portfolio.me.ke", time: "3 days ago", type: "success" },
    { action: "Expiry reminder sent", domain: "myshop.or.ke", time: "1 week ago", type: "warning" },
  ];

  const text = {
    en: {
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
      language: "Language",
      english: "English",
      swahili: "Kiswahili",
      notifications: "Notifications",
      logout: "Logout",
      role: "Role",
      company: "Company",
    },
    sw: {
      dashboard: "Dashibodi",
      domains: "Vikoa Vyangu",
      search: "Utafutaji wa Kikoa",
      community: "Jumuiya",
      learning: "Kituo cha Kujifunza",
      settings: "Mipangilio",
      profile: "Wasifu",
      billing: "Malipo",
      welcome: "Karibu tena",
      totalDomains: "Vikoa Vyote",
      expiringDomains: "Vinapoisha Hivi Karibuni",
      activeServices: "Huduma Zinazofanya Kazi",
      monthlySpend: "Matumizi ya Kila Mwezi",
      searchPlaceholder: "Tafuta vikoa vya .KE vinavyopatikana...",
      recentActivity: "Shughuli za Hivi Karibuni",
      quickActions: "Vitendo vya Haraka",
      renewDomain: "Ongeza Muda wa Kikoa",
      addDomain: "Ongeza Kikoa Kipya",
      manageSettings: "Simamia Mipangilio",
      viewAnalytics: "Ona Takwimu",
      backToHome: "Rudi Nyumbani",
      language: "Lugha",
      english: "Kiingereza",
      swahili: "Kiswahili",
      notifications: "Arifa",
      logout: "Toka",
      role: "Jukumu",
      company: "Kampuni",
    },
  };

  const t = isSwahili ? text.sw : text.en;

  // Use fallback if user is not available
  const welcomeMessage = user
    ? `${t.welcome}, ${user.firstName} ${user.lastName}! 👋`
    : `${t.welcome}! 👋`;

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  // Show loading state while checking authentication
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-crimson-50 via-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-crimson-50 via-blue-50 to-white">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
              <div className="flex items-center space-x-3">
                <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                  <img src="/kenic-official-logo.png" alt="KeNIC Logo" className="h-8 w-auto cursor-pointer" />
                  <span className="text-xl font-bold font-serif hidden sm:block">KeNIC Dashboard</span>
                </Link>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-2"
                  onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
                >
                  <Languages className="h-4 w-4" />
                  <span className="text-sm font-medium">{isSwahili ? "SW" : "EN"}</span>
                  <ChevronDown className="h-3 w-3" />
                </Button>

                {languageDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                    <div className="py-1">
                      <button
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center space-x-2 ${
                          !isSwahili ? "bg-blue-50 text-blue-600" : ""
                        }`}
                        onClick={() => {
                          setIsSwahili(false);
                          setLanguageDropdownOpen(false);
                        }}
                      >
                        <span className="text-lg">🇬🇧</span>
                        <span>{t.english}</span>
                      </button>
                      <button
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center space-x-2 ${
                          isSwahili ? "bg-blue-50 text-blue-600" : ""
                        }`}
                        onClick={() => {
                          setIsSwahili(true);
                          setLanguageDropdownOpen(false);
                        }}
                      >
                        <span className="text-lg">🇰🇪</span>
                        <span>{t.swahili}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <Button variant="ghost" size="sm" className="relative" title={t.notifications}>
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-red-500">3</Badge>
              </Button>

              <Button variant="ghost" size="sm" asChild title={t.backToHome}>
                <Link href="/">
                  <Home className="h-5 w-5" />
                </Link>
              </Button>

              <Button variant="ghost" size="sm" onClick={handleLogout} title={t.logout}>
                <span className="text-sm">{t.logout}</span>
              </Button>

              <Avatar className="h-8 w-8 cursor-pointer" onClick={() => setActiveTab("profile")}>
                <AvatarImage src="/customer-avatar-sarah.png" />
                <AvatarFallback>
                  {user?.firstName && user?.lastName
                    ? `${user.firstName[0]}${user.lastName[0]}`
                    : "GU"}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {languageDropdownOpen && (
          <div className="fixed inset-0 z-40" onClick={() => setLanguageDropdownOpen(false)} />
        )}

        <div className="flex">
          {/* Sidebar */}
          <aside
            className={`${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            } fixed inset-y-0 left-0 z-40 w-64 bg-white/90 backdrop-blur-md border-r border-border transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 pt-16 lg:pt-0`}
          >
            <nav className="p-4 space-y-2">
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/">
                  <Home className="mr-3 h-4 w-4" />
                  {t.backToHome}
                </Link>
              </Button>

              <Button
                variant={activeTab === "overview" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("overview")}
              >
                <Activity className="mr-3 h-4 w-4" />
                {t.dashboard}
              </Button>

              <Button
                variant={activeTab === "domains" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("domains")}
              >
                <Globe className="mr-3 h-4 w-4" />
                {t.domains}
              </Button>
              <Button
                variant={activeTab === "search" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("search")}
              >
                <Search className="mr-3 h-4 w-4" />
                {t.search}
              </Button>
              <Button
                variant={activeTab === "billing" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("billing")}
              >
                <Receipt className="mr-3 h-4 w-4" />
                {t.billing}
              </Button>
              <Button
                variant={activeTab === "community" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("community")}
              >
                <Users className="mr-3 h-4 w-4" />
                {t.community}
              </Button>
              <Button
                variant={activeTab === "learning" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("learning")}
              >
                <BookOpen className="mr-3 h-4 w-4" />
                {t.learning}
              </Button>
              <Button
                variant={activeTab === "profile" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("profile")}
              >
                <User className="mr-3 h-4 w-4" />
                {t.profile}
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Settings className="mr-3 h-4 w-4" />
                {t.settings}
              </Button>
            </nav>

            <div className="p-4 mt-8">
              <Card className="bg-gradient-to-r from-primary/10 to-blue-500/10">
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">3</div>
                    <div className="text-sm text-muted-foreground">{t.totalDomains}</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-4 lg:p-6 lg:ml-0">
            {/* Welcome Section */}
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-bold font-serif mb-2">{welcomeMessage}</h1>
              <p className="text-muted-foreground">
                {isSwahili
                  ? "Simamia vikoa vyako vya .KE na upanue biashara yako mtandaoni."
                  : "Manage your .KE domains and grow your online presence."}
              </p>
              {/* Display Role and Company */}
              <div className="mt-2 text-sm text-muted-foreground">
                <p>
                  <span className="font-medium">{t.role}:</span>{" "}
                  {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "N/A"}
                </p>
                {user.company && (
                  <p>
                    <span className="font-medium">{t.company}:</span> {user.company}
                  </p>
                )}
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{t.totalDomains}</p>
                      <p className="text-2xl font-bold">3</p>
                    </div>
                    <Globe className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{t.expiringDomains}</p>
                      <p className="text-2xl font-bold text-orange-600">1</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{t.activeServices}</p>
                      <p className="text-2xl font-bold text-green-600">5</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{t.monthlySpend}</p>
                      <p className="text-2xl font-bold">KSh 2,500</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Dynamic Content Based on Active Tab */}
            {activeTab === "overview" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Domain Status Overview */}
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Globe className="mr-2 h-5 w-5" />
                        Domain Portfolio
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {userDomains.map((domain) => (
                          <div
                            key={domain.id}
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
                                <p className="font-medium">{domain.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  Expires: {domain.expiryDate} ({domain.daysUntilExpiry} days)
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
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Actions & Recent Activity */}
                <div className="space-y-4">
                  {/* Quick Actions */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">{t.quickActions}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button
                        className="w-full justify-start bg-transparent"
                        variant="outline"
                        onClick={() => setActiveTab("search")}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        {t.addDomain}
                      </Button>
                      <Button
                        className="w-full justify-start bg-transparent"
                        variant="outline"
                        onClick={() => setActiveTab("profile")}
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        {t.manageSettings}
                      </Button>
                      <Button className="w-full justify-start bg-transparent" variant="outline">
                        <TrendingUp className="mr-2 h-4 w-4" />
                        {t.viewAnalytics}
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Recent Activity */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">{t.recentActivity}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {recentActivity.map((activity, index) => (
                          <div key={index} className="flex items-start space-x-3">
                            <div
                              className={`w-2 h-2 rounded-full mt-2 ${
                                activity.type === "success"
                                  ? "bg-green-500"
                                  : activity.type === "warning"
                                    ? "bg-orange-500"
                                    : "bg-blue-500"
                              }`}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium">{activity.action}</p>
                              <p className="text-xs text-muted-foreground">{activity.domain}</p>
                              <p className="text-xs text-muted-foreground">{activity.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === "domains" && <DomainManagement />}
            {activeTab === "search" && <DomainSearch />}
            {activeTab === "billing" && <BillingManagement />}
            {activeTab === "profile" && <UserProfile />}
            {activeTab === "community" && <CommunityHub />}
            {activeTab === "learning" && <LearningHub />}
          </main>
        </div>

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}
      </div>
    </ProtectedRoute>
  );
}