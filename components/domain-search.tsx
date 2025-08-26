"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Search, Shield, AlertTriangle, CheckCircle, X, Lightbulb, Globe, Eye, ShoppingCart, Zap } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import PaymentCheckout from "./payment-checkout"
import { domainApi } from "@/lib/api"
import { useAuth } from "@/contexts/auth-context"

// Fallback for motion.div
const MotionDiv = motion.div

// Interface for DomainResult
interface DomainResult {
  name: string
  extension: string
  available: boolean
  price: number
  registrar: string
  trademarkConflict?: boolean
  similarDomains?: string[]
  aiSuggestion?: boolean
}

// Reusable Header Component
const SearchHeader = () => (
<div className="text-center mb-6">
  <p className="text-sm text-gray-500 font-light">
    Harness AI-driven insights to secure the ideal domain with trademark protection
  </p>
</div>

)

// Reusable Extension Selector Component
const ExtensionSelector = ({
  extensions,
  selectedExtensions,
  toggleExtension,
  user,
}: {
  extensions: { name: string; price: number; description: string }[]
  selectedExtensions: string[]
  toggleExtension: (ext: string) => void
  user: any
}) => (
  <div className="space-y-4">
    <div className="flex items-center gap-2">
      <Search className="h-5 w-5 text-primary" />
      <h4 className="font-semibold text-foreground">Select .KE Extensions</h4>
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
      {extensions.map((ext) => (
        <Button
          key={ext.name}
          variant={selectedExtensions.includes(ext.name) ? "default" : "outline"}
          size="lg"
          onClick={() => toggleExtension(ext.name)}
          className={`justify-between transition-all duration-300 py-3 px-4 rounded-[var(--radius)] ${
            selectedExtensions.includes(ext.name)
              ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 scale-105"
              : "border-border hover:bg-accent hover:border-accent hover:shadow-md"
          }`}
          disabled={!user}
        >
          <div className="flex flex-col items-start">
            <span className="font-semibold">{ext.name}</span>
            <span className="text-xs opacity-80">KSh {ext.price}</span>
          </div>
        </Button>
      ))}
    </div>
  </div>
)

