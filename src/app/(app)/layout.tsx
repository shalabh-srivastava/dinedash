import type { ReactNode } from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarTrigger,
  SidebarContent,
  SidebarInset,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { SidebarNav, type NavItem } from '@/components/sidebar-nav';
import { ClipboardList, BookOpenText, LineChart, UtensilsCrossed } from 'lucide-react';

const navItems: NavItem[] = [
  { href: '/orders', label: 'Orders', icon: ClipboardList, matchExact: true },
  { href: '/menu', label: 'Menu', icon: BookOpenText, matchExact: true },
  { href: '/analytics', label: 'Analytics', icon: LineChart, matchExact: true },
];

export default function AppLayout({ children }: { children: ReactNode }) {
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
          <SidebarNav navItems={navItems} />
        </SidebarContent>
        <SidebarFooter className="p-4 mt-auto">
           <div className="text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
            © {new Date().getFullYear()} DineDash RMS
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="min-h-screen">
        <div className="p-4 md:p-6">
            <div className="flex items-center justify-between md:justify-end mb-4">
                 <SidebarTrigger className="md:hidden" />
                 {/* Future User Profile / Settings can go here */}
            </div>
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
