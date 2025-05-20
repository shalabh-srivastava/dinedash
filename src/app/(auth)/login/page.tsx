
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UtensilsCrossed, LogIn, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth-context";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, isLoading: authLoading, login } = useAuth();

  const [email, setEmail] = useState("manager@email.com");
  const [password, setPassword] = useState("password");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // AuthProvider's useEffect handles redirection if user is already logged in
    // or if auth state is still loading.
  }, [user, authLoading, router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    const result = await login(email, password); // Use login from AuthContext
    if (result.success) {
      // Redirection will be handled by AuthProvider's useEffect
    } else {
      // Toast is handled by AuthContext's login method
    }
    setIsSubmitting(false);
  };

  // If AuthProvider is loading or if user is already authenticated and not on login page, show loading.
  // AuthProvider will handle redirection if user is already authenticated.
  if (authLoading || (!authLoading && user)) {
    return <div className="flex items-center justify-center min-h-screen bg-background">Loading...</div>;
  }
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-muted p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <UtensilsCrossed className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold">Manager Login</CardTitle>
          <CardDescription>Log in to DineDash RMS.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                placeholder="manager@email.com" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                name="password" 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isSubmitting || authLoading}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogIn className="mr-2 h-5 w-5" />}
              Log In
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
