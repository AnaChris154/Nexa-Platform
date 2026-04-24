'use client';

import { Geist, Geist_Mono } from 'next/font/google';
import '@/styles/globals.css';
import { AuthProvider } from '@/app/contexts/AuthContext';
import { SidebarProvider } from '@/app/contexts/SidebarContext';

const geist = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="bg-[hsl(220_20%_98%)]">
      <body className={`${geist.variable} ${geistMono.variable} font-sans antialiased bg-[hsl(220_20%_98%)]`}>
        <AuthProvider>
          <SidebarProvider>{children}</SidebarProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
