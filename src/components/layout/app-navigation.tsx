"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarHeader as ShadSidebarHeader,
  SidebarTrigger,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  LayoutDashboard,
  Boxes,
  Users,
  BarChart3,
  ShoppingCart,
  Settings,
  LogOut,
  MenuIcon,
} from 'lucide-react';
import { VestuarioLogo } from '@/components/icons/logo';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/components/ui/sidebar'; // Import useSidebar

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/stock', label: 'Stock', icon: Boxes },
  { href: '/customers', label: 'Customers', icon: Users },
  { href: '/sales', label: 'Sales Reporting', icon: BarChart3 },
  { href: '/purchases', label: 'Purchases', icon: ShoppingCart },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" variant="sidebar" side="left" className="border-r">
      <ShadSidebarHeader className="p-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <VestuarioLogo className="h-8 w-auto hidden group-data-[collapsible=icon]:hidden group-data-[state=expanded]:block" />
           <Boxes className="h-7 w-7 text-primary hidden group-data-[state=collapsed]:block group-data-[collapsible=icon]:block" />
        </Link>
        <div className="block md:hidden">
           <SidebarTrigger />
        </div>
      </ShadSidebarHeader>
      <SidebarContent className="flex-1 p-2">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))}
                tooltip={{ children: item.label, side: 'right', className: 'ml-2' }}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2 border-t">
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip={{ children: "Settings", side: 'right', className: 'ml-2' }}>
                    <Link href="/settings">
                        <Settings />
                        <span>Settings</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                 <SidebarMenuButton variant="outline" asChild tooltip={{ children: "Logout", side: 'right', className: 'ml-2' }}>
                    <button type="button" onClick={() => alert("Logout clicked")}> {/* Placeholder action */}
                        <LogOut />
                        <span>Logout</span>
                    </button>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

export function AppHeader() {
  const { isMobile, toggleSidebar } = useSidebar();
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
       {isMobile && (
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden">
          <MenuIcon className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      )}
      <div className="flex-1">
        <h1 className="text-lg font-semibold md:text-xl font-headline">
          {/* Dynamic title can be set here via context or props */}
        </h1>
      </div>
      <Avatar>
        <AvatarImage src="https://placehold.co/40x40.png" alt="User Avatar" data-ai-hint="user avatar" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    </header>
  );
}
