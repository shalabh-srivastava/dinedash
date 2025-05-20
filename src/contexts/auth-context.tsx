
"use client";

import type { User, AuthContextType, AuthActionState } from '@/types'; // AuthActionState might be simplified
import React, { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { loginUser, logoutUser, getCurrentUser } from '@/actions/auth'; // signupUser removed
import { useToast } from '@/hooks/use-toast';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start as true
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  const fetchCurrentUserCallback = useCallback(async () => {
    // console.log("AuthContext: fetchCurrentUserCallback called");
    setIsLoading(true);
    try {
      const currentUser = await getCurrentUser();
      // console.log("AuthContext: currentUser from getCurrentUser:", currentUser);
      setUser(currentUser);
    } catch (error) {
      console.error("Error fetching current user:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
      // console.log("AuthContext: fetchCurrentUserCallback finished, isLoading:", false);
    }
  }, []);

  useEffect(() => {
    // console.log("AuthContext: Initial fetchCurrentUser on mount");
    fetchCurrentUserCallback();
  }, [fetchCurrentUserCallback]);

  useEffect(() => {
    // console.log("AuthContext: isLoading changed to", isLoading, "user is", user, "pathname is", pathname);
    if (!isLoading) {
      if (!user && pathname !== '/login') { // Removed '/signup'
        // console.log("AuthContext: Not loading, no user, not on login page. Redirecting to /login.");
        router.push('/login');
      } else if (user && pathname === '/login') { // If user is somehow on login page, redirect
        // console.log("AuthContext: User exists and on login page. Redirecting to /orders.");
        router.push('/orders');
      }
    }
  }, [user, isLoading, router, pathname]);


  const handleLogin = async (formData: FormData): Promise<AuthActionState> => {
    setIsLoading(true);
    const result = await loginUser({}, formData); // prevState is empty object
    
    if (result.type === 'success' && result.user) {
      setUser(result.user); // Set user immediately for quicker UI update
      toast({ title: "Login Successful", description: result.message });
      // No router.push here, useEffect above handles it after user state update
    } else if (result.type === 'error') {
      toast({ title: "Login Failed", description: result.message, variant: "destructive" });
    }
    setIsLoading(false);
    return result;
  };

  const handleLogout = async () => {
    setIsLoading(true);
    await logoutUser();
    setUser(null);
    toast({ title: "Logged Out", description: "You have been successfully logged out." });
    router.push('/login'); // Explicitly push to login after state update
    setIsLoading(false); // Set loading false after navigation
  };
  
  return (
    <AuthContext.Provider value={{ user, isLoading, login: handleLogin, logout: handleLogout, fetchCurrentUser: fetchCurrentUserCallback }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
