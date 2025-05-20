
"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signupUser } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UtensilsCrossed, UserPlus, LogIn } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth-context";


export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, isLoading: authLoading, fetchCurrentUser } = useAuth();

  const initialState = { message: '', type: '', errors: {} as any, user: undefined };
  const [state, formAction, isPending] = useActionState(signupUser, initialState);

  useEffect(() => {
    // If user is already loaded and present (e.g., navigating back to /signup), redirect
    if (!authLoading && user) {
      router.push("/orders");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (state.type === 'success' && state.user) {
      toast({
        title: "Signup Successful",
        description: state.message || "Refreshing session...",
      });
      // Prompt AuthProvider to recognize the new session
      fetchCurrentUser();
      // AuthProvider's useEffect will handle redirecting from /signup to /orders
    } else if (state.type === 'error' && state.message) {
      toast({
        title: "Signup Failed",
        description: state.message,
        variant: "destructive",
      });
    }
  }, [state, toast, fetchCurrentUser]); // fetchCurrentUser added

  if (authLoading || user) { // If auth is still loading or user exists, show loading
    return <div className="flex items-center justify-center min-h-screen bg-background">Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-muted p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <UtensilsCrossed className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold">Create Account</CardTitle>
          <CardDescription>Sign up to manage your restaurant with DineDash.</CardDescription>
        </CardHeader>
        <form action={formAction}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" placeholder="Priya Sharma" required />
              {state.errors?.name && <p className="text-xs text-destructive mt-1">{state.errors.name[0]}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="manager@example.com" required />
              {state.errors?.email && <p className="text-xs text-destructive mt-1">{state.errors.email[0]}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
              {state.errors?.password && <p className="text-xs text-destructive mt-1">{state.errors.password[0]}</p>}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
             <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? <LogIn className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-5 w-5" />}
                Sign Up
            </Button>
             <p className="text-xs text-muted-foreground text-center">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-primary hover:underline">
                Log In
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
