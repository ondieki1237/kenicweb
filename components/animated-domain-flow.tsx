"use client"

import { useState, useEffect } from "react"
import { Search, CheckCircle, XCircle, Lock, CreditCard, Shield, Globe } from "lucide-react"

export default function AnimatedDomainFlow() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isAvailable, setIsAvailable] = useState(true)

  const steps = [
    {
      id: 0,
      title: "Search Domain",
      icon: <Search className="h-8 w-8" />,
      description: "Enter your desired domain name",
      color: "from-blue-500 to-blue-600",
      example: "mybusiness.co.ke",
    },
    {
      id: 1,
      title: "Check Availability",
      icon: isAvailable ? <CheckCircle className="h-8 w-8" /> : <XCircle className="h-8 w-8" />,
      description: "Instant availability verification",
      color: isAvailable ? "from-green-500 to-green-600" : "from-red-500 to-red-600",
      example: isAvailable ? "Available!" : "Try another name",
    },
    {
      id: 2,
      title: "Secure Registration",
      icon: <Lock className="h-8 w-8" />,
      description: "Fill secure registration form",
      color: "from-primary to-primary/80",
      example: "Protected by SSL",
    },
    {
      id: 3,
      title: "Payment & Verification",
      icon: <Shield className="h-8 w-8" />,
      description: "M-Pesa or card payment",
      color: "from-yellow-500 to-yellow-600",
      example: "M-Pesa: Ksh 999",
    },
    {
      id: 4,
      title: "Domain Activation",
      icon: <Globe className="h-8 w-8" />,
      description: "Your domain goes live",
      color: "from-green-500 to-emerald-500",
      example: "🎉 You're online!",
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev === 4) {
          // Reset animation
          setIsAvailable(Math.random() > 0.3) // 70% chance available
          return 0
        }
        return prev + 1
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute top-16 left-0 right-0 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-green-500 transition-all duration-2000 ease-in-out"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>

        {/* Steps */}
        <div className="flex justify-between items-start relative z-10">
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center text-center max-w-32">
              {/* Step Circle */}
              <div
                className={`
                  w-16 h-16 rounded-full flex items-center justify-center text-white mb-3
                  transition-all duration-500 transform
                  ${
                    index <= currentStep
                      ? `bg-gradient-to-br ${step.color} scale-110 shadow-lg`
                      : "bg-gray-300 scale-100"
                  }
                  ${index === currentStep ? "animate-pulse" : ""}
                `}
              >
                {step.icon}
              </div>

              {/* Step Title */}
              <h3
                className={`
                text-sm font-semibold mb-1 transition-colors duration-300
                ${index <= currentStep ? "text-foreground" : "text-muted-foreground"}
              `}
              >
                {step.title}
              </h3>

              {/* Step Description */}
              <p
                className={`
                text-xs mb-2 transition-colors duration-300
                ${index <= currentStep ? "text-muted-foreground" : "text-muted-foreground/60"}
              `}
              >
                {step.description}
              </p>

              {/* Example Text */}
              <div
                className={`
                text-xs px-2 py-1 rounded-full transition-all duration-300
                ${
                  index === currentStep
                    ? "bg-primary/10 text-primary font-medium animate-bounce"
                    : index < currentStep
                      ? "bg-green-50 text-green-700"
                      : "bg-gray-50 text-gray-500"
                }
              `}
              >
                {step.example}
              </div>

              {/* Connecting Arrow */}
              {index < steps.length - 1 && (
                <div
                  className={`
                  absolute top-8 w-8 h-0.5 transition-colors duration-500
                  ${index < currentStep ? "bg-primary" : "bg-gray-300"}
                `}
                  style={{
                    left: `${((index + 1) * 100) / steps.length - 50 / steps.length}%`,
                    transform: "translateX(-50%)",
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Floating Animation Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {currentStep === 0 && (
            <div className="absolute top-4 left-1/4 animate-bounce">
              <div className="w-2 h-2 bg-blue-400 rounded-full opacity-60" />
            </div>
          )}
          {currentStep === 1 && (
            <div className="absolute top-6 right-1/3 animate-pulse">
              <div className={`w-3 h-3 rounded-full opacity-70 ${isAvailable ? "bg-green-400" : "bg-red-400"}`} />
            </div>
          )}
          {currentStep === 3 && (
            <div className="absolute top-2 right-1/4 animate-spin">
              <CreditCard className="h-4 w-4 text-yellow-500 opacity-60" />
            </div>
          )}
          {currentStep === 4 && (
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
              <div className="animate-ping w-4 h-4 bg-green-400 rounded-full opacity-40" />
            </div>
          )}
        </div>
      </div>

      {/* Current Step Highlight */}
      <div className="mt-6 text-center">
        <div
          className={`
          inline-flex items-center px-4 py-2 rounded-full text-sm font-medium
          bg-gradient-to-r ${steps[currentStep]?.color} text-white
          shadow-lg transform transition-all duration-300
        `}
        >
          <span className="mr-2">{steps[currentStep]?.icon}</span>
          Step {currentStep + 1}: {steps[currentStep]?.title}
        </div>
      </div>
    </div>
  )
}
