"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface SuccessMessageProps {
  itemCount: number;
  totalPrice: string;
}

const SuccessMessage = ({ itemCount, totalPrice }: SuccessMessageProps) => {
  return (
    <div className="max-w-md mx-auto mt-8">
      <Card className="border-2 border-green-200 bg-green-50">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-xl font-semibold text-green-800">
            Welcome! Your Cart is Ready
          </CardTitle>
          <CardDescription className="text-green-700">
            Your {itemCount} item{itemCount !== 1 ? 's' : ''} worth {totalPrice} have been saved to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-white p-4 rounded-lg border border-green-200">
            <h3 className="font-medium text-green-900 mb-2">
              What happens next?
            </h3>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• Your cart items are now linked to your account</li>
              <li>• You can continue shopping or proceed to checkout</li>
              <li>• Your cart will be saved for future visits</li>
              <li>• Enjoy secure checkout and order tracking</li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <Button 
              asChild 
              className="w-full bg-green-600 hover:bg-green-700"
            >
              <Link href="/shipping-address">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Proceed to Checkout
              </Link>
            </Button>
            
            <Button 
              asChild 
              variant="outline" 
              className="w-full"
            >
              <Link href="/">
                Continue Shopping
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SuccessMessage; 