"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import { getCart, removeFromCart } from "@/lib/cart"

export default function CartPage() {
  const { user } = useAuth()
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    if (!user?.id) return setItems([])
    try {
      setLoading(true)
      const res = await getCart(user.id)
      const cartItems = res?.cart || res?.items || []
      setItems(Array.isArray(cartItems) ? cartItems : [])
    } catch (err) {
      console.error("Failed to load cart:", err)
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [user])

  const handleRemove = async (domain: string) => {
    if (!user?.id) return
    try {
      await removeFromCart(domain, user.id)
      await load()
    } catch (err: any) {
      console.error("Remove failed:", err)
      alert(err.message || "Failed to remove item")
    }
  }

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-2xl font-heading-bold mb-4">Your Cart</h1>
      <Card className="card-glass">
        <CardHeader>
          <CardTitle>Cart Items</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Loading...</div>
          ) : items.length === 0 ? (
            <div className="text-muted-foreground">
              Your cart is empty. <Link href="/dashboard">Back to dashboard</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((it: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <div className="font-medium">{it.domain || it.name}</div>
                    <div className="text-sm text-muted-foreground">KSh {it.price?.toLocaleString?.() ?? it.price}</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" onClick={() => handleRemove(it.domain || it.name)}>Remove</Button>
                    <Button asChild>
                      <Link href="/checkout">Checkout</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}