
"use client";

import type { UserRole, User, AuthContextType } from '@/types';
import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation'; // Corrected import

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Try to load user from localStorage on initial mount
    try {
      const storedUser = localStorage.getItem('dineDashUser');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Error loading user from localStorage:", error);
      localStorage.removeItem('dineDashUser'); // Clear corrupted data
    }
    setIsLoading(false);
  }, []);

  const login = (role: UserRole, name: string = role === 'manager' ? 'Manager' : 'Customer') => {
    const newUser: User = { id: `user-${Date.now()}`, name, role };
    setUser(newUser);
    try {
      localStorage.setItem('dineDashUser', JSON.stringify(newUser));
    } catch (error) {
      console.error("Error saving user to localStorage:", error);
    }
    router.push('/orders'); // Redirect after login
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem('dineDashUser');
    } catch (error) {
      console.error("Error removing user from localStorage:", error);
    }
    router.push('/login'); // Redirect to login after logout
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
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
