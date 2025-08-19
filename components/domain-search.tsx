"use client";

import React, { useState } from "react";
import api from "@/lib/axios";

// Define interfaces matching the provided code
interface Pricing {
  registrar: string;
  registrarId: string;
  website: string;
  phone: string;
  email: string;
  price: number;
  currency: string;
  rating: number;
  reviews: number;
  features: string[];
  registerUrl: string;
}

interface DomainResult {
  domain: string;
  available: boolean;
  whoisData: null | any;
  pricing: Pricing[];
  bestPrice: Pricing;
}

interface ApiResponse {
  success: boolean;
  businessDescription?: string;
  count: number;
  suggestions: DomainResult[];
}

const API_BASE_URL = "http://localhost:5000/api/domains";

export default function DomainSearch() {
  const [businessDescription, setBusinessDescription] = useState<string>("We sell fresh farm produce");
  const [searchResults, setSearchResults] = useState<DomainResult[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!businessDescription.trim()) {
      setError("Please enter a business description");
      return;
    }

    setIsSearching(true);
    setSearchResults([]);
    setError(null);

    try {
      const token = localStorage.getItem("token"); // Or get from context/provider
      const response = await api.post<ApiResponse>(
        "/domains/ai-suggestions",
        { businessDescription }
      );

      if (!response.data.success) {
        setError("No suggestions found.");
        return;
      }

      // Clean domain names by removing numbering prefix
      const results = response.data.suggestions.map((suggestion) => ({
        ...suggestion,
        domain: suggestion.domain.replace(/^\d+\.\s+/, ""),
      }));

      setSearchResults(results);
    } catch (error: any) {
      console.error("Domain search failed:", error);
      setError(error.message || "Failed to search domains. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "24px",
        fontFamily: "Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
      }}
    >
      {/* Error Alert */}
      {error && (
        <div
          style={{
            backgroundColor: "#fef2f2",
            border: "1px solid #fecaca",
            padding: "12px",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <svg
            style={{ width: "16px", height: "16px", color: "#dc2626" }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <span style={{ color: "#991b1b" }}>{error}</span>
        </div>
      )}

      {/* Search Interface */}
      <div
        style={{
          backgroundColor: "white",
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div
          style={{
            padding: "16px 24px",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <h2
            style={{
              fontSize: "20px",
              fontWeight: "600",
              color: "#111827",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <svg
              style={{ width: "20px", height: "20px", color: "#6b7280" }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            AI-Powered Domain Search
          </h2>
          <p
            style={{
              color: "#6b7280",
              fontSize: "14px",
              marginTop: "4px",
            }}
          >
            Find the perfect .KE domain based on your business description
          </p>
        </div>
        <div
          style={{
            padding: "24px",
            display: "flex",
            gap: "8px",
          }}
        >
          <input
            type="text"
            placeholder="Enter your business description (e.g., We sell fresh farm produce)"
            value={businessDescription}
            onChange={(e) => setBusinessDescription(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            style={{
              flex: 1,
              padding: "12px",
              fontSize: "16px",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              outline: "none",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
            onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
          />
          <button
            onClick={handleSearch}
            disabled={!businessDescription.trim() || isSearching}
            style={{
              padding: "12px 24px",
              fontSize: "16px",
              background: isSearching
                ? "#9ca3af"
                : "linear-gradient(to right, #3b82f6, #2563eb)",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: !businessDescription.trim() || isSearching ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              transition: "background 0.2s",
            }}
            onMouseOver={(e) => {
              if (!isSearching && businessDescription.trim()) {
                e.currentTarget.style.background = "linear-gradient(to right, #2563eb, #1d4ed8)";
              }
            }}
            onMouseOut={(e) => {
              if (!isSearching && businessDescription.trim()) {
                e.currentTarget.style.background = "linear-gradient(to right, #3b82f6, #2563eb)";
              }
            }}
          >
            {isSearching ? (
              <>
                <svg
                  style={{ width: "16px", height: "16px", animation: "spin 1s linear infinite" }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                Searching...
              </>
            ) : (
              <>
                <svg
                  style={{ width: "16px", height: "16px" }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                Search
              </>
            )}
          </button>
        </div>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div
          style={{
            backgroundColor: "white",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div
            style={{
              padding: "16px 24px",
              borderBottom: "1px solid #e5e7eb",
            }}
          >
            <h2
              style={{
                fontSize: "20px",
                fontWeight: "600",
                color: "#111827",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <svg
                style={{ width: "20px", height: "20px", color: "#eab308" }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
              AI-Powered Suggestions
            </h2>
            <p
              style={{
                color: "#6b7280",
                fontSize: "14px",
                marginTop: "4px",
              }}
            >
              Found {searchResults.length} domain suggestions for "{businessDescription}"
            </p>
          </div>
          <div
            style={{
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            {searchResults.map((result, index) => (
              <div
                key={index}
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  padding: "16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <h3
                      style={{
                        fontSize: "18px",
                        fontWeight: "600",
                        color: "#111827",
                      }}
                    >
                      {result.domain}
                    </h3>
                    <span
                      style={{
                        backgroundColor: result.available ? "#dcfce7" : "#fee2e2",
                        color: result.available ? "#15803d" : "#b91c1c",
                        padding: "2px 8px",
                        borderRadius: "12px",
                        fontSize: "12px",
                        fontWeight: "500",
                        border: result.available ? "1px solid #bbf7d0" : "1px solid #fecaca",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      {result.available ? (
                        <>
                          <svg
                            style={{ width: "12px", height: "12px" }}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          Available
                        </>
                      ) : (
                        <>
                          <svg
                            style={{ width: "12px", height: "12px" }}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                          </svg>
                          Taken
                        </>
                      )}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <span
                      style={{
                        fontWeight: "600",
                        color: "#111827",
                      }}
                    >
                      {result.bestPrice.price} {result.bestPrice.currency}/year
                    </span>
                    <a
                      href={result.bestPrice.registerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: "8px 16px",
                        fontSize: "14px",
                        background: "linear-gradient(to right, #3b82f6, #2563eb)",
                        color: "white",
                        borderRadius: "6px",
                        textDecoration: "none",
                        display: result.available ? "inline-flex" : "none",
                        alignItems: "center",
                        gap: "4px",
                        transition: "background 0.2s",
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.background = "linear-gradient(to right, #2563eb, #1d4ed8)")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.background = "linear-gradient(to right, #3b82f6, #2563eb)")
                      }
                    >
                      <svg
                        style={{ width: "16px", height: "16px" }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      Register
                    </a>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <h4
                    style={{
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "#111827",
                    }}
                  >
                    Best Price: {result.bestPrice.registrar}
                  </h4>
                  <p
                    style={{
                      fontSize: "14px",
                      color: "#6b7280",
                    }}
                  >
                    Price: {result.bestPrice.price} {result.bestPrice.currency} | Rating: {result.bestPrice.rating} (
                    {result.bestPrice.reviews} reviews)
                  </p>
                  <p
                    style={{
                      fontSize: "14px",
                      color: "#6b7280",
                    }}
                  >
                    Features: {result.bestPrice.features.join(", ")}
                  </p>
                  <a
                    href={result.bestPrice.registerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: "14px",
                      color: "#2563eb",
                      textDecoration: "none",
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.textDecoration = "underline")}
                    onMouseOut={(e) => (e.currentTarget.style.textDecoration = "none")}
                  >
                    Register at {result.bestPrice.registrar}
                  </a>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <h4
                    style={{
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "#111827",
                    }}
                  >
                    All Pricing Options:
                  </h4>
                  <ul
                    style={{
                      paddingLeft: "20px",
                      fontSize: "14px",
                      color: "#6b7280",
                      listStyleType: "disc",
                    }}
                  >
                    {result.pricing.map((price) => (
                      <li key={price.registrarId}>
                        <strong>{price.registrar}</strong>: {price.price} {price.currency} |{" "}
                        <a
                          href={price.registerUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: "#2563eb",
                            textDecoration: "none",
                          }}
                          onMouseOver={(e) => (e.currentTarget.style.textDecoration = "underline")}
                          onMouseOut={(e) => (e.currentTarget.style.textDecoration = "none")}
                        >
                          Register
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}