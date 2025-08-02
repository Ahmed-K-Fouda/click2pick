"use client";

import { useEffect, useState } from "react";
import { Cart } from "@/types";

export const useCart = () => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [itemCount, setItemCount] = useState(0);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/cart");
      if (response.ok) {
        const data = await response.json();
        setCart(data.cart);
        setItemCount(data.itemCount);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCartCount = async () => {
    try {
      const response = await fetch("/api/cart/count");
      if (response.ok) {
        const data = await response.json();
        setItemCount(data.count);
      }
    } catch (error) {
      console.error("Error fetching cart count:", error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const refreshCart = () => {
    fetchCart();
  };

  const refreshCartCount = () => {
    fetchCartCount();
  };

  return {
    cart,
    loading,
    itemCount,
    refreshCart,
    refreshCartCount,
  };
}; 