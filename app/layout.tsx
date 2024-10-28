import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import './globals.css';

import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { Nav } from "@/components/layout/nav";
import { Sidebar } from "@/components/sidebar";
import { AuthProvider } from "@/components/auth/auth-provider";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Jewish Network State',
  description: 'A digital platform fostering connection, learning, and growth within the global Jewish community.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <Nav />
            <div className="flex min-h-[calc(100vh-3.5rem)]">
              <Sidebar />
              <main className="flex-1">
                {children}
              </main>
            </div>
          </AuthProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}