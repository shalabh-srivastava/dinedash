
"use client";

import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarTrigger,
  SidebarContent,
  SidebarInset,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { SidebarNav, type NavItem } from '@/components/sidebar-nav';
import { ClipboardList, BookOpenText, LineChart, UtensilsCrossed, LogOut, UserCircle, MessageSquareText } from 'lucide-react';

const baseNavItems: NavItem[] = [
  { href: '/orders', label: 'Orders', icon: ClipboardList, matchExact: true },
  { href: '/menu', label: 'Menu', icon: BookOpenText, matchExact: true },
  { href: '/feedback', label: 'Feedback', icon: MessageSquareText, matchExact: true },
];

const managerNavItems: NavItem[] = [
  ...baseNavItems,
  { href: '/analytics', label: 'Analytics', icon: LineChart, matchExact: true },
];

export default function AppLayout({ children }: { children: ReactNode }) {
  const [currentYear, setCurrentYear] = useState<number | null>(null);
  const { user, isLoading, logout, fetchCurrentUser } = useAuth();
  const router = useRouter(); // Keep for logout if needed, but AuthContext handles most redirects
  const pathname = usePathname();

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  useEffect(() => {
    // If AuthProvider is loading and hasn't determined user, try to fetch.
    // This is crucial if landing directly on an app page (e.g., after refresh or bookmark).
    if (isLoading && user === null) {
        // console.log("AppLayout: Initial fetchCurrentUser due to isLoading and no user");
        fetchCurrentUser();
    }
  }, [isLoading, user, fetchCurrentUser]);

  // Primary guard: Show loading if auth state is being determined.
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading Dashboard...</div>;
  }
  
  // If not loading and no user, AuthContext should have redirected to /login.
  // This state implies we are on an authenticated route without a user, which is an issue.
  // However, AuthProvider's useEffects are primarily responsible for redirection.
  // This can serve as a fallback UI if redirection is somehow delayed.
  if (!user) {
    // console.log("AppLayout: No user and not loading. AuthContext should redirect. Showing fallback.");
    return <div className="flex items-center justify-center min-h-screen">Access Denied. Redirecting to login...</div>;
  }
  
  // If user exists, render the app layout with sidebar and children
  const navItemsToDisplay = user.role === 'manager' ? managerNavItems : baseNavItems;

  return (
    <SidebarProvider defaultOpen>
      <Sidebar variant="sidebar" collapsible="icon">
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
            <UtensilsCrossed className="h-7 w-7 text-primary" />
            <span className="text-xl font-semibold group-data-[collapsible=icon]:hidden">
              DineDash
            </span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarNav navItems={navItemsToDisplay} />
        </SidebarContent>
        <SidebarFooter className="p-4 mt-auto">
            <div className="text-xs text-muted-foreground group-data-[collapsible=icon]:hidden mb-2">
            {user && (
              <div className="flex items-center space-x-2 mb-2">
                <UserCircle className="h-5 w-5"/>
                <span>{user.name} ({user.role})</span>
              </div>
            )}
            {currentYear !== null ? `© ${currentYear} DineDash RMS` : '© DineDash RMS'}
          </div>
          <Button variant="outline" size="sm" onClick={logout} className="w-full group-data-[collapsible=icon]:hidden">
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
            <Button variant="ghost" size="icon" onClick={logout} className="hidden group-data-[collapsible=icon]:flex justify-center w-full">
            <LogOut className="h-5 w-5" />
          </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="min-h-screen">
        <div className="p-4 md:p-6">
            <div className="flex items-center justify-between md:justify-end mb-4">
                  <SidebarTrigger className="md:hidden" />
                  {/* User Profile / Settings can go here */}
            </div>
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
