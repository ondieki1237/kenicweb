"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user", // Default to match schema
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { register } = useAuth()

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match!")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      await register({
        name: formData.name,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      })
      router.push("/dashboard")
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-gentle-fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-muted-foreground hover:text-primary mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center justify-center space-x-3 mb-6">
            <img src="/kenic-official-logo.png" alt="KeNIC Logo" className="h-10 w-auto" />
          </div>
          <h1 className="text-3xl font-heading-bold mb-2">Join KeNIC</h1>
          <p className="text-muted-foreground font-body">Register to manage .KE domains</p>
        </div>

        <Card className="card-glass border-0">
          <CardHeader className="space-y-2 pb-6">
            <CardTitle className="text-2xl text-center font-heading">Register</CardTitle>
            <CardDescription className="text-center font-body">
              Start your journey with Kenya's official domain registry
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleRegister} className="space-y-5">
              {error && (
                <div className="p-4 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="name" className="font-body-medium">
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                  className="h-12 bg-input/50 border-border/50 focus:bg-background transition-colors"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username" className="font-body-medium">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="johndoe"
                  value={formData.username}
                  onChange={(e) => handleInputChange("username", e.target.value)}
                  required
                  className="h-12 bg-input/50 border-border/50 focus:bg-background transition-colors"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="font-body-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john.doe@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                  className="h-12 bg-input/50 border-border/50 focus:bg-background transition-colors"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role" className="font-body-medium">
                  Role
                </Label>
                <select
                  id="role"
                  value={formData.role}
                  onChange={(e) => handleInputChange("role", e.target.value)}
                  className="w-full h-12 bg-input/50 border border-border/50 rounded-md px-3 focus:bg-background transition-colors"
                  required
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="font-body-medium">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    required
                    className="h-12 bg-input/50 border-border/50 focus:bg-background transition-colors pr-12"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="font-body-medium">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    required
                    className="h-12 bg-input/50 border-border/50 focus:bg-background transition-colors pr-12"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="terms"
                  checked={agreeToTerms}
                  onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                  className="mt-1"
                />
                <Label htmlFor="terms" className="text-sm font-body leading-relaxed">
                  I agree to the{" "}
                  <Link href="/terms" className="text-primary hover:text-primary/80 transition-colors font-body-medium">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-primary hover:text-primary/80 transition-colors font-body-medium"
                  >
                    Privacy Policy
                  </Link>
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full h-12 btn-primary font-body-medium"
                disabled={isLoading || !agreeToTerms}
              >
                {isLoading ? "Registering..." : "Register"}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground font-body">
                Already have an account?{" "}
                <Link href="/login" className="text-primary hover:text-primary/80 transition-colors font-body-medium">
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center space-y-3">
          <p className="text-sm text-muted-foreground font-body">Join 110,000+ .KE domain owners</p>
          <div className="flex justify-center space-x-6 text-sm text-muted-foreground font-body">
            <span className="flex items-center">🔒 Secure</span>
            <span className="flex items-center">🇰🇪 Official</span>
            <span className="flex items-center">⚡ Instant</span>
          </div>
        </div>
      </div>
    </div>
  )
}