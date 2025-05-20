
"use client";

import type { User, AuthContextType } from '@/types';
import React, { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { logoutUser as serverLogoutUser } from '@/actions/auth'; // For server-side cookie clearing
import { useToast } from '@/hooks/use-toast';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_USER_KEY = 'dinedash_user';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  const fetchCurrentUserCallback = useCallback(async () => {
    setIsLoading(true);
    try {
      const storedUser = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
      if (storedUser) {
        const parsedUser: User = JSON.parse(storedUser);
        // Basic validation, e.g. check if it has a role property
        if (parsedUser && parsedUser.role === 'manager') {
            setUser(parsedUser);
        } else {
            localStorage.removeItem(LOCAL_STORAGE_USER_KEY); // Clear invalid stored user
            setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error fetching current user from localStorage:", error);
      setUser(null);
      localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentUserCallback();
  }, [fetchCurrentUserCallback]);

  useEffect(() => {
    if (!isLoading) {
      if (!user && pathname !== '/login') {
        router.push('/login');
      } else if (user && pathname === '/login') {
        router.push('/orders');
      }
    }
  }, [user, isLoading, router, pathname]);

  const handleLogin = async (email?: string, password?: string): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);
    // Client-side check for hardcoded credentials
    if (email === 'manager@email.com' && password === 'password') {
      const managerUser: User = {
        id: 'manager-mock-id', // Mock ID
        email: 'manager@email.com',
        name: 'Default Manager',
        role: 'manager',
      };
      setUser(managerUser);
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(managerUser));
      toast({ title: "Login Successful", description: "Welcome, Manager!" });
      setIsLoading(false);
      // router.push('/orders'); // Let useEffect handle redirection
      return { success: true, message: "Login successful!" };
    } else {
      toast({ title: "Login Failed", description: "Invalid email or password.", variant: "destructive" });
      setIsLoading(false);
      return { success: false, message: "Invalid email or password." };
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    setUser(null);
    localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
    try {
        await serverLogoutUser(); // Attempt to clear server-side cookie as well
    } catch (error) {
        console.error("Error during server-side logout:", error);
        // Continue with client-side logout even if server logout fails
    }
    toast({ title: "Logged Out", description: "You have been successfully logged out." });
    router.push('/login');
    setIsLoading(false);
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
