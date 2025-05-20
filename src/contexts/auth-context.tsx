
"use client";

import type { User, AuthContextType } from '@/types';
import React, { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { loginUser, logoutUser, signupUser, getCurrentUser } from '@/actions/auth';
import { useToast } from '@/hooks/use-toast';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  const fetchCurrentUserCallback = useCallback(async () => {
    setIsLoading(true);
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error("Error fetching current user:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentUserCallback();
  }, [fetchCurrentUserCallback]);

  useEffect(() => {
    if (!isLoading && !user && !['/login', '/signup'].includes(pathname)) {
      router.push('/login');
    }
  }, [user, isLoading, router, pathname]);


  const handleLogin = async (formData: FormData) => {
    setIsLoading(true);
    const result = await loginUser({}, formData);
    setIsLoading(false);
    if (result.type === 'success' && result.user) {
      setUser(result.user);
      toast({ title: "Login Successful", description: result.message });
      router.push('/orders');
    } else {
      toast({ title: "Login Failed", description: result.message, variant: "destructive" });
    }
    return result;
  };

  const handleSignup = async (formData: FormData) => {
    setIsLoading(true);
    const result = await signupUser({}, formData);
    setIsLoading(false);
    if (result.type === 'success' && result.user) {
      setUser(result.user);
      toast({ title: "Signup Successful", description: result.message });
      router.push('/orders');
    } else {
      toast({ title: "Signup Failed", description: result.message, variant: "destructive" });
    }
    return result;
  };

  const handleLogout = async () => {
    setIsLoading(true);
    await logoutUser();
    setUser(null);
    setIsLoading(false);
    toast({ title: "Logged Out", description: "You have been successfully logged out." });
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login: handleLogin, logout: handleLogout, signup: handleSignup, fetchCurrentUser: fetchCurrentUserCallback }}>
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
