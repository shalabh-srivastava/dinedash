
"use client"; 

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';

export default function HomePage() {
  const router = useRouter();
  const { user, isLoading, fetchCurrentUser } = useAuth();

  useEffect(() => {
    // Ensure fetchCurrentUser is called if not already initiated by AuthProvider
    // This handles cases where HomePage might load before AuthProvider finishes its initial fetch
    if (isLoading === undefined || isLoading) { // isLoading might be initially undefined or true
        fetchCurrentUser();
    }
  }, [fetchCurrentUser, isLoading]);


  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.replace('/orders'); 
      } else {
        router.replace('/login'); 
      }
    }
  }, [user, isLoading, router]);

  return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
}
