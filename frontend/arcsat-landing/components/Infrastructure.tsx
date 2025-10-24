"use client"

export default function Infrastructure() {
  const techStack = [
    {
      name: "Azure",
      description: "Cloud computing, Static Web Apps, Functions",
      logo: (
        <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
          <path d="M22.379 23.343a1.62 1.62 0 0 0 1.536-2.14v.002L17.35 1.76A1.62 1.62 0 0 0 15.816.657H8.184A1.62 1.62 0 0 0 6.65 1.76L.086 21.204a1.62 1.62 0 0 0 1.536 2.139h4.741a1.62 1.62 0 0 0 1.535-1.103l.997-2.85h6.21l.997 2.85a1.62 1.62 0 0 0 1.535 1.103h4.741zM12 4.594l3.886 11.175H8.114L12 4.594z"/>
        </svg>
      ),
      gradient: "from-[#0078D4] to-[#00BCF2]"
    },
    {
      name: "MongoDB",
      description: "NoSQL database, Atlas, serverless",
      logo: (
        <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.193 9.555c-1.264-5.58-4.252-7.414-4.573-8.115-.28-.394-.53-.954-.735-1.44-.036.495-.055.685-.523 1.184-.723.566-4.438 3.682-4.74 10.02-.282 5.912 4.27 9.435 4.888 9.884l.07.05A73.49 73.49 0 0111.91 24h.481c.114-1.032.284-2.056.51-3.07.417-.296 4.912-3.572 4.292-11.375z"/>
        </svg>
      ),
      gradient: "from-[#00ED64] to-[#00AA46]"
    },
    {
      name: "Next.js",
      description: "React framework, SSR, Static Generation",
      logo: (
        <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.572 0c-.176 0-.31.001-.358.007a19.76 19.76 0 0 1-.364.033C7.443.346 4.25 2.185 2.228 5.012a11.875 11.875 0 0 0-2.119 5.243c-.096.659-.108.854-.108 1.747s.012 1.089.108 1.748c.652 4.506 3.86 8.292 8.209 9.695.779.25 1.6.422 2.534.525.363.04 1.935.04 2.299 0 1.611-.178 2.977-.577 4.323-1.264.207-.106.247-.134.219-.158-.02-.013-.9-1.193-1.955-2.62l-1.919-2.592-2.404-3.558a338.739 338.739 0 0 0-2.422-3.556c-.009-.002-.018 1.579-.023 3.51-.007 3.38-.01 3.515-.052 3.595a.426.426 0 0 1-.206.214c-.075.037-.14.044-.495.044H7.81l-.108-.068a.438.438 0 0 1-.157-.171l-.049-.106.005-4.703.007-4.705.072-.092a.645.645 0 0 1 .174-.143c.096-.047.134-.051.54-.051.478 0 .558.018.682.154.035.038 1.337 2 2.895 4.361a10760.433 10760.433 0 0 0 4.735 7.17l1.9 2.879.096-.063a12.317 12.317 0 0 0 2.466-2.163 11.944 11.944 0 0 0 2.824-6.134c.096-.66.108-.854.108-1.748 0-.893-.012-1.088-.108-1.747-.652-4.506-3.859-8.292-8.208-9.695a12.597 12.597 0 0 0-2.499-.523A33.119 33.119 0 0 0 11.573 0zm4.069 7.217c.347 0 .408.005.486.047a.473.473 0 0 1 .237.277c.018.06.023 1.365.018 4.304l-.006 4.218-.744-1.14-.746-1.14v-3.066c0-1.982.01-3.097.023-3.15a.478.478 0 0 1 .233-.296c.096-.05.13-.054.5-.054z"/>
        </svg>
      ),
      gradient: "from-white to-[#F5F9FF]/60"
    },
    {
      name: "TypeScript",
      description: "Type-safe development, IntelliSense",
      logo: (
        <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
          <path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z"/>
        </svg>
      ),
      gradient: "from-[#3178C6] to-[#235A97]"
    },
    {
      name: "Cloudflare",
      description: "CDN, DNS, DDoS protection",
      logo: (
        <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16.5088 16.8447c.1475-.5068.0908-.9355-.1553-1.3691-.2471-.4316-.6699-.7158-1.1943-.793l-9.5508-.9707c-.0781-.0078-.1357-.0664-.1777-.1318a.262.262 0 0 1-.0215-.2012l.0664-.2715c.0908-.3731.4668-.6328.8652-.5977l9.5469.9697c.0879 0 .1572-.0664.1777-.1562 0-.0068 0-.0078.0059-.0088l.7031-2.8838c.0352-.1406.0137-.2881-.0635-.4043a.8105.8105 0 0 0-.3379-.3076c-1.0967-.5625-2.5537-.8965-4.2236-.8965-4.874 0-8.9648 2.6094-9.4932 6.0088v.0059a3.5574 3.5574 0 0 0-.0352.5068c0 .2383.0264.4707.0664.6963l.0527.2246.0254.0986.0273.0967c.2637 1.0957 1.332 1.9238 2.6113 1.9238l10.1016.0098c.0781.0068.1494-.0312.1953-.0967a.281.281 0 0 0 .0498-.2031zm6.9473-3.5156-.0391-.1621c-.7031-2.9346-3.1328-5.1084-6.0449-5.1084h-.7539c-1.2539 0-2.373-.8037-2.7197-1.9531l-.0215-.0723c-.0625-.207-.1348-.4287-.2129-.668C13.0908 3.5547 11.2441.5 7.8945.5c-2.4492 0-4.623 1.3623-5.6211 3.4863l-.082.1768c-.1172.2617-.0352.5664.1914.7109.2266.1445.5254.0918.6992-.1211l.0508-.0664c.7266-.8965 1.8086-1.4141 2.959-1.4141 2.123 0 3.9697 1.5527 4.4043 3.7041.0918.457.1865.8076.2852 1.0537.5195 1.2988 1.627 2.2715 2.9775 2.6123a4.2095 4.2095 0 0 1 .7363.2256c.5137.1689.9219.4688 1.1934.8643.2656.3868.3691.8496.2881 1.3096l-.0078.0381a.1722.1722 0 0 0 .084.1777.1672.1672 0 0 0 .1885 0l.6758-.3232a5.8755 5.8755 0 0 1 2.5654-.5918h.3662c2.0527 0 3.8604 1.4512 4.2324 3.3984l.0371.1934c.0254.1348.1396.2324.2725.2324h1.1484c.8086 0 1.5156-.543 1.709-1.3145a4.5183 4.5183 0 0 0 .1406-.9697c-.002-.209-.0156-.4258-.0527-.6406z"/>
        </svg>
      ),
      gradient: "from-[#F38020] to-[#F6821F]"
    },
    {
      name: "Auth0",
      description: "Authentication, authorization, SSO",
      logo: (
        <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
          <path d="M21.98 7.448L19.62 0H4.347L2.02 7.448c-1.352 4.312.03 9.206 3.815 12.015L12.007 24l6.157-4.537c3.755-2.81 5.182-7.688 3.815-12.015zM12 13.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z"/>
        </svg>
      ),
      gradient: "from-[#EB5424] to-[#D94F1C]"
    }
  ]

  return (
    <section className="relative py-32 px-6 bg-gradient-to-b from-[#0B0F17] via-[#0B0F17]/98 to-[#0B0F17]">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(0, 119, 255, 0.15) 1px, transparent 0)`,
          backgroundSize: '48px 48px'
        }} />
      </div>

      <div className="relative z-10 container mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 mb-6">
            <span className="text-sm font-medium text-[#00E0FF]">Infraestrutura</span>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white to-[#F5F9FF]/60 bg-clip-text text-transparent">
              Tecnologia Enterprise
            </span>
          </h2>
          
          <p className="text-xl text-[#F5F9FF]/60 max-w-3xl mx-auto">
            Construída sobre as melhores plataformas e frameworks do mercado,<br />
            garantindo escalabilidade, segurança e performance.
          </p>
        </div>

        {/* Tech Stack Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-7xl mx-auto mb-20">
          {techStack.map((tech, index) => (
            <div
              key={index}
              className="group relative p-6 rounded-2xl bg-white/[0.02] backdrop-blur-xl border border-white/5 hover:border-[#0077FF]/30 transition-all duration-500 hover:bg-white/[0.05] flex flex-col items-center text-center"
            >
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-xl" style={{
                backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))`
              }} />
              
              <div className="relative z-10">
                {/* Logo */}
                <div className={`mb-4 bg-gradient-to-br ${tech.gradient} bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-500`}>
                  {tech.logo}
                </div>

                {/* Name */}
                <h3 className="text-lg font-semibold mb-2 text-[#F5F9FF] group-hover:text-white transition-colors">
                  {tech.name}
                </h3>

                {/* Description */}
                <p className="text-xs text-[#F5F9FF]/50 leading-relaxed">
                  {tech.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Architecture Highlights */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#0077FF]/20 to-[#00E0FF]/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-[#00E0FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">99.9% Uptime</h3>
            <p className="text-[#F5F9FF]/60">Disponibilidade garantida com infraestrutura global Azure</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#0077FF]/20 to-[#00E0FF]/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-[#00E0FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Enterprise Security</h3>
            <p className="text-[#F5F9FF]/60">Criptografia, MFA, auditoria e conformidade LGPD/GDPR</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#0077FF]/20 to-[#00E0FF]/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-[#00E0FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Auto-scaling</h3>
            <p className="text-[#F5F9FF]/60">Escala automaticamente conforme demanda sem intervenção</p>
          </div>
        </div>

        {/* Technical Details */}
        <div className="mt-20 p-8 rounded-2xl bg-white/[0.02] backdrop-blur-xl border border-white/5 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-[#00E0FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Backend
              </h4>
              <ul className="space-y-2 text-[#F5F9FF]/60">
                <li>• Node.js 20 LTS + Express</li>
                <li>• TypeScript strict mode</li>
                <li>• MongoDB Atlas serverless</li>
                <li>• JWT authentication + refresh tokens</li>
                <li>• Winston logging + Azure Insights</li>
                <li>• Zod validation + Helmet security</li>
              </ul>
            </div>

            <div>
              <h4 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-[#00E0FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Frontend
              </h4>
              <ul className="space-y-2 text-[#F5F9FF]/60">
                <li>• Next.js 16 + React 19</li>
                <li>• TypeScript + Tailwind CSS 4</li>
                <li>• shadcn/ui components</li>
                <li>• NextAuth.js authentication</li>
                <li>• Progressive Web App (PWA)</li>
                <li>• Server-side rendering (SSR)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <button className="px-8 py-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl font-semibold hover:bg-white/10 transition-all duration-300 inline-flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Ver documentação técnica completa
          </button>
        </div>
      </div>
    </section>
  )
}
