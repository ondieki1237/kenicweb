"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Search, Shield, CheckCircle, X, Globe, ShoppingCart } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import PaymentCheckout from "./payment-checkout"
import { useAuth } from "@/contexts/auth-context"

const MotionDiv = motion.div

interface DomainResult {
  name: string
  extension: string
  available: boolean
  price: number
  registrar: string
}

export default function DomainSearch() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedExtensions, setSelectedExtensions] = useState([".co.ke"])
  const [searchResults, setSearchResults] = useState<DomainResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [whoisData, setWhoisData] = useState<any>(null)
  const [showWhois, setShowWhois] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)
  const [selectedDomain, setSelectedDomain] = useState<DomainResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [cart, setCart] = useState<{ domain: string; price: number; registrar: string }[]>([])

  const extensions = [
    { name: ".co.ke", price: 1200 },
    { name: ".or.ke", price: 1000 },
    { name: ".ne.ke", price: 1000 },
    { name: ".go.ke", price: 1500 },
    { name: ".me.ke", price: 1200 },
    { name: ".mobi.ke", price: 1300 },
    { name: ".info.ke", price: 1100 },
    { name: ".sc.ke", price: 1400 },
    { name: ".ac.ke", price: 1500 },
  ]

  const toggleExtension = (ext: string) => {
    setSelectedExtensions((prev) =>
      prev.includes(ext) ? prev.filter((e) => e !== ext) : [...prev, ext]
    )
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
      const res = await fetch("https://kenic-hackathon.onrender.com/bulk-create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keyword: searchQuery.trim(),
          contact: "C123", // or user.contact if available
          extensions: selectedExtensions,
          user: user.email,
        }),
      })

      const data = await res.json()
      if (!data.results) throw new Error("No results returned")

      setSearchResults(
        data.results.map((d: any) => {
          const parts = d.domain.split(".")
          return {
            name: parts[0],
            extension: "." + parts.slice(1).join("."),
            available: d.status === "created" || d.status === "available",
            price: extensions.find((e) => d.domain.endsWith(e.name))?.price || 1200,
            registrar: d.info?.registrar || "N/A",
          }
        })
      )
    } catch (err: any) {
      console.error("Bulk search failed:", err)
      setError(err.message || "Failed to search domains")
    } finally {
      setIsSearching(false)
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

  const handleWhoisLookup = async (domain: string) => {
    if (!user) return
    try {
      setShowWhois(true)
      const res = await fetch(`http://localhost:5000/api/domains/whois?domain=${domain}`)
      const data = await res.json()
      setWhoisData(data)
    } catch (err) {
      console.error("WHOIS lookup failed:", err)
      setError("Failed to get WHOIS info")
      setShowWhois(false)
    }
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
        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <Alert className="bg-destructive/10 border-destructive rounded-[var(--radius)] shadow-sm">
                <AlertDescription className="text-destructive font-medium">{error}</AlertDescription>
              </Alert>
            </motion.div>
          )}
          {!user && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <Alert className="bg-accent border-accent rounded-[var(--radius)] shadow-sm">
                <Shield className="h-5 w-5 text-primary" />
                <AlertDescription className="text-accent-foreground font-medium">
                  Please log in to search and register domains.
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        <Card className="shadow-xl border-border rounded-[var(--radius)] overflow-hidden bg-card/90 backdrop-blur-sm">
          <CardContent className="space-y-8 p-8">
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              <Input
                placeholder="Enter domain name (e.g., mybusiness)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 text-base border-input rounded-[var(--radius)] h-12"
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                disabled={!user}
              />
              <Button
                onClick={handleSearch}
                disabled={!searchQuery.trim() || isSearching || !user}
                className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg h-12 px-8 rounded-[var(--radius)]"
              >
                {isSearching ? "Searching..." : <><Search className="h-5 w-5 mr-2" /> Search Domains</>}
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {extensions.map((ext) => (
                <Button
                  key={ext.name}
                  variant={selectedExtensions.includes(ext.name) ? "default" : "outline"}
                  size="lg"
                  onClick={() => toggleExtension(ext.name)}
                  className={`justify-between py-3 px-4 rounded-[var(--radius)] ${
                    selectedExtensions.includes(ext.name) ? "bg-primary text-primary-foreground" : "border-border"
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
          </CardContent>
        </Card>

        {searchResults.length > 0 && (
          <Card className="shadow-xl border-border rounded-[var(--radius)] overflow-hidden bg-card/90 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-primary to-secondary text-primary-foreground p-8">
              <CardTitle className="text-3xl font-bold">Search Results</CardTitle>
              <CardDescription className="text-primary-foreground/80 text-lg">
                Found {searchResults.length} results for "{searchQuery}"
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              {searchResults.map((result, index) => (
                <MotionDiv
                  key={`${result.name}${result.extension}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="group border border-border rounded-[var(--radius)] p-6 flex justify-between items-center bg-card"
                >
                  <div>
                    <h3 className="font-bold text-xl">{result.name}{result.extension}</h3>
                    <Badge className={result.available ? "bg-chart-4" : "bg-destructive"}>
                      {result.available ? "Available" : "Taken"}
                    </Badge>
                    <p className="text-sm mt-1">KSh {result.price} / year</p>
                  </div>
                  <div className="flex space-x-2">
                    {result.available && (
                      <>
                        <Button size="sm" className="bg-primary text-primary-foreground" onClick={() => handleRegisterDomain(result)}>
                          <ShoppingCart className="h-4 w-4 mr-1" /> Register
                        </Button>
                        <Button
                          size="sm"
                          className="bg-yellow-500 text-white hover:bg-yellow-600"
                          onClick={() => {
                            setCart((prev) => {
                              if (prev.some((d) => d.domain === result.name + result.extension)) {
                                alert("Domain already in cart!")
                                return prev
                              }
                              alert("Domain added to cart!")
                              return [
                                ...prev,
                                {
                                  domain: result.name + result.extension,
                                  price: result.price,
                                  registrar: result.registrar,
                                },
                              ]
                            })
                          }}
                        >
                          Add to Cart
                        </Button>
                      </>
                    )}
                  </div>
                </MotionDiv>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
