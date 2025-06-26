
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
  Settings,
  LogOut,
  MenuIcon,
  Plug,
} from 'lucide-react';
import { VestuarioLogo } from '@/components/icons/logo';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/components/ui/sidebar';
import { useEffect, useState } from 'react';

const navItems = [
  { href: '/', label: 'Painel', icon: LayoutDashboard },
  { href: '/stock', label: 'Estoque', icon: Boxes },
  { href: '/clientes', label: 'Clientes', icon: Users },
];

const settingsItems = [
  { href: '/api-settings', label: 'API', icon: Plug },
  { href: '/settings', label: 'Configurações', icon: Settings },
];

const SETTINGS_KEY = 'vestuario-erp-app-settings';

const getInitials = (name: string) => {
    if (!name) return "UP"; // Usuário Padrão
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
};

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
            {settingsItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton 
                        asChild 
                        isActive={pathname === item.href}
                        tooltip={{ children: item.label, side: 'right', className: 'ml-2' }}>
                        <Link href={item.href}>
                            <item.icon />
                            <span>{item.label}</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            ))}
            <SidebarMenuItem>
                 <SidebarMenuButton variant="outline" asChild tooltip={{ children: "Sair", side: 'right', className: 'ml-2' }}>
                    <button type="button" onClick={() => alert("Sair clicado")}>
                        <LogOut />
                        <span>Sair</span>
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
  const [userName, setUserName] = useState("Usuário");
  const [userAvatar, setUserAvatar] = useState<string | null>(null);

  const loadUserSettings = () => {
    try {
        const savedSettings = localStorage.getItem(SETTINGS_KEY);
        if (savedSettings) {
            const { userName: savedUserName, userAvatarPreview: savedAvatar } = JSON.parse(savedSettings);
            if (savedUserName) setUserName(savedUserName);
            if (savedAvatar) setUserAvatar(savedAvatar);
        } else {
            setUserName("Usuário");
            setUserAvatar(null);
        }
    } catch (e) {
      console.error("Failed to load user settings for header:", e);
      setUserName("Usuário");
      setUserAvatar(null);
    }
  };

  useEffect(() => {
    loadUserSettings();

    // Listen for changes from other tabs/windows
    window.addEventListener('storage', loadUserSettings);

    return () => {
      window.removeEventListener('storage', loadUserSettings);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
       {isMobile && (
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden">
          <MenuIcon className="h-6 w-6" />
          <span className="sr-only">Alternar Menu</span>
        </Button>
      )}
      <div className="flex-1">
        <h1 className="text-lg font-semibold md:text-xl font-headline">
        </h1>
      </div>
      <Avatar>
        <AvatarImage src={userAvatar || undefined} alt="Avatar do Usuário" data-ai-hint="user avatar" />
        <AvatarFallback>{getInitials(userName)}</AvatarFallback>
      </Avatar>
    </header>
  );
}
