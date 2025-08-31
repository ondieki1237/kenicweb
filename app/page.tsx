"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Search, Shield, Smartphone, Globe, CheckCircle, Star, Users, Building2, Menu, X, AlertTriangle, ShoppingCart, Zap } from "lucide-react"
import FlowingHeroAnimation from "@/components/flowing-hero-animation"
import Link from "next/link"
import { domainApi } from "@/lib/api"
import { useAuth } from "@/contexts/auth-context"
import BusinessAISuggestion from "@/components/business-ai-suggestion";

interface DomainResult {
  name: string
  extension: string
  available: boolean
  price: number
  registrar: string
}

interface UserDomain {
  _id: string
  domain: string
  prefix: string
  extension: string
  contact: string
  user: string
  createdAt?: string
  [key: string]: any
}

export default function HomePage() {
  const { user } = useAuth()
  const [domain, setDomain] = useState("")
  const [extension, setExtension] = useState(".co.ke")
  const [searchResults, setSearchResults] = useState<DomainResult[]>([])
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [myDomains, setMyDomains] = useState<UserDomain[]>([])
  const [domainsLoading, setDomainsLoading] = useState(false)
  const [domainsError, setDomainsError] = useState<string | null>(null)
  const router = useRouter()
  const aiSectionRef = useRef<HTMLDivElement>(null);

  const extensions = [
    { name: ".co.ke", price: 1200, description: "Commercial entities" },
    { name: ".or.ke", price: 1000, description: "Organizations" },
    { name: ".ne.ke", price: 1000, description: "Network providers" },
    { name: ".go.ke", price: 1500, description: "Government entities" },
    { name: ".me.ke", price: 1200, description: "Personal websites" },
    { name: ".mobi.ke", price: 1300, description: "Mobile websites" },
    { name: ".info.ke", price: 1100, description: "Information sites" },
    { name: ".sc.ke", price: 1400, description: "Schools" },
    { name: ".ac.ke", price: 1500, description: "Academic institutions" },
  ]

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-fade-in-up")
        }
      })
    }, observerOptions)

    const sections = document.querySelectorAll(".animate-on-scroll")
    sections.forEach((section) => observer.observe(section))

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      observer.disconnect()
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  useEffect(() => {
    if (!user?.email) return
    setDomainsLoading(true)
    setDomainsError(null)
    fetch("https://kenic-hackathon.onrender.com/my-domains", {
      method: "GET",
      headers: {
        "x-user-email": user.email,
      },
    })
      .then((res) => res.json())
      .then((data) => setMyDomains(data.domains || []))
      .catch((err) => setDomainsError("Failed to fetch your domains"))
      .finally(() => setDomainsLoading(false))
  }, [user])

  const handleSearch = async () => {
    if (!domain.trim()) {
      setError("Please enter a domain name to search.")
      return
    }
    setLoading(true)
    setSearchResults([])
    setSuggestions([])
    setError(null)

    try {
      const fullDomain = `${domain.trim()}${extension}`
      console.log("[HomePage] Searching for domain:", fullDomain)

      // Use domainApi.bulkCheck to check domain availability
      const response = await domainApi.bulkCheck([fullDomain])

      const results: DomainResult[] = response.results?.map((result: any) => {
        const extensionInfo = extensions.find((e) => e.name === extension) || { price: 1200 }
        const bestPrice = result?.bestPrice
        const numericPrice =
          typeof result?.price === "number"
            ? result.price
            : bestPrice && typeof bestPrice?.price === "number"
              ? bestPrice.price
              : extensionInfo.price
        const registrarName =
          typeof result?.registrar === "string"
            ? result.registrar
            : bestPrice && typeof bestPrice?.registrar === "string"
              ? bestPrice.registrar
              : "KeNIC"

        return {
          name: domain.trim(),
          extension,
          available: !!result.available,
          price: numericPrice,
          registrar: registrarName,
        }
      }) || []

      setSearchResults(results)

      // Fetch AI-powered suggestions
      if (user) {
        try {
          const suggestionsData = await domainApi.getAISuggestions(domain.trim(), {
            businessDescription: `Business related to ${domain}`,
            industry: "general",
            targetAudience: "general public",
          })
          const normalizedSuggestions = suggestionsData.suggestions?.map((s: any) => {
            if (typeof s === "string") return s
            if (s && typeof s === "object") return s.text || s.name || s.title || s.value || JSON.stringify(s)
            return String(s)
          }).filter(Boolean) || []
          setSuggestions(Array.from(new Set(normalizedSuggestions)).slice(0, 6) as string[])
        } catch (suggestionError) {
          console.error("[HomePage] Error fetching suggestions:", suggestionError)
          setSuggestions([
            `${domain}kenya`,
            `${domain}hub`,
            `${domain}pro`,
            `my${domain}`,
            `${domain}online`,
            `${domain}digital`,
          ].slice(0, 6))
        }
      }
    } catch (err: any) {
      setError(`❌ Error searching domain: ${err.message || "Please try again later."}`)
      console.error("[HomePage] Search error:", err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    const [name, ext] = suggestion.split(/(?=\.\w+$)/)
    setDomain(name)
    setExtension(ext || ".co.ke")
    handleSearch()
  }

  const handleRegisterDomain = (result: DomainResult) => {
    if (!user) {
      router.push("/login")
      return
    }
    // For authenticated users, redirect to dashboard or payment flow
    try {
      const fullDomain = `${result.name}${result.extension}`
      localStorage.setItem("landing_search_query", fullDomain)
      localStorage.setItem("landing_selected_extensions", JSON.stringify([result.extension]))
      router.push("/dashboard?tab=register")
    } catch {
      setError("Error redirecting to registration. Please try again.")
    }
  }

  return (
  <div className="min-h-screen bg-gradient-to-br from-crimson-50 via-red-50 to-white text-foreground transition-colors duration-300 font-sans">
      {/* Header */}
      <header
        className={`border-b border-border sticky top-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/80" : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <img src="/kenic-official-logo.png" alt="KeNIC Logo" className="h-8 w-auto md:h-10 cursor-pointer" />
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <a
              href="#features"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="Features"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="How It Works"
            >
              How It Works
            </a>
            <a
              href="#testimonials"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="Reviews"
            >
              Reviews
            </a>
            <Link href="/login">
              <Button
                variant="outline"
                size="sm"
                className="hover:bg-primary hover:text-primary-foreground transition-transform transform hover:scale-105 bg-transparent"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button
                size="sm"
                className="hover:bg-accent hover:text-accent-foreground transition-transform transform hover:scale-105"
              >
                Get Started
              </Button>
            </Link>
          </nav>

          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background">
            <nav className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              <a
                href="#features"
                className="text-muted-foreground hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-muted-foreground hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                How It Works
              </a>
              <a
                href="#testimonials"
                className="text-muted-foreground hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Reviews
              </a>
              <div className="flex flex-col space-y-2 pt-2">
                <Link href="/login">
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm" className="w-full">
                    Get Started
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section with Enhanced Search */}
  <section className="py-8 md:py-12 px-4 bg-gradient-to-br from-crimson-50 via-red-50 to-white relative overflow-hidden">
        <div className="container mx-auto text-center max-w-6xl relative z-10">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight font-serif">
            <span className="block lg:inline">Find & Register Your </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-crimson-600 to-red-600">
              Perfect .KE Domain
            </span>
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Search, secure, and manage your .KE domain with KeNIC's trusted infrastructure and local expertise.
          </p>
          <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl p-8 mb-8 shadow-2xl max-w-3xl mx-auto mt-8">
            <div className="flex flex-col space-y-4">
              {error && (
                <Alert className="bg-red-50 border-red-200">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">{error}</AlertDescription>
                </Alert>
              )}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative flex">
                  <Input
                    type="text"
                    placeholder="Enter your domain name..."
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    className="text-lg py-4 pl-4 pr-24 border-0 bg-gray-50 rounded-l-2xl focus:ring-2 focus:ring-primary flex-1"
                    aria-label="Domain search input"
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  />
                  <select
                    value={extension}
                    onChange={(e) => setExtension(e.target.value)}
                    className="absolute right-0 top-0 h-full bg-gray-100 border-l border-gray-300 text-green-600 font-medium px-3 rounded-r-2xl focus:outline-none"
                    aria-label="Select domain extension"
                  >
                    {extensions.map((ext) => (
                      <option key={ext.name} value={ext.name}>
                        {ext.name}
                      </option>
                    ))}
                  </select>
                </div>
                <Button
                  size="lg"
                  className="text-lg px-8 py-4 rounded-2xl bg-gradient-to-r from-primary to-red-600 hover:from-primary/90 hover:to-red-600/90 hover:scale-105 transition-all duration-300 shadow-lg"
                  onClick={handleSearch}
                  disabled={loading}
                  aria-label="Search .KE domains"
                >
                  <Search className="mr-2 h-5 w-5" />
                  {loading ? "Searching..." : "Search .KE Domains"}
                </Button>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {extensions.map((ext) => (
                  <Badge
                    key={ext.name}
                    variant="secondary"
                    className={`cursor-pointer hover:bg-green-600 hover:text-white transition-all duration-300 hover:scale-105 bg-white/60 backdrop-blur-sm text-green-600 border-green-200 font-medium ${
                      extension === ext.name ? "bg-green-600 text-white" : ""
                    }`}
                    onClick={() => setExtension(ext.name)}
                  >
                    {ext.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Results Section */}
          {(searchResults.length > 0 || suggestions.length > 0) && (
            <Card className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200 max-w-3xl mx-auto mt-6">
              <CardHeader>
                <CardTitle>Search Results</CardTitle>
                <CardDescription>Found {searchResults.length} results for "{domain}"</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {searchResults.map((result) => (
                    <div key={`${result.name}${result.extension}`} className="border rounded-lg p-4 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold">{result.name}{result.extension}</h3>
                        {result.available ? (
                          <Badge className="bg-green-100 text-green-800 border-green-200">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Available
                          </Badge>
                        ) : (
                          <Badge variant="destructive">
                            <X className="h-3 w-3 mr-1" />
                            Taken
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold">KSh {result.price}/year</span>
                        {result.available && (
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-primary to-red-600"
                            onClick={() => handleRegisterDomain(result)}
                          >
                            <ShoppingCart className="h-4 w-4 mr-1" />
                            Register
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <FlowingHeroAnimation />

          <div className="flex flex-wrap justify-center gap-6 text-sm mt-8">
            <div className="flex items-center bg-white/60 backdrop-blur-sm rounded-full px-4 py-2">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              <span className="font-medium">25+ Years Reliability</span>
            </div>
            <div className="flex items-center bg-white/60 backdrop-blur-sm rounded-full px-4 py-2">
              <span className="text-red-500 mr-2">⚡</span>
              <span className="font-medium">110,000+ Domains Managed</span>
            </div>
            <div className="flex items-center bg-white/60 backdrop-blur-sm rounded-full px-4 py-2">
              <span className="text-red-500 mr-2">🔒</span>
              <span className="font-medium">Official KeNIC Registry</span>
            </div>
          </div>
        </div>

  <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-crimson-200 to-red-200 rounded-full opacity-20 animate-pulse" />
        <div
          className="absolute bottom-20 right-10 w-24 h-24 bg-gradient-to-br from-green-200 to-crimson-200 rounded-full opacity-20 animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-5 w-16 h-16 bg-gradient-to-br from-crimson-200 to-pink-200 rounded-full opacity-20 animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </section>

      {/* Features Section */}
      <section
        id="features"
  className="py-12 md:py-20 px-4 bg-gradient-to-br from-crimson-50 via-red-50 to-white animate-on-scroll opacity-0 translate-y-8 transition-all duration-700"
      >
        <div className="container mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 font-serif">Why Choose KeNIC?</h2>
            <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
              Kenya's official domain registry with comprehensive .KE solutions
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                icon: <Search className="h-8 w-8 md:h-10 md:w-10 text-primary" />,
                title: "Smart Domain Search",
                desc: "Instant .KE domain availability checking with AI-powered suggestions and alternative recommendations.",
                image: "/step-1-search-domain.png",
              },
              {
                icon: <Smartphone className="h-8 w-8 md:h-10 md:w-10 text-primary" />,
                title: "M-Pesa Integration",
                desc: "Seamless payments via M-Pesa Express, Paybill, and other local payment methods.",
                image: "/m-pesa-mobile-payment.png",
              },
              {
                icon: <Shield className="h-8 w-8 md:h-10 md:w-10 text-primary" />,
                title: "KIPI Trademark Check",
                desc: "Integrated trademark verification through KIPI to prevent legal conflicts before registration.",
                image: "/trademark-verification-shield.png",
              },
              {
                icon: <Globe className="h-8 w-8 md:h-10 md:w-10 text-primary" />,
                title: "Complete Domain Management",
                desc: "Manage DNS records, renewals, and transfers from one intuitive dashboard.",
                image: "/centralized-dashboard-management.png",
              },
              {
                icon: <Building2 className="h-8 w-8 md:h-10 md:w-10 text-primary" />,
                title: "Business Resources",
                desc: "Educational guides and tools specifically designed for Kenyan entrepreneurs and businesses.",
                image: "/kenyan-business-resources.png",
              },
              {
                icon: <Users className="h-8 w-8 md:h-10 md:w-10 text-primary" />,
                title: "Local Expert Support",
                desc: "Get help from our Kenyan support team that understands your local business needs.",
                image: "/security-shield-protection.png",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="border-border hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden group"
                role="region"
                aria-labelledby={`feature-${index}`}
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={feature.image || "/placeholder.svg"}
                    alt={feature.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardHeader className="pb-2">
                  <div className="flex items-center space-x-3 mb-2">
                    {feature.icon}
                    <CardTitle id={`feature-${index}`} className="text-lg md:text-xl">
                      {feature.title}
                    </CardTitle>
                  </div>
                  <CardDescription className="text-sm md:text-base leading-relaxed">{feature.desc}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        className="py-12 md:py-20 px-4 bg-gradient-to-br from-card to-background animate-on-scroll opacity-0 translate-y-8 transition-all duration-700"
      >
        <div className="container mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 font-serif">Get Online in 3 Simple Steps</h2>
            <p className="text-base md:text-lg lg:text-xl text-muted-foreground">
              From search to launch - it's that easy
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {[
              {
                step: "1",
                title: "Search & Select",
                desc: "Use our smart search to find the perfect .KE domain for your business with instant availability checking.",
                image: "/step-1-search-domain.png",
              },
              {
                step: "2",
                title: "Register with Licensed Registrar",
                desc: "Complete your purchase securely through one of KeNIC's 103+ licensed registrars using M-Pesa or other payment methods.",
                image: "/step-2-register-with-registrar.png",
              },
              {
                step: "3",
                title: "Manage & Grow",
                desc: "Access your domain dashboard to manage DNS, set up email, and build your online presence.",
                image: "/step-3-manage-domain.png",
              },
            ].map((step, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-6">
                  <img
                    src={step.image || "/placeholder.svg"}
                    alt={step.title}
                    className="w-full max-w-sm mx-auto rounded-xl shadow-lg group-hover:shadow-xl transition-shadow duration-300"
                  />
                  <div className="absolute -top-4 -left-4 w-12 h-12 md:w-16 md:h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl md:text-2xl font-bold shadow-lg">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-lg md:text-xl lg:text-2xl font-semibold mb-3">{step.title}</h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-sm mx-auto">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        id="testimonials"
  className="py-12 md:py-20 px-4 bg-gradient-to-br from-crimson-50 via-red-50 to-white animate-on-scroll opacity-0 translate-y-8 transition-all duration-700"
      >
        <div className="container mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 font-serif">Trusted by Kenyan Businesses</h2>
            <p className="text-base md:text-lg lg:text-xl text-muted-foreground">
              Join thousands of satisfied customers across Kenya
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                name: "Jane Mwangi",
                role: "Small Business Owner, Nairobi",
                quote:
                  "Registering our .co.ke domain through KeNIC was incredibly smooth. The M-Pesa integration made payment so convenient, and we were online within hours!",
                initials: "JM",
                avatar: "/customer-avatar-sarah.png",
                company: "Mwangi Crafts",
              },
              {
                name: "David Kiprop",
                role: "Tech Startup Founder, Eldoret",
                quote:
                  "The KIPI trademark check feature saved us from potential legal issues. KeNIC's attention to local business needs is outstanding.",
                initials: "DK",
                avatar: "/customer-avatar-james.png",
                company: "AgriTech Solutions",
              },
              {
                name: "Alice Mutua",
                role: "Digital Agency Owner, Mombasa",
                quote:
                  "As an agency managing multiple client domains, KeNIC's dashboard and local support have been game-changers for our workflow.",
                initials: "AM",
                avatar: "/customer-avatar-grace.png",
                company: "Coastal Digital",
              },
            ].map((testimonial, index) => (
              <Card
                key={index}
                className="border-border hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                role="region"
                aria-labelledby={`testimonial-${index}`}
              >
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-accent text-accent" aria-hidden="true" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6 text-sm md:text-base leading-relaxed italic">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center">
                    <img
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4 object-cover"
                    />
                    <div>
                      <p className="font-semibold text-sm md:text-base" id={`testimonial-${index}`}>
                        {testimonial.name}
                      </p>
                      <p className="text-xs md:text-sm text-muted-foreground">{testimonial.role}</p>
                      <p className="text-xs text-primary font-medium">{testimonial.company}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom Feature Cards Section */}
  <section className="py-8 px-4 bg-gradient-to-br from-crimson-50 via-red-50 to-white border-t border-white/20 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                icon: "🏦",
                title: "Domains Available",
                desc: "Search 110,000+ registered .KE domains and find your perfect match",
              },
              {
                icon: "📱",
                title: "M-Pesa Ready",
                desc: "Seamless mobile payments with M-Pesa integration for all Kenyans",
              },
              {
                icon: "⏰",
                title: "Instant Registration",
                desc: "Get your .KE domain registered and active within minutes",
              },
              {
                icon: "🛡️",
                title: "KIPI Protected",
                desc: "Trademark verification through official KIPI integration",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-white/20"
              >
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trusted Agencies Section */}
  <section className="py-12 md:py-16 px-4 bg-gradient-to-br from-crimson-50 via-red-50 to-white border-y border-border animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
        <div className="container mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-xl md:text-2xl font-semibold mb-2 text-muted-foreground">
              Trusted by Leading Kenyan Organizations
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-8 items-center">
            {[
              { name: "KeNIC", logo: "/kenic-logo.png" },
              { name: "Safaricom", logo: "/logos/safaricom.png" },
              { name: "KCB Bank", logo: "/generic-bank-logo.png" },
              { name: "Equity Bank", logo: "/logos/equity-bank.png" },
              { name: "KIPI", logo: "/kipi-logo.png" },
              { name: "Nairobi Tech", logo: "/nairobi-tech-logo.png" },
            ].map((partner, index) => (
              <div
                key={index}
                className="flex items-center justify-center p-4 grayscale hover:grayscale-0 transition-all duration-300"
              >
                <img
                  src={partner.logo || "/placeholder.svg"}
                  alt={`${partner.name} logo`}
                  className="max-h-12 md:max-h-16 w-auto opacity-60 hover:opacity-100 transition-opacity"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
  <footer className="bg-gradient-to-br from-crimson-50 via-red-50 to-white border-t border-border py-10 md:py-16 px-4">
        <div className="container mx-auto">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div className="sm:col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center space-x-3 mb-4 hover:opacity-80 transition-opacity">
                <img src="/kenic-official-logo.png" alt="KeNIC Logo" className="h-6 w-auto cursor-pointer" />
                <span className="font-bold">KeNIC</span>
              </Link>
              <p className="text-muted-foreground text-sm mb-4">
                Kenya's official domain registry, empowering businesses to thrive online with trusted .KE domains.
              </p>
              <div className="flex space-x-4">
                <Badge variant="secondary" className="text-xs">
                  Official Registry
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  KIPI Verified
                </Badge>
              </div>
            </div>

            {[
              {
                title: "Product",
                links: ["Domain Search", "Domain Management", "DNS Tools", "Pricing", "API Access"],
              },
              {
                title: "Support",
                links: ["Help Center", "Contact Us", "Domain Guide", "Status Page", "Community"],
              },
              {
                title: "Company",
                links: ["About Us", "Blog", "Careers", "Privacy Policy", "Terms of Service"],
              },
            ].map((section, index) => (
              <div key={index}>
                <h3 className="font-semibold text-foreground mb-3 text-sm md:text-base">{section.title}</h3>
                <ul className="space-y-2 text-xs md:text-sm text-muted-foreground">
                  {section.links.map((link, i) => (
                    <li key={i}>
                      <a href="#" className="hover:text-primary transition-colors" aria-label={link}>
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-border mt-8 md:mt-12 pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center text-xs md:text-sm text-muted-foreground">
            <p>&copy; 2025 KeNIC. Kenya's Official Domain Registry - Powering Digital Kenya.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="hover:text-primary transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile-Optimized Sticky CTA */}
      <div className="fixed bottom-4 left-4 right-4 md:bottom-6 md:right-6 md:left-auto z-50">
        <Button
          size="lg"
          className="w-full md:w-auto text-base md:text-lg px-6 md:px-8 py-3 md:py-4 hover:scale-105 transition-transform shadow-lg bg-gradient-to-r from-primary to-crimson-600 hover:from-primary/90 hover:to-crimson-600/90"
          onClick={handleSearch}
          disabled={loading}
          aria-label="Search .KE domains"
        >
          <Search className="mr-2 h-5 w-5" />
          Find Your .KE Domain
        </Button>
      </div>

      {/* AI Domain Registration Section - New Addition */}
      <section className="max-w-3xl mx-auto my-12" ref={aiSectionRef}>
        <Card className="border-2 border-dashed border-primary/40 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-bold text-primary">
              <Zap className="h-6 w-6 text-primary" />
              Register New Domain (AI)
            </CardTitle>
            <CardDescription>
              Find and secure your next .KE domain with AI-powered business suggestions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BusinessAISuggestion
              onSelectDomain={(domain, extensions) => {
                // Prefill the domain and extension, then trigger registration flow
                setDomain(domain);
                setExtension(extensions?.[0] || ".co.ke");
                handleSearch();
              }}
              onWhoisLookup={(domain) => {
                window.open(`https://whois.kenic.or.ke/?domain=${encodeURIComponent(domain)}`, "_blank");
              }}
            />
          </CardContent>
        </Card>
      </section>

      <Button
        size="lg"
        className="mt-4 bg-gradient-to-r from-primary to-red-600 text-white shadow-lg hover:scale-105 transition-all"
        onClick={() => aiSectionRef.current?.scrollIntoView({ behavior: "smooth" })}
      >
        <Zap className="h-5 w-5 mr-2" />
        AI Suggestions
      </Button>
    </div>
  )
}