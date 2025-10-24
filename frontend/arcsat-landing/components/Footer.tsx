"use client"

export default function Footer() {
  const footerLinks = {
    produto: [
      { name: "Funcionalidades", href: "#features" },
      { name: "Integrações", href: "#integrations" },
      { name: "Segurança", href: "#security" },
      { name: "Roadmap", href: "#roadmap" },
      { name: "Changelog", href: "/docs/changelog" }
    ],
    empresa: [
      { name: "Sobre a Ávila Ops", href: "https://avilaops.com" },
      { name: "Casos de Uso", href: "#cases" },
      { name: "Blog", href: "/blog" },
      { name: "Carreiras", href: "/careers" },
      { name: "Contato", href: "#contact" }
    ],
    desenvolvedores: [
      { name: "Documentação", href: "/docs" },
      { name: "API Reference", href: "/docs/api" },
      { name: "Webhooks", href: "/docs/webhooks" },
      { name: "SDKs", href: "/docs/sdks" },
      { name: "Status", href: "https://status.arcsat.com.br" }
    ],
    legal: [
      { name: "Privacidade", href: "/privacy" },
      { name: "Termos de Uso", href: "/terms" },
      { name: "SLA", href: "/sla" },
      { name: "LGPD", href: "/lgpd" },
      { name: "Cookies", href: "/cookies" }
    ]
  }

  const socialLinks = [
    {
      name: "GitHub",
      href: "https://github.com/avilaops",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      )
    },
    {
      name: "LinkedIn",
      href: "https://linkedin.com/company/avilaops",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      )
    },
    {
      name: "YouTube",
      href: "https://youtube.com/@avilaops",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      )
    },
    {
      name: "Twitter",
      href: "https://twitter.com/avilaops",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      )
    }
  ]

  return (
    <footer className="relative bg-[#0B0F17] border-t border-white/5">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
      
      <div className="relative z-10 container mx-auto px-6 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-16">
          {/* Logo & Description */}
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0077FF] to-[#00E0FF] flex items-center justify-center">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-white to-[#F5F9FF]/60 bg-clip-text text-transparent">
                ArcSat
              </span>
            </div>
            <p className="text-[#F5F9FF]/60 leading-relaxed mb-6">
              CRM corporativo de alta performance desenvolvido pela Ávila Ops. 
              Automação, integrações e inteligência para escalar suas operações.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center text-[#F5F9FF]/60 hover:text-[#00E0FF] hover:border-[#00E0FF]/30 hover:bg-white/10 transition-all duration-300"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="text-white font-semibold mb-4">Produto</h4>
            <ul className="space-y-3">
              {footerLinks.produto.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-[#F5F9FF]/60 hover:text-[#00E0FF] transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Empresa</h4>
            <ul className="space-y-3">
              {footerLinks.empresa.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-[#F5F9FF]/60 hover:text-[#00E0FF] transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Desenvolvedores</h4>
            <ul className="space-y-3">
              {footerLinks.desenvolvedores.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-[#F5F9FF]/60 hover:text-[#00E0FF] transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-[#F5F9FF]/60 hover:text-[#00E0FF] transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="mb-16 p-8 rounded-2xl bg-white/[0.02] backdrop-blur-xl border border-white/5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Fique por dentro</h3>
              <p className="text-[#F5F9FF]/60">Receba atualizações sobre novas features e melhorias.</p>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <input
                type="email"
                placeholder="seu@email.com"
                className="px-4 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg text-white placeholder:text-[#F5F9FF]/40 focus:outline-none focus:border-[#0077FF]/50 focus:bg-white/10 transition-all duration-300 flex-1 md:w-64"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-[#0077FF] to-[#00E0FF] rounded-lg font-semibold shadow-[0_0_30px_rgba(0,119,255,0.3)] hover:shadow-[0_0_50px_rgba(0,119,255,0.5)] transition-all duration-300 hover:scale-105 whitespace-nowrap">
                Inscrever
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-6 text-sm text-[#F5F9FF]/60">
              <span>© 2024 Ávila Ops. Todos os direitos reservados.</span>
              <span className="hidden md:inline">•</span>
              <a href="https://avilaops.com" className="hover:text-[#00E0FF] transition-colors">
                avilaops.com
              </a>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[#F5F9FF]/60">Todos os sistemas operacionais</span>
              </div>
              
              <a 
                href="https://status.arcsat.com.br" 
                className="text-sm text-[#F5F9FF]/60 hover:text-[#00E0FF] transition-colors"
              >
                Status →
              </a>
            </div>
          </div>
        </div>

        {/* Made with love badge */}
        <div className="mt-8 text-center">
          <p className="text-sm text-[#F5F9FF]/40">
            Desenvolvido com{" "}
            <span className="text-red-500 animate-pulse">♥</span>
            {" "}pela equipe{" "}
            <a 
              href="https://avilaops.com" 
              className="text-[#00E0FF] hover:underline font-semibold"
            >
              Ávila Ops
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
