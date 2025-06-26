
'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar, AppHeader } from '@/components/layout/app-navigation';
import { Skeleton } from '@/components/ui/skeleton';

function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    let isAuthenticated = false;
    try {
      isAuthenticated = localStorage.getItem('vestuario-auth') === 'true';
    } catch (e) {
      console.error("Could not access localStorage. Assuming unauthenticated.", e);
      isAuthenticated = false;
    }
    
    if (!isAuthenticated) {
      router.replace('/login');
    } else {
      setIsVerified(true);
    }
  }, [router]);

  if (!isVerified) {
    // Show a loading skeleton or a spinner while verifying auth
    return (
      <div className="flex min-h-screen">
        <div className="hidden md:block">
            <div className="h-svh w-[16rem] p-2">
                <Skeleton className="h-full w-full rounded-lg" />
            </div>
        </div>
        <div className="flex flex-col flex-1">
            <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background/80 px-4 md:px-6 backdrop-blur-sm">
                <div className="flex-1" />
                <Skeleton className="h-10 w-10 rounded-full" />
            </header>
            <main className="flex-1 p-6 md:p-8 lg:p-10">
                <div className="space-y-6">
                    <Skeleton className="h-8 w-1/3 rounded-lg" />
                    <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                        <Skeleton className="h-32 rounded-lg" />
                        <Skeleton className="h-32 rounded-lg" />
                        <Skeleton className="h-32 rounded-lg" />
                    </div>
                    <div className="mt-6">
                        <Skeleton className="h-96 rounded-lg" />
                    </div>
                </div>
            </main>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}


export default function AppShell({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthGuard>
      <SidebarProvider defaultOpen={true}>
          <AppSidebar />
          <SidebarInset>
            <div className="flex flex-col min-h-screen">
              <AppHeader />
              <main className="flex-1 p-6 md:p-8 lg:p-10 bg-background overflow-y-auto">
                {children}
              </main>
            </div>
          </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  );
}
