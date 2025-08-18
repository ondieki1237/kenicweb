"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Smartphone, CreditCard, Building, CheckCircle, Shield, Clock, ArrowLeft, Receipt } from "lucide-react"

interface PaymentCheckoutProps {
  domain?: string
  amount: number
  type: "registration" | "renewal" | "transfer"
  onSuccess?: () => void
  onCancel?: () => void
}

export default function PaymentCheckout({
  domain = "example.co.ke",
  amount,
  type,
  onSuccess,
  onCancel,
}: PaymentCheckoutProps) {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("mpesa")
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentComplete, setPaymentComplete] = useState(false)
  const [mpesaPhone, setMpesaPhone] = useState("+254 700 123 456")
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: "",
  })

  const paymentMethods = [
    {
      id: "mpesa",
      name: "M-Pesa",
      icon: <Smartphone className="h-5 w-5 text-green-600" />,
      description: "Pay with M-Pesa Express (STK Push)",
      popular: true,
    },
    {
      id: "card",
      name: "Credit/Debit Card",
      icon: <CreditCard className="h-5 w-5 text-blue-600" />,
      description: "Visa, Mastercard, American Express",
      popular: false,
    },
    {
      id: "bank",
      name: "Bank Transfer",
      icon: <Building className="h-5 w-5 text-purple-600" />,
      description: "Direct bank transfer",
      popular: false,
    },
  ]

  const handlePayment = async () => {
    setIsProcessing(true)

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 3000))

    setIsProcessing(false)
    setPaymentComplete(true)

    // Call success callback after a short delay
    setTimeout(() => {
      onSuccess?.()
    }, 2000)
  }

  if (paymentComplete) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="p-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Payment Successful!</h3>
          <p className="text-muted-foreground mb-4">Your payment for {domain} has been processed successfully.</p>
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="flex justify-between text-sm">
              <span>Domain:</span>
              <span className="font-medium">{domain}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Amount:</span>
              <span className="font-medium">KSh {amount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Transaction ID:</span>
              <span className="font-medium">TXN{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
            </div>
          </div>
          <Button className="w-full mb-2">
            <Receipt className="h-4 w-4 mr-2" />
            Download Receipt
          </Button>
          <Button variant="outline" className="w-full bg-transparent" onClick={onSuccess}>
            Continue to Dashboard
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5 text-green-600" />
                Secure Checkout
              </CardTitle>
              <CardDescription>
                Complete your {type} for {domain}
              </CardDescription>
            </div>
            {onCancel && (
              <Button variant="ghost" size="sm" onClick={onCancel}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium">{domain}</h4>
                <p className="text-sm text-muted-foreground capitalize">{type} - 1 year</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">KSh {amount.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">per year</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle>Choose Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 mb-6">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedPaymentMethod === method.id
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setSelectedPaymentMethod(method.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {method.icon}
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">{method.name}</h4>
                        {method.popular && <Badge className="bg-green-100 text-green-800 text-xs">Most Popular</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground">{method.description}</p>
                    </div>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border-2 ${
                      selectedPaymentMethod === method.id ? "border-primary bg-primary" : "border-gray-300"
                    }`}
                  >
                    {selectedPaymentMethod === method.id && (
                      <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Payment Details */}
          <Tabs value={selectedPaymentMethod} className="space-y-4">
            {/* M-Pesa Payment */}
            <TabsContent value="mpesa" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="mpesa-phone">M-Pesa Phone Number</Label>
                  <div className="relative">
                    <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="mpesa-phone"
                      value={mpesaPhone}
                      onChange={(e) => setMpesaPhone(e.target.value)}
                      placeholder="+254 700 000 000"
                      className="pl-10"
                    />
                  </div>
                </div>

                <Alert className="bg-green-50 border-green-200">
                  <Smartphone className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    <strong>M-Pesa Express:</strong> You'll receive an STK push notification on your phone to complete
                    the payment.
                  </AlertDescription>
                </Alert>

                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <h4 className="font-medium text-sm">Payment Steps:</h4>
                  <ol className="text-sm text-muted-foreground space-y-1">
                    <li>1. Click "Pay with M-Pesa" below</li>
                    <li>2. Check your phone for STK push notification</li>
                    <li>3. Enter your M-Pesa PIN to complete payment</li>
                    <li>4. Receive confirmation SMS and email receipt</li>
                  </ol>
                </div>
              </div>
            </TabsContent>

            {/* Card Payment */}
            <TabsContent value="card" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="card-number">Card Number</Label>
                  <Input
                    id="card-number"
                    placeholder="1234 5678 9012 3456"
                    value={cardDetails.number}
                    onChange={(e) => setCardDetails((prev) => ({ ...prev, number: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="card-expiry">Expiry Date</Label>
                  <Input
                    id="card-expiry"
                    placeholder="MM/YY"
                    value={cardDetails.expiry}
                    onChange={(e) => setCardDetails((prev) => ({ ...prev, expiry: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="card-cvv">CVV</Label>
                  <Input
                    id="card-cvv"
                    placeholder="123"
                    value={cardDetails.cvv}
                    onChange={(e) => setCardDetails((prev) => ({ ...prev, cvv: e.target.value }))}
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="card-name">Cardholder Name</Label>
                  <Input
                    id="card-name"
                    placeholder="John Doe"
                    value={cardDetails.name}
                    onChange={(e) => setCardDetails((prev) => ({ ...prev, name: e.target.value }))}
                  />
                </div>
              </div>
            </TabsContent>

            {/* Bank Transfer */}
            <TabsContent value="bank" className="space-y-4">
              <Alert className="bg-blue-50 border-blue-200">
                <Building className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  <strong>Bank Transfer Details:</strong> Use the following details to complete your payment.
                </AlertDescription>
              </Alert>

              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Bank:</span>
                    <p className="font-medium">KCB Bank Kenya</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Account Name:</span>
                    <p className="font-medium">KeNIC Registry</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Account Number:</span>
                    <p className="font-medium">1234567890</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Reference:</span>
                    <p className="font-medium">{domain.toUpperCase()}</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Payment Button */}
          <div className="pt-6 border-t">
            <Button
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full h-12 text-lg bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90"
            >
              {isProcessing ? (
                <>
                  <Clock className="mr-2 h-5 w-5 animate-spin" />
                  Processing Payment...
                </>
              ) : (
                <>
                  {selectedPaymentMethod === "mpesa" && <Smartphone className="mr-2 h-5 w-5" />}
                  {selectedPaymentMethod === "card" && <CreditCard className="mr-2 h-5 w-5" />}
                  {selectedPaymentMethod === "bank" && <Building className="mr-2 h-5 w-5" />}
                  Pay KSh {amount.toLocaleString()}
                </>
              )}
            </Button>

            <div className="flex items-center justify-center space-x-4 mt-4 text-xs text-muted-foreground">
              <div className="flex items-center">
                <Shield className="h-3 w-3 mr-1" />
                SSL Secured
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-3 w-3 mr-1" />
                PCI Compliant
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Processing State */}
      {isProcessing && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="h-8 w-8 text-blue-600 animate-spin" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Processing Payment</h3>
            <p className="text-muted-foreground">
              {selectedPaymentMethod === "mpesa"
                ? "Please check your phone for the M-Pesa STK push notification and enter your PIN."
                : "Please wait while we process your payment securely."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
