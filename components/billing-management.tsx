"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Receipt,
  Download,
  Eye,
  CreditCard,
  Smartphone,
  Calendar,
  AlertTriangle,
  RefreshCw,
  Plus,
  Trash2,
} from "lucide-react"

interface Invoice {
  id: string
  date: string
  domain: string
  description: string
  amount: number
  status: "paid" | "pending" | "overdue"
  paymentMethod: string
  downloadUrl?: string
}

interface PaymentMethod {
  id: string
  type: "mpesa" | "card" | "bank"
  name: string
  details: string
  isDefault: boolean
  expiryDate?: string
}

export default function BillingManagement() {
  const [activeTab, setActiveTab] = useState("overview")

  // Mock data
  const invoices: Invoice[] = [
    {
      id: "INV-2025-001",
      date: "2025-01-15",
      domain: "mybusiness.co.ke",
      description: "Domain Registration - 1 year",
      amount: 1200,
      status: "paid",
      paymentMethod: "M-Pesa",
      downloadUrl: "#",
    },
    {
      id: "INV-2025-002",
      date: "2025-01-10",
      domain: "myshop.or.ke",
      description: "Domain Renewal - 1 year",
      amount: 1000,
      status: "paid",
      paymentMethod: "Visa Card",
      downloadUrl: "#",
    },
    {
      id: "INV-2025-003",
      date: "2025-01-05",
      domain: "portfolio.me.ke",
      description: "Domain Registration - 1 year",
      amount: 1200,
      status: "pending",
      paymentMethod: "Bank Transfer",
    },
  ]

  const paymentMethods: PaymentMethod[] = [
    {
      id: "1",
      type: "mpesa",
      name: "M-Pesa",
      details: "+254 700 *** 456",
      isDefault: true,
    },
    {
      id: "2",
      type: "card",
      name: "Visa Card",
      details: "**** **** **** 1234",
      isDefault: false,
      expiryDate: "12/26",
    },
    {
      id: "3",
      type: "bank",
      name: "KCB Bank",
      details: "Account ending in 7890",
      isDefault: false,
    },
  ]

  const upcomingPayments = [
    {
      domain: "mybusiness.co.ke",
      amount: 1200,
      dueDate: "2025-12-15",
      daysUntilDue: 120,
      autoRenew: true,
    },
    {
      domain: "myshop.or.ke",
      amount: 1000,
      dueDate: "2025-02-28",
      daysUntilDue: 15,
      autoRenew: false,
    },
  ]

  const billingStats = {
    totalSpent: 3400,
    monthlyAverage: 850,
    nextPayment: 1000,
    nextPaymentDate: "2025-02-28",
  }

  return (
    <div className="space-y-6">
      {/* Billing Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Spent</p>
                <p className="text-2xl font-bold">KSh {billingStats.totalSpent.toLocaleString()}</p>
              </div>
              <Receipt className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Monthly Average</p>
                <p className="text-2xl font-bold">KSh {billingStats.monthlyAverage.toLocaleString()}</p>
              </div>
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Next Payment</p>
                <p className="text-2xl font-bold">KSh {billingStats.nextPayment.toLocaleString()}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Due Date</p>
                <p className="text-lg font-bold">{billingStats.nextPaymentDate}</p>
              </div>
              <Calendar className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Billing Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="payments">Payment Methods</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Invoices */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Receipt className="mr-2 h-5 w-5" />
                  Recent Invoices
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {invoices.slice(0, 3).map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{invoice.domain}</p>
                        <p className="text-sm text-muted-foreground">{invoice.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">KSh {invoice.amount.toLocaleString()}</p>
                        <Badge
                          variant={
                            invoice.status === "paid"
                              ? "default"
                              : invoice.status === "pending"
                                ? "secondary"
                                : "destructive"
                          }
                          className="capitalize"
                        >
                          {invoice.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  className="w-full mt-4 bg-transparent"
                  onClick={() => setActiveTab("invoices")}
                >
                  View All Invoices
                </Button>
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="mr-2 h-5 w-5" />
                  Payment Methods
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {paymentMethods.slice(0, 2).map((method) => (
                    <div key={method.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        {method.type === "mpesa" && <Smartphone className="h-5 w-5 text-green-600" />}
                        {method.type === "card" && <CreditCard className="h-5 w-5 text-blue-600" />}
                        {method.type === "bank" && <Receipt className="h-5 w-5 text-purple-600" />}
                        <div>
                          <p className="font-medium">{method.name}</p>
                          <p className="text-sm text-muted-foreground">{method.details}</p>
                        </div>
                      </div>
                      {method.isDefault && <Badge className="bg-green-100 text-green-800">Default</Badge>}
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  className="w-full mt-4 bg-transparent"
                  onClick={() => setActiveTab("payments")}
                >
                  Manage Payment Methods
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Payments Alert */}
          <Alert className="bg-orange-50 border-orange-200">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <strong>Upcoming Payment:</strong> myshop.or.ke expires in 15 days.
              <Button variant="link" className="p-0 h-auto text-orange-800 underline ml-1">
                Renew now
              </Button>
            </AlertDescription>
          </Alert>
        </TabsContent>

        {/* Invoices Tab */}
        <TabsContent value="invoices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Invoice History</CardTitle>
              <CardDescription>View and download all your invoices and receipts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {invoices.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="font-medium">{invoice.id}</p>
                          <p className="text-sm text-muted-foreground">{invoice.date}</p>
                        </div>
                        <div>
                          <p className="font-medium">{invoice.domain}</p>
                          <p className="text-sm text-muted-foreground">{invoice.description}</p>
                        </div>
                        <div>
                          <p className="font-semibold">KSh {invoice.amount.toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground">{invoice.paymentMethod}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={
                          invoice.status === "paid"
                            ? "default"
                            : invoice.status === "pending"
                              ? "secondary"
                              : "destructive"
                        }
                        className="capitalize"
                      >
                        {invoice.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      {invoice.downloadUrl && (
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Methods Tab */}
        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Payment Methods</CardTitle>
                  <CardDescription>Manage your payment methods for domain purchases and renewals</CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Payment Method
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <Card key={method.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          {method.type === "mpesa" && <Smartphone className="h-6 w-6 text-green-600" />}
                          {method.type === "card" && <CreditCard className="h-6 w-6 text-blue-600" />}
                          {method.type === "bank" && <Receipt className="h-6 w-6 text-purple-600" />}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium">{method.name}</h4>
                            {method.isDefault && <Badge className="bg-green-100 text-green-800">Default</Badge>}
                          </div>
                          <p className="text-sm text-muted-foreground">{method.details}</p>
                          {method.expiryDate && (
                            <p className="text-xs text-muted-foreground">Expires: {method.expiryDate}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {!method.isDefault && (
                          <Button variant="outline" size="sm">
                            Set as Default
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Upcoming Payments Tab */}
        <TabsContent value="upcoming" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Payments</CardTitle>
              <CardDescription>Manage your upcoming domain renewals and payments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingPayments.map((payment, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <h4 className="font-medium">{payment.domain}</h4>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>Due: {payment.dueDate}</span>
                          <span className={payment.daysUntilDue < 30 ? "text-red-600 font-medium" : ""}>
                            {payment.daysUntilDue} days remaining
                          </span>
                          <Badge variant={payment.autoRenew ? "default" : "secondary"}>
                            {payment.autoRenew ? "Auto-renew ON" : "Auto-renew OFF"}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="font-semibold">KSh {payment.amount.toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground">per year</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <RefreshCw className="h-4 w-4 mr-1" />
                            Renew Now
                          </Button>
                          {!payment.autoRenew && <Button size="sm">Enable Auto-renew</Button>}
                        </div>
                      </div>
                    </div>

                    {payment.daysUntilDue < 30 && (
                      <Alert className="mt-3 bg-orange-50 border-orange-200">
                        <AlertTriangle className="h-4 w-4 text-orange-600" />
                        <AlertDescription className="text-orange-800">
                          <strong>Expiring Soon:</strong> This domain expires in {payment.daysUntilDue} days. Renew now
                          to avoid service interruption.
                        </AlertDescription>
                      </Alert>
                    )}
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
