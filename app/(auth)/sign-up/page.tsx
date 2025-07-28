import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { APP_NAME } from "@/lib/constants";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import SignUpForm from "./sign-up-form";
export const metadata: Metadata = {
  title: "Sign Up",
};

interface IProps {
  searchParams: Promise<{ callbackUrl: string }>;
}

const SignUpPage = async ({ searchParams }: IProps) => {
  const { callbackUrl } = await searchParams;

  const session = await auth();
  if (session) {
    redirect(callbackUrl || "/");
  }
  return (
    <div className="w-full max-w-md mx-auto">
      <Card>
        <CardHeader className="space-y-4">
          <Link href="/" className="flex-center">
            <Image
              src="/images/logo.svg"
              width={100}
              height={100}
              alt={`${APP_NAME} Logo`}
              priority
            />
          </Link>
          <CardTitle className="text-center">
            Create Account<span className="animate-pulse">!</span>
          </CardTitle>
          <CardDescription className="text-center">
            Enter your information below to sign up
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SignUpForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUpPage;
