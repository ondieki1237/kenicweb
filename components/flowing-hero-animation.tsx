"use client"

import { useState, useEffect } from "react"
import { Search, Shield, Globe, CreditCard, CheckCircle, ArrowDown, ArrowRight } from "lucide-react"

export default function FlowingHeroAnimation() {
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 5)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const steps = [
    { icon: Search, label: "Search Domain", color: "text-blue-500", bgColor: "bg-blue-50" },
    { icon: CheckCircle, label: "Check Availability", color: "text-green-500", bgColor: "bg-green-50" },
    { icon: Shield, label: "Secure Registration", color: "text-crimson-500", bgColor: "bg-crimson-50" },
    { icon: CreditCard, label: "M-Pesa Payment", color: "text-orange-500", bgColor: "bg-orange-50" },
    { icon: Globe, label: "Domain Active", color: "text-teal-500", bgColor: "bg-teal-50" },
  ]

  return (
    <div className="relative w-full max-w-4xl mx-auto mb-12">
      {/* Desktop Layout */}
      <div className="hidden md:block h-96">
        {/* Background flowing paths */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 800 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M80 200 L180 200 L280 200 L380 200 L680 200"
            stroke="url(#gradient1)"
            strokeWidth="3"
            fill="none"
            className="animate-pulse"
          />
          <path
            d="M80 220 Q200 180 400 220 T680 220"
            stroke="url(#gradient2)"
            strokeWidth="2"
            fill="none"
            className="animate-pulse"
            style={{ animationDelay: "1s" }}
          />
          <path
            d="M80 180 Q250 240 450 180 T680 180"
            stroke="url(#gradient3)"
            strokeWidth="2"
            fill="none"
            className="animate-pulse"
            style={{ animationDelay: "2s" }}
          />

          {/* Gradient definitions */}
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.4" />
              <stop offset="25%" stopColor="#10B981" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#DC143C" stopOpacity="0.8" />
              <stop offset="75%" stopColor="#F59E0B" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#EF4444" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#DC143C" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#06B6D4" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.2" />
            </linearGradient>
          </defs>
        </svg>

        {/* Floating step indicators */}
        <div className="absolute inset-0 flex items-center justify-between px-8">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isActive = activeStep === index
            const isPast = activeStep > index

            return (
              <div
                key={index}
                className={`relative transition-all duration-500 ${
                  isActive ? "scale-110 z-20" : isPast ? "scale-95 opacity-70" : "scale-90 opacity-50"
                }`}
              >
                {/* Floating card */}
                <div
                  className={`${step.bgColor} rounded-2xl p-4 shadow-lg border-2 transition-all duration-500 ${
                    isActive ? "border-primary shadow-xl" : "border-transparent"
                  }`}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <div
                      className={`w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-md transition-all duration-300 ${
                        isActive ? "animate-bounce" : ""
                      }`}
                    >
                      <Icon className={`w-6 h-6 ${step.color}`} />
                    </div>
                    <span className="text-xs font-medium text-gray-700 text-center whitespace-nowrap">
                      {step.label}
                    </span>
                  </div>
                </div>

                {index < steps.length - 1 && (
                  <div className="absolute top-1/2 -right-6 flex items-center">
                    <ArrowRight
                      className={`w-4 h-4 transition-all duration-1000 ${
                        activeStep > index ? "text-primary" : "text-gray-300"
                      }`}
                    />
                  </div>
                )}

                {/* Floating particles */}
                {isActive && (
                  <>
                    <div className="absolute -top-2 -left-2 w-2 h-2 bg-blue-400 rounded-full animate-ping" />
                    <div
                      className="absolute -bottom-2 -right-2 w-2 h-2 bg-crimson-400 rounded-full animate-ping"
                      style={{ animationDelay: "0.5s" }}
                    />
                    <div
                      className="absolute top-0 -right-1 w-1.5 h-1.5 bg-green-400 rounded-full animate-ping"
                      style={{ animationDelay: "1s" }}
                    />
                  </>
                )}
              </div>
            )
          })}
        </div>

        {/* Central logo/brand element */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center shadow-xl">
            <Globe className="w-8 h-8 text-white animate-spin" style={{ animationDuration: "8s" }} />
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden">
        <div className="flex flex-col items-center space-y-6 py-8">
          {/* First row - 3 steps */}
          <div className="flex justify-center space-x-4">
            {steps.slice(0, 3).map((step, index) => {
              const Icon = step.icon
              const isActive = activeStep === index
              const isPast = activeStep > index

              return (
                <div
                  key={index}
                  className={`relative transition-all duration-500 ${
                    isActive ? "scale-110 z-20" : isPast ? "scale-95 opacity-70" : "scale-90 opacity-50"
                  }`}
                >
                  <div
                    className={`${step.bgColor} rounded-xl p-3 shadow-lg border-2 transition-all duration-500 ${
                      isActive ? "border-primary shadow-xl" : "border-transparent"
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-1">
                      <div
                        className={`w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md transition-all duration-300 ${
                          isActive ? "animate-bounce" : ""
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${step.color}`} />
                      </div>
                      <span className="text-xs font-medium text-gray-700 text-center">{step.label}</span>
                    </div>
                  </div>

                  {index < 2 && (
                    <div className="absolute top-1/2 -right-4 flex items-center">
                      <ArrowRight
                        className={`w-3 h-3 transition-all duration-1000 ${
                          activeStep > index ? "text-primary" : "text-gray-300"
                        }`}
                      />
                    </div>
                  )}

                  {/* Floating particles */}
                  {isActive && (
                    <>
                      <div className="absolute -top-1 -left-1 w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping" />
                      <div
                        className="absolute -bottom-1 -right-1 w-1.5 h-1.5 bg-crimson-400 rounded-full animate-ping"
                        style={{ animationDelay: "0.5s" }}
                      />
                    </>
                  )}
                </div>
              )
            })}
          </div>

          {/* Downward arrow */}
          <div className="flex justify-center">
            <div
              className={`transition-all duration-500 ${activeStep >= 2 ? "animate-bounce text-primary" : "opacity-50 text-gray-300"}`}
            >
              <ArrowDown className="w-6 h-6" />
            </div>
          </div>

          {/* Second row - remaining 2 steps */}
          <div className="flex justify-center space-x-8">
            {steps.slice(3, 5).map((step, index) => {
              const actualIndex = index + 3
              const Icon = step.icon
              const isActive = activeStep === actualIndex
              const isPast = activeStep > actualIndex

              return (
                <div
                  key={actualIndex}
                  className={`relative transition-all duration-500 ${
                    isActive ? "scale-110 z-20" : isPast ? "scale-95 opacity-70" : "scale-90 opacity-50"
                  }`}
                >
                  <div
                    className={`${step.bgColor} rounded-xl p-3 shadow-lg border-2 transition-all duration-500 ${
                      isActive ? "border-primary shadow-xl" : "border-transparent"
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-1">
                      <div
                        className={`w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md transition-all duration-300 ${
                          isActive ? "animate-bounce" : ""
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${step.color}`} />
                      </div>
                      <span className="text-xs font-medium text-gray-700 text-center">{step.label}</span>
                    </div>
                  </div>

                  {index === 0 && (
                    <div className="absolute top-1/2 -right-8 flex items-center">
                      <ArrowRight
                        className={`w-4 h-4 transition-all duration-1000 ${
                          activeStep > actualIndex ? "text-primary" : "text-gray-300"
                        }`}
                      />
                    </div>
                  )}

                  {/* Floating particles */}
                  {isActive && (
                    <>
                      <div className="absolute -top-1 -left-1 w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping" />
                      <div
                        className="absolute -bottom-1 -right-1 w-1.5 h-1.5 bg-crimson-400 rounded-full animate-ping"
                        style={{ animationDelay: "0.5s" }}
                      />
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Floating domain extensions */}
      <div className="absolute top-8 left-16 animate-float">
        <div className="bg-white rounded-lg px-3 py-1 shadow-md border text-sm font-medium text-primary">.co.ke</div>
      </div>
      <div className="absolute top-16 right-20 animate-float" style={{ animationDelay: "1s" }}>
        <div className="bg-white rounded-lg px-3 py-1 shadow-md border text-sm font-medium text-green-600">.or.ke</div>
      </div>
      <div className="absolute bottom-12 left-24 animate-float" style={{ animationDelay: "2s" }}>
        <div className="bg-white rounded-lg px-3 py-1 shadow-md border text-sm font-medium text-crimson-600">
          .me.ke
        </div>
      </div>
      <div className="absolute bottom-20 right-16 animate-float" style={{ animationDelay: "0.5s" }}>
        <div className="bg-white rounded-lg px-3 py-1 shadow-md border text-sm font-medium text-orange-600">.go.ke</div>
      </div>
    </div>
  )
}
