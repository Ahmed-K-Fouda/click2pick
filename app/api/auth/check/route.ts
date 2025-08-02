import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET(request: NextRequest) {
  const session = await auth();
  
  if (!session?.user?.id) {
    return NextResponse.json({ 
      authenticated: false, 
      redirect: "/sign-in" 
    });
  }
  
  return NextResponse.json({ 
    authenticated: true, 
    user: session.user 
  });
} 