// Reusable Domain Result Component
const DomainResultCard = ({
  result,
  handleRegisterDomain,
  handleWhoisLookup,
  user,
}: {
  result: DomainResult
  handleRegisterDomain: (domain: DomainResult) => void
  handleWhoisLookup: (domain: string) => void
  user: any
}) => (
  <MotionDiv
    initial={motion?.div ? { opacity: 0, y: 20 } : undefined}
    animate={motion?.div ? { opacity: 1, y: 0 } : undefined}
    transition={motion?.div ? { duration: 0.3 } : undefined}
    className="group border border-border rounded-[var(--radius)] p-6 space-y-4 bg-card hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1"
  >
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-center space-x-4">
        <div className="flex flex-col">
          <h3 className="font-bold text-xl text-foreground group-hover:text-primary transition-colors">
            {result.name}
            <span className="text-primary">{result.extension}</span>
          </h3>
          <div className="flex items-center gap-2 mt-2">
            {result.available ? (
              <Badge className="bg-chart-4 text-foreground border-chart-4 font-medium">
                <CheckCircle className="h-3 w-3 mr-1" />
                Available
              </Badge>
            ) : (
              <Badge variant="destructive" className="font-medium">
                <X className="h-3 w-3 mr-1" />
                Taken
              </Badge>
            )}
            {result.aiSuggestion && (
              <Badge className="bg-accent text-accent-foreground border-accent font-medium">
                <Zap className="h-3 w-3 mr-1" />
                AI Suggested
              </Badge>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="text-right">
          <span className="font-bold text-2xl text-foreground">KSh {result.price}</span>
          <p className="text-sm text-muted-foreground">/year</p>
        </div>
        <div className="flex flex-col gap-2">
          {result.available && (
            <Button
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300 rounded-[var(--radius)]"
              onClick={() => handleRegisterDomain(result)}
              disabled={!user}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Register Now
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleWhoisLookup(`${result.name}${result.extension}`)}
            disabled={!user}
            className="hover:bg-accent hover:border-accent rounded-[var(--radius)]"
          >
            <Eye className="h-4 w-4 mr-2" />
            WHOIS
          </Button>
        </div>
      </div>
    </div>
    {result.trademarkConflict && (
      <Alert className="bg-destructive/10 border-destructive rounded-[var(--radius)]">
        <AlertTriangle className="h-4 w-4 text-destructive" />
        <AlertDescription className="text-destructive font-medium">
          <strong>Trademark Conflict Detected:</strong> This domain may conflict with registered trademarks. Consider
          alternative names to avoid legal issues.
        </AlertDescription>
      </Alert>
    )}
    {result.similarDomains && result.similarDomains.length > 0 && (
      <Alert className="bg-chart-5/10 border-chart-5 rounded-[var(--radius)]">
        <AlertTriangle className="h-4 w-4 text-chart-5" />
        <AlertDescription className="text-chart-5 font-medium">
          <strong>Similar Domain Warning:</strong> Similar to existing domains: {result.similarDomains.join(", ")}.
        </AlertDescription>
      </Alert>
    )}
    {!result.available && (
      <div className="text-sm text-muted-foreground bg-muted p-3 rounded-[var(--radius)]">
        <strong>Registered through:</strong> {result.registrar}
      </div>
    )}
  </MotionDiv>
)

// Reusable WHOIS Modal Component
const WhoisModal = ({ whoisData, setShowWhois }: { whoisData: any; setShowWhois: (show: boolean) => void }) => (
  <>
    <MotionDiv
      initial={motion?.div ? { opacity: 0, scale: 0.95 } : undefined}
      animate={motion?.div ? { opacity: 1, scale: 1 } : undefined}
      exit={motion?.div ? { opacity: 0, scale: 0.95 } : undefined}
      transition={motion?.div ? { duration: 0.3 } : undefined}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <Card className="w-full max-w-2xl bg-card shadow-2xl border border-border rounded-[var(--radius)] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-accent to-background border-b p-6">
          <CardTitle className="flex items-center text-xl font-bold text-foreground">
            <Globe className="mr-3 h-6 w-6 text-primary" />
            WHOIS Information
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setShowWhois(false)} className="hover:bg-accent">
            <X className="h-5 w-5 text-foreground" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6 p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Domain</h4>
              <p className="font-bold text-lg text-foreground">{whoisData.domain}</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Status</h4>
              <Badge className="bg-chart-4 text-foreground font-medium">{whoisData.status}</Badge>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Registrar</h4>
              <p className="text-foreground font-medium">{whoisData.registrar}</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Registrant</h4>
              <p className="text-foreground font-medium">{whoisData.registrant}</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Registration Date</h4>
              <p className="text-foreground font-medium">{whoisData.registrationDate}</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Expiry Date</h4>
              <p className="text-foreground font-medium">{whoisData.expiryDate}</p>
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Name Servers</h4>
            <div className="space-y-2">
              {Array.isArray(whoisData.nameServers) ? (
                whoisData.nameServers.map((ns: any, index: number) => (
                  <p
                    key={`ns-${index}-${String(ns).slice(0, 10)}`}
                    className="text-sm font-mono bg-muted p-3 rounded-[var(--radius)] text-foreground border border-border"
                  >
                    {String(ns)}
                  </p>
                ))
              ) : (
                <p className="text-sm font-mono bg-muted p-3 rounded-[var(--radius)] text-foreground border border-border">
                  {String(whoisData.nameServers)}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </MotionDiv>
    <div className="fixed inset-0 bg-black bg-opacity-60 z-40 backdrop-blur-sm" onClick={() => setShowWhois(false)} />
  </>
)

export default function DomainSearch() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedExtensions, setSelectedExtensions] = useState([".co.ke"])
  const [searchResults, setSearchResults] = useState<DomainResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([])
  const [businessDescription, setBusinessDescription] = useState("")
  const [bizSuggestions, setBizSuggestions] = useState<any[]>([])
  const [isBizLoading, setIsBizLoading] = useState(false)
  const [whoisData, setWhoisData] = useState<any>(null)
  const [showWhois, setShowWhois] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)
  const [selectedDomain, setSelectedDomain] = useState<DomainResult | null>(null)
  const [error, setError] = useState<string | null>(null)

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
  const allKeExtensions = extensions.map((e) => e.name)

  const generateAISuggestions = async (query: string) => {
    if (!query || !user) return []
    try {
      const response = await domainApi.getAISuggestions(query, {
        businessDescription: `Business related to ${query}`,
        industry: "general",
        targetAudience: "general public",
      })
      const suggestions = response.suggestions || []
      const normalize = (s: any) => {
        if (typeof s === "string") return s
        if (s && typeof s === "object") return s.text || s.name || s.title || s.value || JSON.stringify(s)
        return String(s)
      }
      return suggestions.map(normalize).filter(Boolean)
    } catch (error) {
      console.error("Failed to get AI suggestions:", error)
      const suggestions = [
        `${query}kenya`,
        `${query}hub`,
        `${query}pro`,
        `my${query}`,
        `${query}online`,
        `${query}digital`,
      ]
      return suggestions.slice(0, 6)
    }
  }

  const checkTrademarkConflict = (domain: string): boolean => {
    const conflictKeywords = ["safaricom", "equity", "kcb", "mpesa", "kenya", "government"]
    return conflictKeywords.some((keyword) => domain.toLowerCase().includes(keyword))
  }

  const detectSimilarDomains = (domain: string): string[] => {
    const popularDomains = ["safaricom.co.ke", "equity.co.ke", "kcb.co.ke", "kenya.go.ke"]
    const similar = []
    for (const popular of popularDomains) {
      const popularName = popular.split(".")[0]
      if (domain.includes(popularName) || popularName.includes(domain)) {
        similar.push(popular)
      }
    }
    return similar
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    if (!user) {
      setError("Please log in to search domains")
      return
    }
    setIsSearching(true)
    setSearchResults([])
    setError(null)
    try {
      const suggestions = await generateAISuggestions(searchQuery)
      const uniqueSuggestions = Array.from(new Set(suggestions))
      setAiSuggestions(uniqueSuggestions)
      const domainsToCheck = selectedExtensions.map((ext) => `${searchQuery}${ext}`)
      console.log("Domains to check:", domainsToCheck) // Debug: Log domains being checked
      const response = await domainApi.bulkCheck(domainsToCheck)
      console.log("API Response:", response.results) // Debug: Log API response
      const seenDomains = new Set<string>()
      const results: DomainResult[] =
        response.results?.reduce((acc: DomainResult[], result: any) => {
          const extension = selectedExtensions.find((ext) => result.domain.endsWith(ext)) || ".co.ke"
          const domainKey = `${searchQuery}${extension}`
          if (seenDomains.has(domainKey)) {
            console.warn(`Duplicate domain detected: ${domainKey}`) // Debug: Log duplicates
            return acc
          }
          seenDomains.add(domainKey)
          const extensionInfo = extensions.find((e) => e.name === extension)
          const trademarkConflict = checkTrademarkConflict(searchQuery)
          const similarDomains = detectSimilarDomains(searchQuery)
          const bestPrice = result?.bestPrice
          const numericPrice =
            typeof result?.price === "number"
              ? result.price
              : bestPrice && typeof bestPrice?.price === "number"
                ? bestPrice.price
                : extensionInfo?.price || 1200
          const registrarName =
            typeof result?.registrar === "string"
              ? result.registrar
              : bestPrice && typeof bestPrice?.registrar === "string"
                ? bestPrice.registrar
                : "KeNIC"
          acc.push({
            name: searchQuery,
            extension: extension,
            available: !!result.available,
            price: numericPrice,
            registrar: registrarName,
            trademarkConflict,
            similarDomains: similarDomains.length > 0 ? similarDomains : undefined,
            aiSuggestion: uniqueSuggestions.includes(`${searchQuery}${extension}`),
          })
          return acc
        }, []) || []
      setSearchResults(results)
      if (results.length === 0) {
        setError("No results found for the selected domains.")
      }
    } catch (error: any) {
      console.error("Domain search failed:", error)
      setError(error.message || "Failed to search domains. Please try again.")
    } finally {
      setIsSearching(false)
    }
  }

  const handleBusinessAISearch = async () => {
    if (!businessDescription.trim()) return
    if (!user) {
      setError("Please log in to get AI suggestions")
      return
    }
    try {
      setIsBizLoading(true)
      setBizSuggestions([])
      const response = await domainApi.getAISuggestionsFromBusiness(businessDescription)
      const list = Array.isArray(response?.suggestions) ? response.suggestions : []
      const normalized = list.map((s: any) => {
        const raw = typeof s?.domain === "string" ? s.domain : String(s?.domain || "")
        const cleaned = raw.replace(/^\s*\d+\.?\s+/g, "").trim()
        return {
          domain: cleaned,
          available: !!s.available,
          bestPrice: s?.bestPrice || null,
          pricing: Array.isArray(s?.pricing) ? s.pricing : [],
          aiSuggestion: true,
        }
      })
      setBizSuggestions(normalized)
    } catch (e: any) {
      console.error("Business AI suggestion failed", e)
      setError(e?.message || "Failed to fetch AI suggestions")
    } finally {
      setIsBizLoading(false)
    }
  }

  useEffect(() => {
    try {
      const lsQuery = localStorage.getItem("landing_search_query")
      const lsExts = localStorage.getItem("landing_selected_extensions")
      if (lsQuery) {
        setSearchQuery(lsQuery)
        localStorage.removeItem("landing_search_query")
      }
      if (lsExts) {
        const parsed = JSON.parse(lsExts)
        if (Array.isArray(parsed) && parsed.length > 0) setSelectedExtensions(parsed)
        localStorage.removeItem("landing_selected_extensions")
      }
      setTimeout(() => {
        if (user && (lsQuery || searchQuery)) {
          handleSearch()
        }
      }, 0)
    } catch {}
  }, [user])

  const handleWhoisLookup = async (domain: string) => {
    if (!user) {
      setError("Please log in to view WHOIS information")
      return
    }
    try {
      setShowWhois(true)
      const response = await domainApi.getWhois(domain)
      setWhoisData({
        domain: response.domain || domain,
        status: response.available ? "Available" : "Registered",
        registrar: response.whoisData?.registrar || response.registrar || "Unknown",
        registrant: response.whoisData?.registrant || "Private",
        registrationDate: response.whoisData?.registrationDate || "N/A",
        expiryDate: response.whoisData?.expiryDate || "N/A",
        nameServers: response.whoisData?.nameServers || ["N/A"],
      })
    } catch (error: any) {
      console.error("WHOIS lookup failed:", error)
      setError(error.message || "Failed to get WHOIS information")
      setShowWhois(false)
    }
  }

  const handleRegisterDomain = (domain: DomainResult) => {
    if (!user) {
      setError("Please log in to register domains")
      return
    }
    setSelectedDomain(domain)
    setShowCheckout(true)
  }

  const toggleExtension = (ext: string) => {
    setSelectedExtensions((prev) => (prev.includes(ext) ? prev.filter((e) => e !== ext) : [...prev, ext]))
  }

  if (showCheckout && selectedDomain) {
    return (
      <PaymentCheckout
        domain={`${selectedDomain.name}${selectedDomain.extension}`}
        amount={selectedDomain.price}
        type="registration"
        onSuccess={() => {
          setShowCheckout(false)
          setSelectedDomain(null)
        }}
        onCancel={() => {
          setShowCheckout(false)
          setSelectedDomain(null)
        }}
      />
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-16 px-4 sm:px-6 lg:px-8 space-y-12">
        <SearchHeader />

        {/* Alerts */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Alert className="bg-destructive/10 border-destructive rounded-[var(--radius)] shadow-sm">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <AlertDescription className="text-destructive font-medium">{error}</AlertDescription>
              </Alert>
            </motion.div>
          )}
          {!user && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Alert className="bg-accent border-accent rounded-[var(--radius)] shadow-sm">
                <Shield className="h-5 w-5 text-primary" />
                <AlertDescription className="text-accent-foreground font-medium">
                  <strong>Login Required:</strong> Sign in to access AI-powered domain search and registration.
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Search Card */}
        <Card className="shadow-xl border-border rounded-[var(--radius)] overflow-hidden bg-card/90 backdrop-blur-sm">
          {/* <CardHeader className="bg-gradient-to-r from-primary to-secondary text-primary-foreground p-8">
            <CardTitle className="flex items-center text-3xl font-bold">
              <Search className="mr-3 h-8 w-8" />
              AI-Powered Domain Search
            </CardTitle>
            <CardDescription className="text-primary-foreground/80 text-lg">
              Discover the ideal .KE domain with intelligent AI suggestions and KIPI trademark protection
            </CardDescription>
          </CardHeader> */}
          <CardContent className="space-y-8 p-8">
            {/* AI Business Description Search */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent rounded-[var(--radius)]">
                  <Lightbulb className="h-5 w-5 text-primary" />
                </div>
                <h4 className="font-bold text-lg text-foreground">AI-Driven Domain Suggestions</h4>
              </div>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                <Input
                  placeholder="Describe your business (e.g., Fresh farm produce supplier)"
                  value={businessDescription}
                  onChange={(e) => setBusinessDescription(e.target.value)}
                  className="flex-1 text-base border-input focus:ring-ring focus:border-primary rounded-[var(--radius)] h-12"
                  disabled={!user}
                />
                <Button
                  onClick={handleBusinessAISearch}
                  disabled={!businessDescription.trim() || isBizLoading || !user}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300 h-12 px-6 rounded-[var(--radius)]"
                >
                  {isBizLoading ? (
                    <>
                      <Zap className="h-5 w-5 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Lightbulb className="h-5 w-5 mr-2" />
                      Generate Suggestions
                    </>
                  )}
                </Button>
              </div>
              <AnimatePresence>
                {bizSuggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                  >
                    {bizSuggestions.map((s, idx) => {
                      const price =
                        typeof s?.bestPrice?.price === "number" ? s.bestPrice.price : s?.pricing?.[0]?.price || null
                      const registrar = s?.bestPrice?.registrar || s?.pricing?.[0]?.registrar || "KeNIC"
                      return (
                        <div
                          key={`biz-${idx}-${s.domain}`}
                          className="border border-border rounded-[var(--radius)] p-4 flex items-center justify-between bg-card shadow-sm hover:shadow-md transition-all duration-300"
                        >
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="font-semibold text-foreground">{s.domain}</h3>
                              {s.available ? (
                                <Badge className="bg-chart-4 text-foreground border-chart-4 font-medium">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Available
                                </Badge>
                              ) : (
                                <Badge variant="destructive" className="font-medium">
                                  <X className="h-3 w-3 mr-1" />
                                  Taken
                                </Badge>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                              {price ? `KSh ${price} @ ${registrar}` : "Pricing unavailable"}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {s.available && (
                              <Button
                                size="sm"
                                className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg rounded-[var(--radius)]"
                                onClick={() => {
                                  const domainLower = String(s.domain || "").toLowerCase().trim()
                                  let base = domainLower
                                  for (const ext of [...allKeExtensions, ".ke"]) {
                                    if (domainLower.endsWith(ext)) {
                                      base = domainLower.slice(0, -ext.length)
                                      break
                                    }
                                  }
                                  base = base.replace(/^\s*\d+\.?\s+/, "").replace(/\.$/, "").trim()
                                  setSearchQuery(base)
                                  setSelectedExtensions(allKeExtensions)
                                  handleSearch()
                                }}
                              >
                                <ShoppingCart className="h-4 w-4 mr-1" />
                                Use
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleWhoisLookup(s.domain)}
                              className="hover:bg-accent hover:border-accent rounded-[var(--radius)]"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              WHOIS
                            </Button>
                          </div>
                        </div>
                      )
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Domain Search Input */}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              <Input
                placeholder="Enter domain name (e.g., mybusiness)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 text-base border-input focus:ring-ring focus:border-primary rounded-[var(--radius)] h-12"
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                disabled={!user}
              />
              <Button
                onClick={handleSearch}
                disabled={!searchQuery.trim() || isSearching || !user}
                className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300 h-12 px-8 rounded-[var(--radius)]"
              >
                {isSearching ? (
                  <>
                    <Zap className="h-5 w-5 mr-2 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="h-5 w-5 mr-2" />
                    Search Domains
                  </>
                )}
              </Button>
            </div>

            {/* Extension Selector */}
            <ExtensionSelector
              extensions={extensions}
              selectedExtensions={selectedExtensions}
              toggleExtension={toggleExtension}
              user={user}
            />

            {/* KIPI Protection Alert */}
            <Alert className="bg-accent border-accent rounded-[var(--radius)] shadow-sm">
              <Shield className="h-5 w-5 text-primary" />
              <AlertDescription className="text-accent-foreground font-medium">
                <strong>AI-Enhanced Protection:</strong> All searches are screened for trademark conflicts via the Kenya
                Industrial Property Institute (KIPI) database.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <Card className="shadow-xl border-border rounded-[var(--radius)] overflow-hidden bg-card/90 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-primary to-secondary text-primary-foreground p-8">
              <CardTitle className="text-3xl font-bold">Search Results</CardTitle>
              <CardDescription className="text-primary-foreground/80 text-lg">
                Found {searchResults.length} results for "{searchQuery}"
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-6">
                {searchResults.map((result, index) => (
                  <DomainResultCard
                    key={`${result.name}${result.extension}-${index}`}
                    result={result}
                    handleRegisterDomain={handleRegisterDomain}
                    handleWhoisLookup={handleWhoisLookup}
                    user={user}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* WHOIS Modal */}
        <AnimatePresence>
          {showWhois && whoisData && <WhoisModal whoisData={whoisData} setShowWhois={setShowWhois} />}
        </AnimatePresence>
      </div>
    </div>
  )
}