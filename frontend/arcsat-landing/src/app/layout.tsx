import './globals.css'import type { Metadata } from "next";

import { Inter } from 'next/font/google'import "./globals.css";

import { GeistProvider, CssBaseline } from '@geist-ui/core'

const geistSans = Geist({

const inter = Inter({ subsets: ['latin'] })  variable: "--font-geist-sans",

  subsets: ["latin"],

export const metadata = {});

  title: 'ArcSat - Gestão de Empresas',

  description: 'Sistema de gestão empresarial inteligente',const geistMono = Geist_Mono({

}  variable: "--font-geist-mono",

  subsets: ["latin"],

export default function RootLayout({});

  children,

}: {import type { Metadata } from "next";

  children: React.ReactNodeimport { GeistProvider, CssBaseline } from '@geist-ui/core'

}) {import "./globals.css";

  return (

    <html lang="pt-BR">export const metadata: Metadata = {

      <body className={inter.className}>  title: "ArcSat CRM - Gestão de Relacionamento com Cliente",

        <GeistProvider>  description: "Sistema de CRM integrado da Ávila Inc. Gerencie seus clientes, contatos e oportunidades de forma eficiente.",

          <CssBaseline />  keywords: "CRM, gestão de clientes, Ávila Inc, ArcSat, relacionamento com cliente",

          {children}};

        </GeistProvider>

      </body>export default function RootLayout({

    </html>  children,

  )}: Readonly<{

}  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        <GeistProvider>
          <CssBaseline />
          {children}
        </GeistProvider>
      </body>
    </html>
  );
}
