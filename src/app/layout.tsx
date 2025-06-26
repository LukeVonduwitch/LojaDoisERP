
'use client';

import { usePathname } from 'next/navigation';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from '@/components/theme-provider';
import AppShell from '@/components/layout/app-shell';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <title>Vestuário ERP</title>
        <meta name="description" content="Gerencie seu negócio de moda com o Vestuário ERP" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const settings = localStorage.getItem('vestuario-erp-app-settings');
                  if (!settings) {
                    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                      document.documentElement.classList.add('dark');
                    }
                    return;
                  }
                  const { theme } = JSON.parse(settings);
                  if (theme === 'system') {
                    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                      document.documentElement.classList.add('dark');
                    }
                  } else if (theme && theme !== 'light') {
                     document.documentElement.classList.add(theme);
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider>
          {isLoginPage ? (
            <>{children}</>
          ) : (
            <AppShell>{children}</AppShell>
          )}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
