
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { UtensilsCrossed, UserCog, Users } from "lucide-react";

export default function LoginPage() {
  const { login, user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.push("/orders"); // Redirect if already logged in
    }
  }, [user, isLoading, router]);

  if (isLoading || user) {
    // Show loading or nothing if redirecting
    return <div className="flex items-center justify-center min-h-screen bg-background">Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-muted p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <UtensilsCrossed className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold">Welcome to DineDash RMS</CardTitle>
          <CardDescription>Please select your role to continue.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Button
            onClick={() => login("manager", "Restaurant Manager")}
            className="w-full text-lg py-6"
            size="lg"
          >
            <UserCog className="mr-2 h-6 w-6" />
            Login as Manager
          </Button>
          <Button
            onClick={() => login("customer", "Valued Customer")}
            variant="secondary"
            className="w-full text-lg py-6"
            size="lg"
          >
            <Users className="mr-2 h-6 w-6" />
            Login as Customer
          </Button>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-muted-foreground text-center w-full">
            This is a demo application. No real credentials required.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
