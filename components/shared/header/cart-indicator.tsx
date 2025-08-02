"use client";

import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";

const CartIndicator = () => {
  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
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

    fetchCartCount();
    
    // Set up interval to refresh cart count
    const interval = setInterval(fetchCartCount, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      <ShoppingCart className="w-6 h-6" />
      {itemCount > 0 && (
        <Badge 
          variant="destructive" 
          className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
        >
          {itemCount > 99 ? "99+" : itemCount}
        </Badge>
      )}
    </div>
  );
};

export default CartIndicator; 