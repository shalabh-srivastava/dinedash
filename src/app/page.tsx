
"use client"; // For using useRouter or redirect in a client component context

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';

export default function HomePage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.replace('/orders'); // If logged in, go to orders
      } else {
        router.replace('/login'); // If not logged in, go to login
      }
    }
  }, [user, isLoading, router]);

  // Render a loading state or null while checking auth and redirecting
  return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
}
