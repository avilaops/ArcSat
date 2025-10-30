import "./globals.css"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "ArcSat - Gestão de Empresas",
  description: "Sistema de gestão empresarial inteligente",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
