"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, User, Lock } from "lucide-react";
import Link from "next/link";

interface AuthPromptProps {
  itemCount: number;
  totalPrice: string;
}

const AuthPrompt = ({ itemCount, totalPrice }: AuthPromptProps) => {
  return (
    <div className="max-w-md mx-auto mt-8">
      <Card className="border-2 border-dashed border-gray-300">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full">
            <Lock className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle className="text-xl font-semibold">
            Complete Your Purchase
          </CardTitle>
          <CardDescription>
            You have {itemCount} item{itemCount !== 1 ? 's' : ''} in your cart worth {totalPrice}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">
              Why create an account?
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Secure checkout and order tracking</li>
              <li>• Save your cart items for later</li>
              <li>• Faster checkout on future purchases</li>
              <li>• Exclusive member benefits</li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <Button 
              asChild 
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <Link href="/sign-up">
                <User className="w-4 h-4 mr-2" />
                Create Account & Continue
              </Link>
            </Button>
            
            <Button 
              asChild 
              variant="outline" 
              className="w-full"
            >
              <Link href="/sign-in">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Sign In & Continue
              </Link>
            </Button>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-500">
              Your cart items will be saved and linked to your account
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPrompt; 