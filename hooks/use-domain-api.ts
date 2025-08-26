"use client"

import { useState } from "react"
import { domainApi } from "@/lib/api"

export const useDomainApi = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const checkDomain = async (domain: string) => {
    setLoading(true)
    setError(null)
    try {
      const result = await domainApi.checkDomain(domain)
      return result
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const getWhois = async (domain: string) => {
    setLoading(true)
    setError(null)
    try {
      const result = await domainApi.getWhois(domain)
      return result
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const bulkCheck = async (domains: string[]) => {
    setLoading(true)
    setError(null)
    try {
      const result = await domainApi.bulkCheck(domains)
      return result
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const getSuggestions = async (baseName: string) => {
    setLoading(true)
    setError(null)
    try {
      const result = await domainApi.getSuggestions(baseName)
      return result
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const getAISuggestions = async (baseName: string) => {
    setLoading(true)
    setError(null)
    try {
      const result = await domainApi.getAISuggestions(baseName)
      return result
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const getRegistrars = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await domainApi.getRegistrars()
      return result
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    checkDomain,
    getWhois,
    bulkCheck,
    getSuggestions,
    getAISuggestions,
    getRegistrars,
    loading,
    error,
  }
}
