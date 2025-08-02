import { NextRequest, NextResponse } from "next/server";
import { getCartItemCount } from "@/lib/actions/cart.actions";

export async function GET(request: NextRequest) {
  try {
    const count = await getCartItemCount();
    
    return NextResponse.json({ count });
  } catch (error) {
    console.error("Error getting cart count:", error);
    return NextResponse.json({ count: 0 });
  }
} 