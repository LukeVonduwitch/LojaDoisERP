
"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
  const router = useRouter();

  const handleLogout = () => {
    try {
      localStorage.removeItem('vestuario-auth');
    } catch (e) {
      console.error("Could not remove auth from localStorage", e);
    }
    router.push('/login');
  };

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
                 <SidebarMenuButton variant="outline" tooltip={{ children: "Sair", side: 'right', className: 'ml-2' }} onClick={handleLogout}>
                    <LogOut />
                    <span>Sair</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

export function AppHeader() {
  const { isMobile, toggleSidebar } = useSidebar();
  const [userName, setUserName] = useState("Usuário Padrão");
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    try {
      localStorage.removeItem('vestuario-auth');
    } catch (e) {
      console.error("Could not remove auth from localStorage", e);
    }
    router.push('/login');
  };

  useEffect(() => {
    setIsClient(true);
    
    const loadUserSettings = () => {
      try {
          const savedSettings = localStorage.getItem(SETTINGS_KEY);
          if (savedSettings) {
              const { userName: savedUserName, userAvatarPreview: savedAvatar } = JSON.parse(savedSettings);
              if (savedUserName) setUserName(savedUserName);
              if (savedAvatar) setUserAvatar(savedAvatar);
          } else {
              setUserName("Usuário Padrão");
              setUserAvatar(null);
          }
      } catch (e) {
        console.error("Failed to load user settings for header:", e);
        setUserName("Usuário Padrão");
        setUserAvatar(null);
      }
    };

    loadUserSettings();

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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar>
                    {isClient ? (
                    <>
                        <AvatarImage src={userAvatar || undefined} alt="Avatar do Usuário" data-ai-hint="user avatar" />
                        <AvatarFallback>{getInitials(userName)}</AvatarFallback>
                    </>
                    ) : (
                    <AvatarFallback>{getInitials("Usuário Padrão")}</AvatarFallback>
                    )}
                </Avatar>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{isClient ? userName : "Carregando..."}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                        Usuário do sistema
                    </p>
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push('/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Configurações</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
            </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
