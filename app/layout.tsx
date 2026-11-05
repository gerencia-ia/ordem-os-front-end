import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { ProveedorTema } from '@/components/provedor-tema';
import './globals.css';
import type React from 'react';

const geist = Geist({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'OSControl - Ordem de Serviço',
  description: 'Sistema profissional de gerenciamento de ordens de serviço',
  generator: 'v0.app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${geist.className} antialiased`}>
        <ProveedorTema>{children}</ProveedorTema>
        <Analytics />
      </body>
    </html>
  );
}
