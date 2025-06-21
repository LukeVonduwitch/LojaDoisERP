
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar, AppHeader } from '@/components/layout/app-navigation';

export const metadata: Metadata = {
  title: 'Vestuário ERP',
  description: 'Gerencie seu negócio de moda com o Vestuário ERP',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
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
          <Toaster />
        </SidebarProvider>
      </body>
    </html>
  );
}

    