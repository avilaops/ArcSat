"use client"

import { useState, useEffect } from 'react'

export default function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 20,
        y: (e.clientY / window.innerHeight) * 20
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background animado */}
      <div className="absolute inset-0">
        {/* Grid de fundo */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,119,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,119,255,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        
        {/* Gradient radial */}
        <div 
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#0077FF] rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse"
          style={{
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`
          }}
        />
        <div 
          className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-[#00E0FF] rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse animation-delay-2000"
          style={{
            transform: `translate(-${mousePosition.x}px, -${mousePosition.y}px)`
          }}
        />
      </div>

      {/* Conteúdo */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        {/* Logo */}
        <div className="mb-8 inline-flex items-center justify-center">
          <div className="w-20 h-20 bg-gradient-to-br from-[#0077FF] to-[#00E0FF] rounded-2xl flex items-center justify-center backdrop-blur-xl border border-white/10 shadow-2xl">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </div>

        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-xl border border-white/10">
          <div className="w-2 h-2 bg-[#00E0FF] rounded-full animate-pulse" />
          <span className="text-sm font-medium text-[#F5F9FF]">Tecnologia Corporativa Premium</span>
        </div>

        {/* Título */}
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
          <span className="block bg-gradient-to-r from-white via-[#00E0FF] to-white bg-clip-text text-transparent">
            ArcSat
          </span>
          <span className="block text-4xl md:text-5xl lg:text-6xl mt-4 text-[#F5F9FF]/80">
            Gestão Inteligente de<br />Operações Corporativas
          </span>
        </h1>

        {/* Subtítulo */}
        <p className="text-xl md:text-2xl text-[#F5F9FF]/60 max-w-3xl mx-auto mb-12 leading-relaxed">
          Plataforma unificada para cadastros, vendas e integrações API.<br />
          Automação de alto nível para empresas que pensam grande.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button className="group relative px-8 py-4 bg-gradient-to-r from-[#0077FF] to-[#00E0FF] rounded-xl font-semibold text-lg shadow-[0_0_40px_rgba(0,119,255,0.4)] hover:shadow-[0_0_60px_rgba(0,119,255,0.6)] transition-all duration-300 hover:scale-105">
            <span className="relative z-10 flex items-center gap-2">
              Solicitar Demonstração
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </button>
          
          <button className="px-8 py-4 rounded-xl font-semibold text-lg bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
            Ver Documentação
          </button>
        </div>

        {/* Social proof */}
        <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-[#F5F9FF]/40">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-[#00E0FF]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Enterprise-ready</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-[#00E0FF]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>99.9% Uptime SLA</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-[#00E0FF]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>LGPD Compliant</span>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-[#00E0FF]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>

      <style jsx>{`
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        @keyframes pulse {
          0%, 100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.3;
          }
        }
      `}</style>
    </section>
  )
}
