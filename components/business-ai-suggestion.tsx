"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, ShoppingCart, Eye, CheckCircle, X, Zap } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { domainApi } from "@/lib/api";
import { useAuth } from "@/contexts/auth-context";

const MotionDiv = motion.div;

interface AISuggestion {
  domain: string;
  available: boolean;
  bestPrice?: { price: number; registrar: string } | null;
  pricing?: Array<{ price: number; registrar: string }>;
  aiSuggestion: boolean;
}

export default function BusinessAISuggestion({
  onSelectDomain,
  onWhoisLookup,
}: {
  onSelectDomain: (domain: string, extensions: string[]) => void;
  onWhoisLookup: (domain: string) => void;
}) {
  const { user } = useAuth();
  const [businessDescription, setBusinessDescription] = useState("");
  const [bizSuggestions, setBizSuggestions] = useState<AISuggestion[]>([]);
  const [isBizLoading, setIsBizLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const allKeExtensions = [
    ".co.ke",
    ".or.ke",
    ".ne.ke",
    ".go.ke",
    ".me.ke",
    ".mobi.ke",
    ".info.ke",
    ".sc.ke",
    ".ac.ke",
  ];

  const handleBusinessAISearch = async () => {
    if (!businessDescription.trim()) {
      setError("Please enter a business description");
      return;
    }
    if (!user) {
      setError("Please log in to get AI suggestions");
      return;
    }
    try {
      setIsBizLoading(true);
      setBizSuggestions([]);
      setError(null);
      const response = await domainApi.getAISuggestionsFromBusiness(businessDescription);
      const list = Array.isArray(response?.suggestions) ? response.suggestions : [];
      const normalized = list.map((s: any) => {
        const raw = typeof s?.domain === "string" ? s.domain : String(s?.domain || "");
        const cleaned = raw.replace(/^\s*\d+\.?\s+/g, "").trim();
        return {
          domain: cleaned,
          available: !!s.available,
          bestPrice: s?.bestPrice || null,
          pricing: Array.isArray(s?.pricing) ? s.pricing : [],
          aiSuggestion: true,
        };
      });
      setBizSuggestions(normalized);
      if (normalized.length === 0) {
        setError("No AI suggestions found for the provided description.");
      }
    } catch (e: any) {
      console.error("Business AI suggestion failed", e);
      setError(e?.message || "Failed to fetch AI suggestions");
    } finally {
      setIsBizLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto px-2 sm:px-6 py-8 bg-white/80 dark:bg-neutral-900 rounded-2xl shadow-xl border border-border">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="p-3 bg-primary/10 rounded-full">
          <Lightbulb className="h-6 w-6 text-primary" />
        </div>
        <h4 className="font-bold text-2xl text-foreground">
          AI-Driven Domain Suggestions
        </h4>
      </div>
      <p className="text-muted-foreground text-base mb-2">
        Describe your business and let AI suggest the best .KE domains for you.
      </p>

      {/* Error Alert */}
      <AnimatePresence>
        {error && (
          <MotionDiv
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Alert className="bg-destructive/10 border-destructive rounded-[var(--radius)] shadow-sm mb-4">
              <X className="h-5 w-5 text-destructive" />
              <AlertDescription className="text-destructive font-medium">{error}</AlertDescription>
            </Alert>
          </MotionDiv>
        )}
      </AnimatePresence>

      {/* Input and Button */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Input
          placeholder="Describe your business (e.g., Fresh farm produce supplier)"
          value={businessDescription}
          onChange={(e) => setBusinessDescription(e.target.value)}
          className="flex-1 text-base border-input focus:ring-ring focus:border-primary rounded-[var(--radius)] h-12 bg-white dark:bg-neutral-800"
          disabled={!user}
        />
        <Button
          onClick={handleBusinessAISearch}
          disabled={!businessDescription.trim() || isBizLoading || !user}
          className="bg-gradient-to-r from-primary to-red-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 h-12 px-8 rounded-[var(--radius)] text-base font-semibold"
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

      {/* Suggestions List */}
      <AnimatePresence>
        {bizSuggestions.length > 0 && (
          <MotionDiv
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6"
          >
            {bizSuggestions.map((s, idx) => {
              const price =
                typeof s?.bestPrice?.price === "number" ? s.bestPrice.price : s?.pricing?.[0]?.price || null;
              const registrar = s?.bestPrice?.registrar || s?.pricing?.[0]?.registrar || "KeNIC";
              return (
                <div
                  key={`biz-${idx}-${s.domain}`}
                  className="border border-border rounded-xl p-5 flex flex-col justify-between bg-card shadow-md hover:shadow-xl transition-all duration-300"
                >
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-lg text-foreground">{s.domain}</h3>
                      {s.available ? (
                        <Badge className="bg-green-100 text-green-700 border-green-200 font-medium">
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
                    <div className="text-sm text-muted-foreground mb-2">
                      {price ? (
                        <>
                          <span className="font-semibold text-primary">KSh {price}</span>
                          <span className="ml-2"> @ {registrar}</span>
                        </>
                      ) : (
                        "Pricing unavailable"
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    {s.available && (
                      <Button
                        size="sm"
                        className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg rounded-[var(--radius)]"
                        onClick={() => {
                          const domainLower = String(s.domain || "").toLowerCase().trim();
                          let base = domainLower;
                          for (const ext of [...allKeExtensions, ".ke"]) {
                            if (domainLower.endsWith(ext)) {
                              base = domainLower.slice(0, -ext.length);
                              break;
                            }
                          }
                          base = base.replace(/^\s*\d+\.?\s+/, "").replace(/\.$/, "").trim();
                          onSelectDomain(base, allKeExtensions);
                        }}
                      >
                        <ShoppingCart className="h-4 w-4 mr-1" />
                        Use
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onWhoisLookup(s.domain)}
                      className="hover:bg-accent hover:border-accent rounded-[var(--radius)]"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      WHOIS
                    </Button>
                  </div>
                </div>
              );
            })}
          </MotionDiv>
        )}
      </AnimatePresence>
    </div>
  );
}