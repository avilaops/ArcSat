"use client"

// import { ArrowRightIcon } from "@heroicons/react/24/outline"

const systems = [
  {
    id: 'crm',
    title: 'CRM Avançado',
    description: 'Gerencie clientes, leads e vendas com automação inteligente',
    icon: '👥',
    color: 'blue',
    url: 'https://app.arcsat.com.br',
    features: ['Gestão de Leads', 'Pipeline de Vendas', 'Automação de Marketing', 'Relatórios Avançados']
  },
  {
    id: 'erp',
    title: 'ERP Empresarial',
    description: 'Controle financeiro, estoque e operações em uma única plataforma',
    icon: '📊',
    color: 'green',
    url: 'https://app.arcsat.com.br/erp',
    features: ['Controle Financeiro', 'Gestão de Estoque', 'Contabilidade', 'Relatórios Gerenciais']
  },
  {
    id: 'industrial',
    title: 'Consultoria Industrial',
    description: 'Otimize processos industriais com Lean Manufacturing e Indústria 4.0',
    icon: '🏭',
    color: 'orange',
    url: 'https://app.arcsat.com.br/industrial',
    features: ['Lean Manufacturing', 'ISO Compliance', 'Indústria 4.0', 'Segurança do Trabalho']
  },
  {
    id: 'ai',
    title: 'IA Empresarial',
    description: 'Assistente virtual inteligente para automatizar decisões de negócio',
    icon: '🤖',
    color: 'purple',
    url: 'https://app.arcsat.com.br/ai',
    features: ['Análise Preditiva', 'Chatbot Inteligente', 'Automação de Processos', 'Machine Learning']
  },
  {
    id: 'docs',
    title: 'Documentação',
    description: 'Guias completos, tutoriais e documentação técnica',
    icon: '📚',
    color: 'indigo',
    url: 'https://docs.arcsat.com.br',
    features: ['Guias de Uso', 'API Reference', 'Tutoriais', 'Exemplos Práticos']
  },
  {
    id: 'api',
    title: 'API Gateway',
    description: 'Integre sistemas externos com nossa API REST robusta',
    icon: '🔗',
    color: 'teal',
    url: 'https://api.arcsat.com.br',
    features: ['REST API', 'Webhooks', 'SDKs', 'Rate Limiting']
  }
]

const colorVariants = {
  blue: {
    bg: 'from-blue-50 to-blue-100',
    border: 'border-blue-200',
    icon: 'bg-blue-600',
    button: 'bg-blue-600 hover:bg-blue-700',
    text: 'text-blue-600'
  },
  green: {
    bg: 'from-green-50 to-green-100',
    border: 'border-green-200',
    icon: 'bg-green-600',
    button: 'bg-green-600 hover:bg-green-700',
    text: 'text-green-600'
  },
  orange: {
    bg: 'from-orange-50 to-orange-100',
    border: 'border-orange-200',
    icon: 'bg-orange-600',
    button: 'bg-orange-600 hover:bg-orange-700',
    text: 'text-orange-600'
  },
  purple: {
    bg: 'from-purple-50 to-purple-100',
    border: 'border-purple-200',
    icon: 'bg-purple-600',
    button: 'bg-purple-600 hover:bg-purple-700',
    text: 'text-purple-600'
  },
  indigo: {
    bg: 'from-indigo-50 to-indigo-100',
    border: 'border-indigo-200',
    icon: 'bg-indigo-600',
    button: 'bg-indigo-600 hover:bg-indigo-700',
    text: 'text-indigo-600'
  },
  teal: {
    bg: 'from-teal-50 to-teal-100',
    border: 'border-teal-200',
    icon: 'bg-teal-600',
    button: 'bg-teal-600 hover:bg-teal-700',
    text: 'text-teal-600'
  }
}

export default function SystemsShowcase() {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-6">
            🎯 Acesse nossos sistemas
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Escolha o sistema ideal para sua necessidade
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Cada sistema foi desenvolvido para atender demandas específicas do seu negócio. 
            Clique no botão &quot;Acessar Sistema&quot; para começar a usar imediatamente.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {systems.map((system) => {
            const colors = colorVariants[system.color as keyof typeof colorVariants]
            
            return (
              <div
                key={system.id}
                className={`group relative p-8 bg-gradient-to-br ${colors.bg} border-2 ${colors.border} rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
              >
                {/* System Icon */}
                <div className={`w-16 h-16 ${colors.icon} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-white text-3xl">{system.icon}</span>
                </div>

                {/* System Info */}
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {system.title}
                </h3>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  {system.description}
                </p>

                {/* Features List */}
                <div className="mb-8">
                  <h4 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">
                    Principais recursos:
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {system.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                        <span className="text-sm text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <a
                  href={system.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center justify-center w-full px-6 py-3 ${colors.button} text-white rounded-lg font-semibold transition-all duration-300 hover:shadow-lg group-hover:scale-105`}
                >
                  Acessar Sistema
                  <span className="ml-2 text-lg">→</span>
                </a>

                {/* Status Indicator */}
                <div className="absolute top-4 right-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-xs text-gray-500 font-medium">Online</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Quick Access Bar */}
        <div className="mt-16 p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Acesso Rápido
            </h3>
            <p className="text-gray-600">
              Links diretos para os sistemas mais utilizados
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://app.arcsat.com.br"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              🚀 Dashboard Principal
            </a>
            <a
              href="https://app.arcsat.com.br/auth"
              className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              🔐 Login/Cadastro
            </a>
            <a
              href="https://docs.arcsat.com.br"
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              📖 Documentação
            </a>
            <a
              href="https://api.arcsat.com.br"
              className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              🔗 API
            </a>
          </div>
        </div>

        {/* Integration CTA */}
        <div className="mt-16 text-center">
          <div className="inline-block p-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-white shadow-xl">
            <h3 className="text-2xl font-bold mb-4">
              Precisa de integração personalizada?
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Nossa equipe técnica pode ajudar você a conectar todos os sistemas 
              e criar soluções sob medida para sua empresa.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="mailto:contato@arcsat.com.br"
                className="px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold"
              >
                Falar com Especialista
              </a>
              <a
                href="https://docs.arcsat.com.br/api"
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition-colors font-semibold border-2 border-blue-400"
              >
                Ver Documentação API
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}