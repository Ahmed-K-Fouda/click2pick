import { NextRequest, NextResponse } from "next/server";
import { getMyCart, getCartItemCount } from "@/lib/actions/cart.actions";

export async function GET(request: NextRequest) {
  try {
    const cart = await getMyCart();
    const itemCount = await getCartItemCount();
    
    return NextResponse.json({ 
      cart, 
      itemCount 
    });
  } catch (error) {
    console.error("Error getting cart:", error);
    return NextResponse.json({ 
      cart: null, 
      itemCount: 0 
    });
  }
} 