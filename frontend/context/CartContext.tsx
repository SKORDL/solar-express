"use client"
import React, { createContext, useContext, useEffect, useState, useCallback } from "react"
import { useAuth } from "@/context/AuthContext"

type CartItem = {
  _id: string
  product: any
  quantity: number
  label?: string
}

type CartContextType = {
  cart: CartItem[]
  loading: boolean
  fetchCart: () => Promise<void>
  addToCart: (params: {
    productId: string
    quantity?: number
    label?: string
  }) => Promise<boolean>
  updateCartItem: (cartItemId: string, quantity: number) => Promise<boolean>
  removeFromCart: (cartItemId: string) => Promise<boolean>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  console.log('CartProvider rendering') // Debug log

  const { user } = useAuth() // <-- Use AuthContext's user
  const [cart, setCart] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)

  const fetchCart = useCallback(async () => {
    console.log('fetchCart called, user:', !!user) // Debug log

    if (!user) {
      setCart([])
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/user/cart`, {
        credentials: "include",
      })

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }

      const data = await res.json()
      setCart(data.cart || [])
    } catch (error) {
      console.error('Error fetching cart:', error)
      setCart([])
    } finally {
      setLoading(false)
    }
  }, [user])

  const addToCart = useCallback(async ({
    productId,
    quantity = 1,
    label
  }: {
    productId: string
    quantity?: number
    label?: string
  }) => {
    console.log('addToCart called, user:', !!user) // Debug log

    if (!user) {
      console.warn('User not authenticated')
      return false
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/user/cart/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // <--- THIS IS REQUIRED!
        body: JSON.stringify({ productId, quantity, label }),
      })

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }

      const data = await res.json()
      if (data.success) {
        setCart(data.cart)
        return true
      }
      return false
    } catch (error) {
      console.error('Error adding to cart:', error)
      return false
    }
  }, [user])

  const updateCartItem = async (cartItemId: string, quantity: number) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/user/cart/update`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ cartItemId, quantity }),
    })
    const data = await res.json()
    if (data.success) setCart(data.cart)
    return data.success
  }

  const removeFromCart = async (cartItemId: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/user/cart/remove`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ cartItemId }),
    })
    const data = await res.json()
    if (data.success) setCart(data.cart)
    return data.success
  }

  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  const contextValue: CartContextType = {
    cart,
    loading,
    fetchCart,
    addToCart,
    updateCartItem,
    removeFromCart,
  }

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}