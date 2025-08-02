"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Protected routes that require authentication
  const protectedRoutes = [
    "/shipping-address",
    "/checkout",
    "/orders",
    "/profile",
    "/payment-method",
    "/place-order",
  ];

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  useEffect(() => {
    const checkAuth = async () => {
      if (!isProtectedRoute) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/auth/check");
        const data = await response.json();

        if (!data.authenticated) {
          router.push(`/sign-in?callbackUrl=${pathname}`);
          return;
        }

        setIsAuthenticated(true);
      } catch (error) {
        console.error("Auth check failed:", error);
        router.push(`/sign-in?callbackUrl=${pathname}`);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [pathname, router, isProtectedRoute]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (isProtectedRoute && !isAuthenticated) {
    return null; // Will redirect to sign-in
  }

  return <>{children}</>;
};

export default AuthGuard; 