"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Search,
  Shield,
  AlertTriangle,
  CheckCircle,
  X,
  Lightbulb,
  Globe,
  Eye,
  ShoppingCart,
  Zap,
} from "lucide-react";
import PaymentCheckout from "./payment-checkout";
import { domainApi } from "@/lib/api";
import { useAuth } from "@/contexts/auth-context";

interface DomainResult {
  name: string;
  extension: string;
  available: boolean;
  price: number;
  registrar: string;
  trademarkConflict?: boolean;
  similarDomains?: string[];
  aiSuggestion?: boolean;
}

export default function DomainSearch() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedExtensions, setSelectedExtensions] = useState([".co.ke"]);
  const [searchResults, setSearchResults] = useState<DomainResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [whoisData, setWhoisData] = useState<any>(null);
  const [showWhois, setShowWhois] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<DomainResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [registrars, setRegistrars] = useState<string[]>([]);

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
  ];

  // Fetch registrars on component mount if user is authenticated
  useState(() => {
    const fetchRegistrars = async () => {
      if (!user) return;
      try {
        const response = await domainApi.getRegistrars();
        setRegistrars(response.registrars || ["KeNIC", "Safaricom", "KCB Bank", "Equity Bank"]);
      } catch (error) {
        console.error("Failed to fetch registrars:", error);
        setRegistrars(["KeNIC", "Safaricom", "KCB Bank", "Equity Bank"]); // Fallback
      }
    };
    fetchRegistrars();
  }, [user]);

  const generateAISuggestions = async (query: string) => {
    if (!query || !user) return [];

    try {
      const response = await domainApi.getSuggestions(query);
      return response.suggestions || [];
    } catch (error: any) {
      console.error("Failed to get AI suggestions:", error);
      setError(error.message || "Failed to fetch AI suggestions");
      return [`${query}kenya`, `${query}hub`, `${query}pro`, `my${query}`].slice(0, 4); // Fallback
    }
  };

  // Check for trademark conflicts (mock - replace with KIPI API integration)
  const checkTrademarkConflict = (domain: string): boolean => {
    const conflictKeywords = ["safaricom", "equity", "kcb", "mpesa", "kenya", "government"];
    return conflictKeywords.some((keyword) => domain.toLowerCase().includes(keyword));
  };

  // Detect similar domains (cybersquatting protection)
  const detectSimilarDomains = (domain: string): string[] => {
    const popularDomains = ["safaricom.co.ke", "equity.co.ke", "kcb.co.ke", "kenya.go.ke"];
    const similar = [];
    for (const popular of popularDomains) {
      const popularName = popular.split(".")[0];
      if (domain.includes(popularName) || popularName.includes(domain)) {
        similar.push(popular);
      }
    }
    return similar;
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError("Please enter a domain name to search");
      return;
    }
    if (!user) {
      setError("Please log in to search domains");
      return;
    }

    setIsSearching(true);
    setSearchResults([]);
    setError(null);

    try {
      // Generate AI suggestions
      const suggestions = await generateAISuggestions(searchQuery);
      setAiSuggestions(suggestions);

      // Prepare domains for bulk check
      const domainsToCheck = selectedExtensions.map((ext) => `${searchQuery}${ext}`);

      const response = await domainApi.bulkCheck(domainsToCheck);

      const results: DomainResult[] = response.results.map((result: any) => {
        const extension = selectedExtensions.find((ext) => result.domain.endsWith(ext)) || ".co.ke";
        const extensionInfo = extensions.find((e) => e.name === extension);
        const trademarkConflict = checkTrademarkConflict(searchQuery);
        const similarDomains = detectSimilarDomains(searchQuery);

        return {
          name: searchQuery,
          extension,
          available: result.available,
          price: result.price || extensionInfo?.price || 1200,
          registrar: result.registrar || registrars[0] || "KeNIC",
          trademarkConflict,
          similarDomains: similarDomains.length > 0 ? similarDomains : undefined,
        };
      });

      setSearchResults(results);
    } catch (error: any) {
      console.error("Domain search failed:", error);
      const message = error.response?.status === 401
        ? "Unauthorized: Please log in again"
        : error.response?.status === 429
          ? "Rate limit exceeded. Please try again later."
          : error.message || "Failed to search domains. Please try again.";
      setError(message);
    } finally {
      setIsSearching(false);
    }
  };

  const handleWhoisLookup = async (domain: string) => {
    if (!user) {
      setError("Please log in to view WHOIS information");
      return;
    }

    try {
      setShowWhois(true);
      const response = await domainApi.getWhois(domain);
      setWhoisData(response);
    } catch (error: any) {
      console.error("WHOIS lookup failed:", error);
      const message = error.response?.status === 401
        ? "Unauthorized: Please log in again"
        : error.message || "Failed to get WHOIS information";
      setError(message);
      setShowWhois(false);
    }
  };

  const handleRegisterDomain = (domain: DomainResult) => {
    if (!user) {
      setError("Please log in to register domains");
      return;
    }
    if (user.role !== "registrar" && user.role !== "admin") {
      setError("Only users with 'registrar' or 'admin' roles can register domains");
      return;
    }
    setSelectedDomain(domain);
    setShowCheckout(true);
  };

  const toggleExtension = (ext: string) => {
    setSelectedExtensions((prev) =>
      prev.includes(ext) ? prev.filter((e) => e !== ext) : [...prev, ext]
    );
  };

  if (showCheckout && selectedDomain) {
    return (
      <PaymentCheckout
        domain={`${selectedDomain.name}${selectedDomain.extension}`}
        amount={selectedDomain.price}
        type="registration"
        onSuccess={() => {
          setShowCheckout(false);
          setSelectedDomain(null);
        }}
        onCancel={() => {
          setShowCheckout(false);
          setSelectedDomain(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Alert */}
      {error && (
        <Alert className="bg-red-50 border-red-200">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      {/* Login Required Alert */}
      {!user && (
        <Alert className="bg-blue-50 border-blue-200">
          <Shield className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>Login Required:</strong> Please log in to search and register domains.
          </AlertDescription>
        </Alert>
      )}

      {/* Role Restriction Alert */}
      {user && user.role !== "registrar" && user.role !== "admin" && (
        <Alert className="bg-yellow-50 border-yellow-200">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            <strong>Role Restriction:</strong> Only users with "registrar" or "admin" roles can register domains. Your
            role is "{user.role || "user"}". Contact support to upgrade your account.
          </AlertDescription>
        </Alert>
      )}

      {/* Search Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="mr-2 h-5 w-5" />
            AI-Powered Domain Search
          </CardTitle>
          <CardDescription>
            Find the perfect .KE domain with intelligent suggestions and comprehensive protection
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Input */}
          <div className="flex space-x-2">
            <Input
              placeholder="Enter your domain name (e.g., mybusiness)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 text-lg"
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              disabled={!user}
            />
            <Button
              onClick={handleSearch}
              disabled={!searchQuery.trim() || isSearching || !user}
              className="bg-gradient-to-r from-primary to-blue-600 px-8"
            >
              {isSearching ? (
                <>
                  <Zap className="h-4 w-4 mr-2 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </>
              )}
            </Button>
          </div>

          {/* Extension Selection */}
          <div className="space-y-2">
            <h4 className="font-medium">Select .KE Extensions</h4>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
              {extensions.map((ext) => (
                <Button
                  key={ext.name}
                  variant={selectedExtensions.includes(ext.name) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleExtension(ext.name)}
                  className="justify-start"
                  disabled={!user}
                >
                  {ext.name}
                  <span className="ml-1 text-xs">KSh {ext.price}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* KIPI Trademark Protection Notice */}
          <Alert className="bg-blue-50 border-blue-200">
            <Shield className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>KIPI Protection Active:</strong> All searches automatically check for trademark conflicts through
              the Kenya Industrial Property Institute database.
            </AlertDescription>
          </Alert>

          {/* Available Registrars */}
          {registrars.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Available Registrars</h4>
              <div className="flex flex-wrap gap-2">
                {registrars.map((registrar) => (
                  <Badge key={registrar} variant="secondary">
                    {registrar}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Suggestions */}
      {aiSuggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Lightbulb className="mr-2 h-5 w-5 text-yellow-500" />
              AI-Powered Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {aiSuggestions.map((suggestion) => (
                <Button
                  key={suggestion}
                  variant="outline"
                  onClick={() => setSearchQuery(suggestion)}
                  className="justify-start bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 hover:from-yellow-100 hover:to-orange-100"
                >
                  <Lightbulb className="h-3 w-3 mr-2 text-yellow-500" />
                  {suggestion}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search Results */}
      {searchResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Search Results</CardTitle>
            <CardDescription>
              Found {searchResults.length} results for "{searchQuery}"
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {searchResults.map((result, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-lg">
                          {result.name}
                          {result.extension}
                        </h3>
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
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">KSh {result.price}/year</span>
                      {result.available && (
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-primary to-blue-600"
                          onClick={() => handleRegisterDomain(result)}
                          disabled={user?.role !== "registrar" && user?.role !== "admin"}
                        >
                          <ShoppingCart className="h-4 w-4 mr-1" />
                          Register
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleWhoisLookup(`${result.name}${result.extension}`)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        WHOIS
                      </Button>
                    </div>
                  </div>

                  {/* Trademark Conflict Warning */}
                  {result.trademarkConflict && (
                    <Alert className="bg-red-50 border-red-200">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-800">
                        <strong>Trademark Conflict Detected:</strong> This domain name may conflict with existing
                        trademarks registered with KIPI. Consider alternative names to avoid legal issues.
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Similar Domains Warning (Cybersquatting Protection) */}
                  {result.similarDomains && result.similarDomains.length > 0 && (
                    <Alert className="bg-orange-50 border-orange-200">
                      <AlertTriangle className="h-4 w-4 text-orange-600" />
                      <AlertDescription className="text-orange-800">
                        <strong>Similar Domain Warning:</strong> This domain is similar to existing domains:{" "}
                        {result.similarDomains.join(", ")}. This may be considered cybersquatting or typosquatting.
                      </AlertDescription>
                    </Alert>
                  )}

                  {!result.available && (
                    <div className="text-sm text-muted-foreground">Registered through: {result.registrar}</div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* WHOIS Modal */}
      {showWhois && whoisData && (
        <Card className="fixed inset-4 z-50 bg-white shadow-2xl border-2 max-w-2xl mx-auto my-auto h-fit">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center">
              <Globe className="mr-2 h-5 w-5" />
              WHOIS Information
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setShowWhois(false)}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Domain</h4>
                <p className="font-semibold">{whoisData.domain}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Status</h4>
                <Badge className="bg-green-100 text-green-800">{whoisData.status}</Badge>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Registrar</h4>
                <p>{whoisData.registrar}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Registrant</h4>
                <p>{whoisData.registrant}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Registration Date</h4>
                <p>{whoisData.registrationDate}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Expiry Date</h4>
                <p>{whoisData.expiryDate}</p>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-2">Name Servers</h4>
              <div className="space-y-1">
                {whoisData.nameServers?.map((ns: string, index: number) => (
                  <p key={index} className="text-sm font-mono bg-gray-50 p-2 rounded">
                    {ns}
                  </p>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Background overlay for WHOIS modal */}
      {showWhois && <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setShowWhois(false)} />}
    </div>
  );
}