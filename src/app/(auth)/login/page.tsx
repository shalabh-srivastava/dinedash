
"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UtensilsCrossed, LogIn } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth-context";


export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, isLoading: authLoading, fetchCurrentUser } = useAuth();

  const initialState = { message: '', type: '' as const, errors: {} as any, user: undefined };
  const [state, formAction, isPending] = useActionState(loginUser, initialState);


  useEffect(() => {
    // If user is already authenticated (e.g., due to existing session or after login)
    // and AuthProvider is not loading, AuthProvider's useEffect should redirect from /login.
    // This is a secondary check.
    if (!authLoading && user) {
      // console.log("LoginPage: User already authenticated, AuthProvider should redirect from /login.");
      // router.push("/orders"); // AuthProvider should handle this.
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (state.type === 'success' && state.user) {
      toast({
        title: "Login Successful",
        description: state.message || "Refreshing session...",
      });
      // After successful server action, prompt AuthContext to refresh current user state.
      // AuthProvider's useEffect will then handle redirecting from /login to /orders.
      fetchCurrentUser(); 
    } else if (state.type === 'error' && state.message) {
      toast({
        title: "Login Failed",
        description: state.message,
        variant: "destructive",
      });
    }
  }, [state, toast, fetchCurrentUser]); // Removed router from dependencies

  // If AuthProvider is loading or if user is already authenticated, show loading.
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
        <form action={formAction}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="manager@email.com" required defaultValue="manager@email.com" />
               {state.errors?.email && <p className="text-xs text-destructive mt-1">{state.errors.email[0]}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required defaultValue="password" />
              {state.errors?.password && <p className="text-xs text-destructive mt-1">{state.errors.password[0]}</p>}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isPending || authLoading}>
              {isPending ? <LogIn className="mr-2 h-4 w-4 animate-spin" /> : <LogIn className="mr-2 h-5 w-5" />}
              Log In
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
