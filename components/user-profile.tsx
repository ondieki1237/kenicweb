"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  Shield,
  Bell,
  CreditCard,
  Key,
  Globe,
  Eye,
  EyeOff,
  Save,
  Upload,
  Languages,
  Smartphone,
  Lock,
  History,
  Settings,
  CheckCircle,
  AlertTriangle,
} from "lucide-react"

import { useAuth } from "@/contexts/auth-context"
import { getUser, updateUser, getMyProfile } from "@/lib/user"
import { apiPost } from "@/lib/api"

interface UserProfile {
  firstName: string
  lastName: string
  email: string
  phone: string
  company?: string
  address?: string
  city?: string
  country?: string
  language: "en" | "sw"
  timezone: string
}

interface NotificationSettings {
  emailNotifications: boolean
  smsNotifications: boolean
  domainExpiry: boolean
  paymentReminders: boolean
  securityAlerts: boolean
  marketingEmails: boolean
}

interface SecuritySettings {
  twoFactorAuth: boolean
  loginAlerts: boolean
  apiAccess: boolean
}

export default function UserProfile() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState("profile")
  const [isEditing, setIsEditing] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [loading, setLoading] = useState(false)

  const [profile, setProfile] = useState<UserProfile>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    address: "",
    city: "",
    country: "",
    language: "en",
    timezone: "Africa/Nairobi",
  })

  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    smsNotifications: true,
    domainExpiry: true,
    paymentReminders: true,
    securityAlerts: true,
    marketingEmails: false,
  })

  const [security, setSecurity] = useState<SecuritySettings>({
    twoFactorAuth: false,
    loginAlerts: true,
    apiAccess: false,
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const loginHistory = [
    { date: "2025-01-15 10:30 AM", location: "Nairobi, Kenya", device: "Chrome on Windows", status: "success" },
    { date: "2025-01-14 02:15 PM", location: "Nairobi, Kenya", device: "Safari on iPhone", status: "success" },
    { date: "2025-01-13 09:45 AM", location: "Mombasa, Kenya", device: "Chrome on Android", status: "success" },
    { date: "2025-01-12 11:20 PM", location: "Unknown Location", device: "Firefox on Linux", status: "blocked" },
  ]

  // Load profile from API when mounted or when user changes
  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        let u: any = null

        // If we have a user id from auth context, prefer fetching by id first.
        if (user?.id) {
          try {
            const res = await getUser(user.id)
            u = res?.user ?? res ?? null
          } catch (err) {
            // continue to try getMyProfile as fallback
            u = null
          }
        }

        // If no user from getUser, try getMyProfile to rebuild session from token/cookie
        if (!u) {
          try {
            u = await getMyProfile()
          } catch (err: any) {
            // If unauthorized, optionally log the user out to force re-login
            if (err?.message === "Unauthorized" || err?.message?.includes("401")) {
              try { await logout?.() } catch {}
              setLoading(false)
              return
            }
            // other errors: keep u null
            u = null
          }
        }

        if (u) {
          // normalize field names and populate local state
          setProfile({
            firstName: u.firstName ?? u.first_name ?? "",
            lastName: u.lastName ?? u.last_name ?? "",
            email: u.email ?? "",
            phone: u.phone ?? "",
            company: u.company ?? "",
            address: u.address ?? "",
            city: u.city ?? "",
            country: u.country ?? "",
            language: (u.language as "en" | "sw") ?? "en",
            timezone: u.timezone ?? "Africa/Nairobi",
          })
          setNotifications({
            emailNotifications: !!u.emailNotifications,
            smsNotifications: !!u.smsNotifications,
            domainExpiry: !!u.domainExpiry,
            paymentReminders: !!u.paymentReminders,
            securityAlerts: !!u.securityAlerts,
            marketingEmails: !!u.marketingEmails,
          })
          setSecurity({
            twoFactorAuth: !!u.twoFactorAuth,
            loginAlerts: !!u.loginAlerts,
            apiAccess: !!u.apiAccess,
          })
          setAvatarUrl(u.avatarUrl ?? u.avatar ?? null)

          // persist a lightweight copy for quick restores (optional)
          try {
            if (typeof window !== "undefined") {
              localStorage.setItem("auth_user", JSON.stringify({ id: u.id ?? u._id, firstName: u.firstName ?? u.first_name, lastName: u.lastName ?? u.last_name, email: u.email }))
            }
          } catch {}
        }
      } catch (err) {
        console.warn("Failed to load profile", err)
      } finally {
        setLoading(false)
      }
    }
    load()
    // run when auth user id changes or logout reference changes
  }, [user?.id, logout])

  const handleSaveProfile = async () => {
    if (!user?.id) return alert("Not logged in")
    setIsSaving(true)
    try {
      // merge profile + settings into updates
      const updates: any = {
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        phone: profile.phone,
        company: profile.company,
        address: profile.address,
        city: profile.city,
        country: profile.country,
        language: profile.language,
        timezone: profile.timezone,
        // include notification/security preferences
        ...notifications,
        ...security,
      }
      const res = await updateUser(user.id, updates)
      // update local profile state from response if provided
      const u = res?.user ?? res ?? null
      if (u) {
        setProfile((prev) => ({ ...prev, firstName: u.firstName ?? prev.firstName, lastName: u.lastName ?? prev.lastName, email: u.email ?? prev.email, phone: u.phone ?? prev.phone }))
      }
      // persist to local storage user object if present
      try {
        const stored = localStorage.getItem("auth_user")
        if (stored) {
          const parsed = JSON.parse(stored)
          const merged = { ...parsed, ...updates }
          localStorage.setItem("auth_user", JSON.stringify(merged))
        }
      } catch {}
      setIsEditing(false)
      alert("Profile updated")
    } catch (err: any) {
      alert(err?.message || "Update failed")
    } finally {
      setIsSaving(false)
    }
  }

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Passwords don't match!")
      return
    }
    setIsSaving(true)
    try {
      // backend may provide /api/auth/change-password
      await apiPost("/api/auth/change-password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      })
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
      alert("Password updated")
    } catch (err: any) {
      alert(err?.message || "Password change failed")
    } finally {
      setIsSaving(false)
    }
  }

  const handleNotificationChange = (key: keyof NotificationSettings, value: boolean) => {
    setNotifications((prev) => ({ ...prev, [key]: value }))
  }

  const handleSecurityChange = (key: keyof SecuritySettings, value: boolean) => {
    setSecurity((prev) => ({ ...prev, [key]: value }))
  }

  const handleAvatarUpload = async (file?: File) => {
    if (!user?.id) return alert("Not logged in")
    if (!file) return
    setIsSaving(true)
    try {
      const fd = new FormData()
      fd.append("avatar", file)
      // attempt POST /api/users/:id/avatar
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://mili-hack.onrender.com"}/api/users/${encodeURIComponent(user.id)}/avatar`, {
        method: "POST",
        body: fd,
        // auth header if present
        headers: (typeof window !== "undefined" && localStorage.getItem("auth_token")) ? { Authorization: `Bearer ${localStorage.getItem("auth_token")}` } : undefined,
      })
      const data = await res.json().catch(() => null)
      if (!res.ok) throw new Error(data?.message || data?.error || res.statusText)
      setAvatarUrl(data?.avatarUrl || data?.url || null)
      alert("Avatar uploaded")
    } catch (err: any) {
      alert(err?.message || "Upload failed")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <Avatar className="h-20 w-20">
                {avatarUrl ? <AvatarImage src={avatarUrl} /> : <AvatarFallback className="text-lg">{(profile.firstName?.[0] ?? "U") + (profile.lastName?.[0] ?? "")}</AvatarFallback>}
              </Avatar>
              <label className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 p-0 bg-transparent cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleAvatarUpload(e.target.files?.[0])}
                />
                <Button size="sm" className="h-8 w-8 p-0" variant="outline">
                  <Upload className="h-3 w-3" />
                </Button>
              </label>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">
                {profile.firstName || "User"} {profile.lastName || ""}
              </h2>
              <p className="text-muted-foreground">{profile.email}</p>
              <p className="text-sm text-muted-foreground">{profile.company}</p>
              <div className="flex items-center space-x-4 mt-2">
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Verified Account
                </Badge>
                <Badge>Member</Badge>
              </div>
            </div>
            <Button onClick={() => setIsEditing(!isEditing)} variant={isEditing ? "outline" : "default"}>
              {isEditing ? "Cancel" : "Edit Profile"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Settings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="api">API Access</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Personal Information
              </CardTitle>
              <CardDescription>Update your personal details and contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" value={profile.firstName} onChange={(e) => setProfile((p) => ({ ...p, firstName: e.target.value }))} disabled={!isEditing} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" value={profile.lastName} onChange={(e) => setProfile((p) => ({ ...p, lastName: e.target.value }))} disabled={!isEditing} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="email" type="email" value={profile.email} onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))} disabled={!isEditing} className="pl-10" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="phone" value={profile.phone} onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))} disabled={!isEditing} className="pl-10" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="company" value={profile.company} onChange={(e) => setProfile((p) => ({ ...p, company: e.target.value }))} disabled={!isEditing} className="pl-10" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="address" value={profile.address} onChange={(e) => setProfile((p) => ({ ...p, address: e.target.value }))} disabled={!isEditing} className="pl-10" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" value={profile.city} onChange={(e) => setProfile((p) => ({ ...p, city: e.target.value }))} disabled={!isEditing} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input id="country" value={profile.country} onChange={(e) => setProfile((p) => ({ ...p, country: e.target.value }))} disabled={!isEditing} />
                </div>
              </div>

              {/* Language and Timezone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                <div className="space-y-2">
                  <Label>Preferred Language</Label>
                  <div className="flex items-center space-x-3">
                    <Languages className="h-4 w-4 text-muted-foreground" />
                    <Switch checked={profile.language === "sw"} onCheckedChange={(checked) => setProfile((p) => ({ ...p, language: checked ? "sw" : "en" }))} disabled={!isEditing} />
                    <span className="text-sm">{profile.language === "sw" ? "Kiswahili" : "English"}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <select id="timezone" value={profile.timezone} onChange={(e) => setProfile((p) => ({ ...p, timezone: e.target.value }))} disabled={!isEditing} className="w-full p-2 border rounded-md">
                    <option value="Africa/Nairobi">Africa/Nairobi (EAT)</option>
                    <option value="UTC">UTC</option>
                  </select>
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isSaving}>Cancel</Button>
                  <Button onClick={handleSaveProfile} disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Settings className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Password Change */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lock className="mr-2 h-5 w-5" />
                  Change Password
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="relative">
                    <Input id="currentPassword" type={showCurrentPassword ? "text" : "password"} value={passwordData.currentPassword} onChange={(e) => setPasswordData((p) => ({ ...p, currentPassword: e.target.value }))} className="pr-10" />
                    <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3" onClick={() => setShowCurrentPassword(!showCurrentPassword)}>
                      {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Input id="newPassword" type={showNewPassword ? "text" : "password"} value={passwordData.newPassword} onChange={(e) => setPasswordData((p) => ({ ...p, newPassword: e.target.value }))} className="pr-10" />
                    <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3" onClick={() => setShowNewPassword(!showNewPassword)}>
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" value={passwordData.confirmPassword} onChange={(e) => setPasswordData((p) => ({ ...p, confirmPassword: e.target.value }))} />
                </div>
                <Button onClick={handlePasswordChange} className="w-full" disabled={isSaving}>
                  Update Password
                </Button>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="mr-2 h-5 w-5" />
                  Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Two-Factor Authentication</h4>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                  </div>
                  <Switch checked={security.twoFactorAuth} onCheckedChange={(checked) => handleSecurityChange("twoFactorAuth", checked)} />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Login Alerts</h4>
                    <p className="text-sm text-muted-foreground">Get notified of new logins</p>
                  </div>
                  <Switch checked={security.loginAlerts} onCheckedChange={(checked) => handleSecurityChange("loginAlerts", checked)} />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">API Access</h4>
                    <p className="text-sm text-muted-foreground">Enable API key generation</p>
                  </div>
                  <Switch checked={security.apiAccess} onCheckedChange={(checked) => handleSecurityChange("apiAccess", checked)} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Login History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <History className="mr-2 h-5 w-5" />
                Recent Login Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {loginHistory.map((login, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${login.status === "success" ? "bg-green-500" : "bg-red-500"}`} />
                      <div>
                        <p className="font-medium">{login.date}</p>
                        <p className="text-sm text-muted-foreground">
                          {login.location} • {login.device}
                        </p>
                      </div>
                    </div>
                    <Badge variant={login.status === "success" ? "default" : "destructive"}>{login.status}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="mr-2 h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>Choose how you want to receive notifications and alerts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-blue-500" />
                    <div>
                      <h4 className="font-medium">Email Notifications</h4>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                  </div>
                  <Switch checked={notifications.emailNotifications} onCheckedChange={(checked) => handleNotificationChange("emailNotifications", checked)} />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Smartphone className="h-5 w-5 text-green-500" />
                    <div>
                      <h4 className="font-medium">SMS Notifications</h4>
                      <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
                    </div>
                  </div>
                  <Switch checked={notifications.smsNotifications} onCheckedChange={(checked) => handleNotificationChange("smsNotifications", checked)} />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                    <div>
                      <h4 className="font-medium">Domain Expiry Alerts</h4>
                      <p className="text-sm text-muted-foreground">Get reminded before domains expire</p>
                    </div>
                  </div>
                  <Switch checked={notifications.domainExpiry} onCheckedChange={(checked) => handleNotificationChange("domainExpiry", checked)} />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="h-5 w-5 text-purple-500" />
                    <div>
                      <h4 className="font-medium">Payment Reminders</h4>
                      <p className="text-sm text-muted-foreground">Reminders for upcoming payments</p>
                    </div>
                  </div>
                  <Switch checked={notifications.paymentReminders} onCheckedChange={(checked) => handleNotificationChange("paymentReminders", checked)} />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-red-500" />
                    <div>
                      <h4 className="font-medium">Security Alerts</h4>
                      <p className="text-sm text-muted-foreground">Important security notifications</p>
                    </div>
                  </div>
                  <Switch checked={notifications.securityAlerts} onCheckedChange={(checked) => handleNotificationChange("securityAlerts", checked)} />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Globe className="h-5 w-5 text-gray-500" />
                    <div>
                      <h4 className="font-medium">Marketing Emails</h4>
                      <p className="text-sm text-muted-foreground">Product updates and promotions</p>
                    </div>
                  </div>
                  <Switch checked={notifications.marketingEmails} onCheckedChange={(checked) => handleNotificationChange("marketingEmails", checked)} />
                </div>
              </div>

              <Alert className="bg-blue-50 border-blue-200">
                <Bell className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  <strong>Calendar Integration:</strong> You can add domain expiry reminders directly to your calendar
                  for better tracking and planning.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="mr-2 h-5 w-5" />
                  Payment Methods
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
                        <Smartphone className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">M-Pesa</p>
                        <p className="text-sm text-muted-foreground">{profile.phone ? profile.phone : "+254 700 *** 456"}</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Primary</Badge>
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                        <CreditCard className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">Saved Card</p>
                        <p className="text-sm text-muted-foreground">**** **** **** 1234</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Edit</Button>
                  </div>
                </div>
                <Button variant="outline" className="w-full bg-transparent">Add Payment Method</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Billing Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Monthly Spend</span>
                  <span className="font-semibold">KSh 2,500</span>
                </div>
                <div className="flex justify-between">
                  <span>Next Payment</span>
                  <span>Feb 15, 2025</span>
                </div>
                <div className="flex justify-between">
                  <span>Auto-renewal</span>
                  <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                </div>
                <Button variant="outline" className="w-full bg-transparent">View Billing History</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* API Access Tab */}
        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Key className="mr-2 h-5 w-5" />
                API Access
              </CardTitle>
              <CardDescription>Manage your API keys for programmatic access to KeNIC services</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {security.apiAccess ? (
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Production API Key</h4>
                        <p className="text-sm text-muted-foreground font-mono">kenic_prod_*********************</p>
                        <p className="text-xs text-muted-foreground">Created: Jan 10, 2025 • Last used: 2 hours ago</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">Regenerate</Button>
                        <Button variant="outline" size="sm">Delete</Button>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Development API Key</h4>
                        <p className="text-sm text-muted-foreground font-mono">kenic_dev_*********************</p>
                        <p className="text-xs text-muted-foreground">Created: Jan 5, 2025 • Last used: Never</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">Regenerate</Button>
                        <Button variant="outline" size="sm">Delete</Button>
                      </div>
                    </div>
                  </div>
                  <Button>Generate New API Key</Button>
                </div>
              ) : (
                <Alert>
                  <Key className="h-4 w-4" />
                  <AlertDescription>
                    API access is currently disabled. Enable it in the Security settings to generate API keys.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
