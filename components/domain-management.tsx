"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Globe, Settings, RefreshCw, Shield, Calendar, Bell, Edit, Trash2, Plus, AlertTriangle } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

interface Domain {
  id: string
  name: string
  extension: string
  status: "active" | "expiring" | "expired" | "pending"
  expiryDate: string
  daysUntilExpiry: number
  autoRenew: boolean
  registrar: string
  nameServers: string[]
  dnsRecords: DNSRecord[]
}

interface DNSRecord {
  type: "A" | "CNAME" | "MX" | "TXT"
  name: string
  value: string
  ttl: number
}

export default function DomainManagement() {
  const { user } = useAuth()
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null)
  const [newDNSRecord, setNewDNSRecord] = useState({ type: "A", name: "", value: "", ttl: 3600 })
  const [domains, setDomains] = useState<Domain[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      loadUserDomains()
    }
  }, [user])

  const loadUserDomains = async () => {
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      // For now, using mock data until backend endpoint is available
      const mockDomains: Domain[] = [
        {
          id: "1",
          name: "mybusiness",
          extension: ".co.ke",
          status: "active",
          expiryDate: "2025-12-15",
          daysUntilExpiry: 120,
          autoRenew: true,
          registrar: "Safaricom Ltd",
          nameServers: ["ns1.safaricom.co.ke", "ns2.safaricom.co.ke"],
          dnsRecords: [
            { type: "A", name: "@", value: "192.168.1.1", ttl: 3600 },
            { type: "CNAME", name: "www", value: "mybusiness.co.ke", ttl: 3600 },
            { type: "MX", name: "@", value: "mail.mybusiness.co.ke", ttl: 3600 },
          ],
        },
        {
          id: "2",
          name: "myshop",
          extension: ".or.ke",
          status: "expiring",
          expiryDate: "2025-02-28",
          daysUntilExpiry: 15,
          autoRenew: false,
          registrar: "KCB Bank",
          nameServers: ["ns1.kcb.co.ke", "ns2.kcb.co.ke"],
          dnsRecords: [
            { type: "A", name: "@", value: "192.168.1.2", ttl: 3600 },
            { type: "CNAME", name: "www", value: "myshop.or.ke", ttl: 3600 },
          ],
        },
      ]

      setDomains(mockDomains)
    } catch (err: any) {
      setError(err.message || "Failed to load domains")
    } finally {
      setLoading(false)
    }
  }

  const handleAutoRenewToggle = async (domainId: string) => {
    try {
      console.log(`Toggling auto-renew for domain ${domainId}`)
      // Update local state
      setDomains((prev) =>
        prev.map((domain) => (domain.id === domainId ? { ...domain, autoRenew: !domain.autoRenew } : domain)),
      )
    } catch (err: any) {
      setError(err.message || "Failed to update auto-renew setting")
    }
  }

  const handleRenewDomain = async (domainId: string) => {
    try {
      console.log(`Renewing domain ${domainId}`)
      // Update local state
      setDomains((prev) =>
        prev.map((domain) => (domain.id === domainId ? { ...domain, status: "active", daysUntilExpiry: 365 } : domain)),
      )
    } catch (err: any) {
      setError(err.message || "Failed to renew domain")
    }
  }

  const handleAddDNSRecord = async () => {
    if (!selectedDomain || !newDNSRecord.name || !newDNSRecord.value) return

    try {
      console.log("Adding DNS record:", newDNSRecord)

      // Update local state
      const updatedDomain = {
        ...selectedDomain,
        dnsRecords: [...selectedDomain.dnsRecords, newDNSRecord as DNSRecord],
      }

      setSelectedDomain(updatedDomain)
      setDomains((prev) => prev.map((domain) => (domain.id === selectedDomain.id ? updatedDomain : domain)))

      setNewDNSRecord({ type: "A", name: "", value: "", ttl: 3600 })
    } catch (err: any) {
      setError(err.message || "Failed to add DNS record")
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading your domains...</p>
        </CardContent>
      </Card>
    )
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Login Required</h3>
          <p className="text-muted-foreground">Please log in to manage your domains.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert className="bg-red-50 border-red-200">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      {/* Domain Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Globe className="mr-2 h-5 w-5" />
            Domain Portfolio
          </CardTitle>
          <CardDescription>Manage all your .KE domains from one centralized dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          {domains.length === 0 ? (
            <div className="text-center py-8">
              <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Domains Found</h3>
              <p className="text-muted-foreground mb-4">You haven't registered any domains yet.</p>
              <Button>Search & Register Domains</Button>
            </div>
          ) : (
            <div className="space-y-4">
              {domains.map((domain) => (
                <Card
                  key={domain.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedDomain?.id === domain.id ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => setSelectedDomain(domain)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                          <h3 className="font-semibold text-lg">
                            {domain.name}
                            {domain.extension}
                          </h3>
                          <Badge
                            variant={
                              domain.status === "active"
                                ? "default"
                                : domain.status === "expiring"
                                  ? "destructive"
                                  : "secondary"
                            }
                            className="capitalize"
                          >
                            {domain.status}
                          </Badge>
                          {domain.autoRenew && (
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              Auto-renew ON
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>Registrar: {domain.registrar}</span>
                          <span>Expires: {domain.expiryDate}</span>
                          <span className={domain.daysUntilExpiry < 30 ? "text-red-600 font-medium" : ""}>
                            {domain.daysUntilExpiry} days remaining
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4 mr-1" />
                          Manage
                        </Button>
                        {domain.status === "expiring" && (
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-orange-500 to-red-500"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleRenewDomain(domain.id)
                            }}
                          >
                            <RefreshCw className="h-4 w-4 mr-1" />
                            Renew Now
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Expiry Warning */}
                    {domain.daysUntilExpiry < 30 && (
                      <Alert className="mt-3 bg-orange-50 border-orange-200">
                        <AlertTriangle className="h-4 w-4 text-orange-600" />
                        <AlertDescription className="text-orange-800">
                          <strong>Expiry Warning:</strong> This domain expires in {domain.daysUntilExpiry} days.
                          {!domain.autoRenew && " Enable auto-renew or renew manually to avoid losing your domain."}
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Domain Details */}
      {selectedDomain && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="mr-2 h-5 w-5" />
              Domain Settings: {selectedDomain.name}
              {selectedDomain.extension}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="general" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="dns">DNS Records</TabsTrigger>
                <TabsTrigger value="renewal">Renewal</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>

              {/* General Settings */}
              <TabsContent value="general" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Domain Name</Label>
                      <p className="text-lg font-semibold">
                        {selectedDomain.name}
                        {selectedDomain.extension}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Status</Label>
                      <Badge className="ml-2 capitalize">{selectedDomain.status}</Badge>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Registrar</Label>
                      <p>{selectedDomain.registrar}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Expiry Date</Label>
                      <p>{selectedDomain.expiryDate}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Days Until Expiry</Label>
                      <p className={selectedDomain.daysUntilExpiry < 30 ? "text-red-600 font-medium" : ""}>
                        {selectedDomain.daysUntilExpiry} days
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Name Servers</Label>
                      <div className="space-y-1">
                        {selectedDomain.nameServers.map((ns, index) => (
                          <p key={index} className="text-sm font-mono bg-gray-50 p-2 rounded">
                            {ns}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* DNS Records */}
              <TabsContent value="dns" className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">DNS Records</h3>
                    <Button size="sm" variant="outline">
                      <Plus className="h-4 w-4 mr-1" />
                      Add Record
                    </Button>
                  </div>

                  {/* Existing DNS Records */}
                  <div className="space-y-2">
                    {selectedDomain.dnsRecords.map((record, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="grid grid-cols-4 gap-4 flex-1">
                          <Badge variant="secondary">{record.type}</Badge>
                          <span className="font-mono text-sm">{record.name}</span>
                          <span className="font-mono text-sm">{record.value}</span>
                          <span className="text-sm text-muted-foreground">TTL: {record.ttl}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add New DNS Record */}
                  <Card className="bg-gray-50">
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-3">Add New DNS Record</h4>
                      <div className="grid grid-cols-4 gap-3">
                        <div>
                          <Label className="text-sm">Type</Label>
                          <select
                            className="w-full p-2 border rounded"
                            value={newDNSRecord.type}
                            onChange={(e) => setNewDNSRecord((prev) => ({ ...prev, type: e.target.value as any }))}
                          >
                            <option value="A">A</option>
                            <option value="CNAME">CNAME</option>
                            <option value="MX">MX</option>
                            <option value="TXT">TXT</option>
                          </select>
                        </div>
                        <div>
                          <Label className="text-sm">Name</Label>
                          <Input
                            placeholder="@, www, mail"
                            value={newDNSRecord.name}
                            onChange={(e) => setNewDNSRecord((prev) => ({ ...prev, name: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label className="text-sm">Value</Label>
                          <Input
                            placeholder="192.168.1.1"
                            value={newDNSRecord.value}
                            onChange={(e) => setNewDNSRecord((prev) => ({ ...prev, value: e.target.value }))}
                          />
                        </div>
                        <div className="flex items-end">
                          <Button onClick={handleAddDNSRecord} className="w-full">
                            Add Record
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Renewal Settings */}
              <TabsContent value="renewal" className="space-y-4">
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Auto-Renewal</h4>
                      <p className="text-sm text-muted-foreground">Automatically renew this domain before it expires</p>
                    </div>
                    <Switch
                      checked={selectedDomain.autoRenew}
                      onCheckedChange={() => handleAutoRenewToggle(selectedDomain.id)}
                    />
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Renewal Notifications</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded">
                        <div className="flex items-center space-x-3">
                          <Bell className="h-4 w-4 text-blue-500" />
                          <span>Email reminder 30 days before expiry</span>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded">
                        <div className="flex items-center space-x-3">
                          <Bell className="h-4 w-4 text-orange-500" />
                          <span>SMS reminder 7 days before expiry</span>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>

                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-5 w-5 text-blue-600" />
                        <div>
                          <h4 className="font-medium text-blue-900">Calendar Integration</h4>
                          <p className="text-sm text-blue-700">
                            Add domain expiry dates to your calendar for better tracking
                          </p>
                          <Button variant="outline" size="sm" className="mt-2 bg-white">
                            <Calendar className="h-4 w-4 mr-1" />
                            Add to Calendar
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Security Settings */}
              <TabsContent value="security" className="space-y-4">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Domain Security Features</h4>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h5 className="font-medium">Registry Lock</h5>
                        <p className="text-sm text-muted-foreground">
                          Prevent unauthorized transfers and modifications
                        </p>
                      </div>
                      <Switch />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h5 className="font-medium">Domain Watch</h5>
                        <p className="text-sm text-muted-foreground">
                          Monitor for similar domain registrations (cybersquatting protection)
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h5 className="font-medium">WHOIS Privacy</h5>
                        <p className="text-sm text-muted-foreground">
                          Hide your personal information from public WHOIS records
                        </p>
                      </div>
                      <Switch />
                    </div>
                  </div>

                  <Alert className="bg-green-50 border-green-200">
                    <Shield className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      <strong>Security Status: Good</strong> Your domain has basic security measures enabled. Consider
                      enabling Registry Lock for maximum protection.
                    </AlertDescription>
                  </Alert>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
