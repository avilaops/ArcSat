import Navbar from "../components/Navbar"
import SystemsShowcase from "../components/SystemsShowcase"

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100"></div>
        <div className="relative container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-8">
              🚀 Sistema completo de gestão empresarial
            </div>
            <h1 className="text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Transforme seu negócio com
              <span className="text-blue-600 block">tecnologia inteligente</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Automatize processos, gerencie equipes e tome decisões estratégicas com dados em tempo real.
              O ArcSat revoluciona a gestão empresarial brasileira.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
              <a href="/register" className="px-8 py-4 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl">
                Começar gratuitamente
              </a>
              <a href="/demo" className="px-8 py-4 rounded-lg bg-white text-gray-900 hover:bg-gray-50 transition-all duration-200 font-semibold text-lg border-2 border-gray-200 hover:border-gray-300">
                Agendar demonstração
              </a>
            </div>
            <div className="flex justify-center items-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Sem cartão de crédito
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Setup em 5 minutos
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Suporte 24/7
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Tudo que você precisa para crescer
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Recursos poderosos que simplificam a gestão e impulsionam resultados
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
                <span className="text-white text-2xl">📊</span>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">Dashboard Inteligente</h3>
              <p className="text-gray-600 leading-relaxed">
                Visualize todos os indicadores importantes do seu negócio em tempo real com gráficos interativos e relatórios automatizados.
              </p>
            </div>

            <div className="p-8 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-6">
                <span className="text-white text-2xl">🤖</span>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">Automação Avançada</h3>
              <p className="text-gray-600 leading-relaxed">
                Automatize tarefas repetitivas, envie lembretes automáticos e otimize seus processos internos com IA integrada.
              </p>
            </div>

            <div className="p-8 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-6">
                <span className="text-white text-2xl">👥</span>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">Gestão de Equipes</h3>
              <p className="text-gray-600 leading-relaxed">
                Gerencie permissões, acompanhe produtividade e facilite a comunicação entre todos os membros da equipe.
              </p>
            </div>

            <div className="p-8 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mb-6">
                <span className="text-white text-2xl">💰</span>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">Controle Financeiro</h3>
              <p className="text-gray-600 leading-relaxed">
                Controle receitas, despesas, fluxo de caixa e gere relatórios financeiros completos automaticamente.
              </p>
            </div>

            <div className="p-8 bg-gradient-to-br from-red-50 to-red-100 rounded-2xl hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mb-6">
                <span className="text-white text-2xl">📱</span>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">Acesso Mobile</h3>
              <p className="text-gray-600 leading-relaxed">
                Acesse seu sistema de qualquer lugar com nosso app mobile nativo para iOS e Android.
              </p>
            </div>

            <div className="p-8 bg-gradient-to-br from-teal-50 to-teal-100 rounded-2xl hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-teal-600 rounded-lg flex items-center justify-center mb-6">
                <span className="text-white text-2xl">🔒</span>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">Segurança Total</h3>
              <p className="text-gray-600 leading-relaxed">
                Dados criptografados, backups automáticos e conformidade com LGPD para máxima proteção.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Systems Showcase Section */}
      <SystemsShowcase />

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Por que escolher o ArcSat?
              </h2>
              <p className="text-xl text-gray-600">
                Descubra como milhares de empresas já transformaram seus resultados
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-6">
                  Aumente sua produtividade em até 300%
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-1">
                      <span className="text-white text-sm">✓</span>
                    </span>
                    <span className="text-gray-700">Reduza tempo gasto em tarefas administrativas</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-1">
                      <span className="text-white text-sm">✓</span>
                    </span>
                    <span className="text-gray-700">Tome decisões baseadas em dados reais</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-1">
                      <span className="text-white text-sm">✓</span>
                    </span>
                    <span className="text-gray-700">Elimine erros manuais e retrabalho</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-1">
                      <span className="text-white text-sm">✓</span>
                    </span>
                    <span className="text-gray-700">Melhore comunicação interna da equipe</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <div className="text-center">
                  <div className="text-6xl font-bold text-blue-600 mb-2">300%</div>
                  <div className="text-xl text-gray-600 mb-6">Aumento de Produtividade</div>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-3xl font-bold text-green-600">85%</div>
                      <div className="text-sm text-gray-600">Redução de Custos</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-purple-600">95%</div>
                      <div className="text-sm text-gray-600">Satisfação dos Clientes</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              O que nossos clientes dizem
            </h2>
            <p className="text-xl text-gray-600">
              Histórias reais de empresas que transformaram seus negócios
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-2xl">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">MC</span>
                </div>
                <div className="ml-4">
                  <div className="font-semibold text-gray-900">Maria Clara</div>
                  <div className="text-sm text-gray-600">CEO, TechStart</div>
                </div>
              </div>
              <div className="text-yellow-400 mb-4">★★★★★</div>
              <p className="text-gray-700 italic">
                "O ArcSat revolucionou nossa gestão. Conseguimos reduzir custos operacionais em 40% e aumentar nossa eficiência significativamente."
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-2xl">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">JR</span>
                </div>
                <div className="ml-4">
                  <div className="font-semibold text-gray-900">João Roberto</div>
                  <div className="text-sm text-gray-600">Diretor, ConstruPrime</div>
                </div>
              </div>
              <div className="text-yellow-400 mb-4">★★★★★</div>
              <p className="text-gray-700 italic">
                "Interface intuitiva e suporte excepcional. Nossa equipe se adaptou rapidamente e os resultados foram impressionantes."
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-2xl">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">AS</span>
                </div>
                <div className="ml-4">
                  <div className="font-semibold text-gray-900">Ana Silva</div>
                  <div className="text-sm text-gray-600">Gerente, ConsultPro</div>
                </div>
              </div>
              <div className="text-yellow-400 mb-4">★★★★★</div>
              <p className="text-gray-700 italic">
                "Os relatórios automáticos nos dão insights valiosos. Tomamos decisões muito mais assertivas agora."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Planos feitos para seu negócio
            </h2>
            <p className="text-xl text-gray-600">
              Escolha o plano ideal para suas necessidades
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-gray-200">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Starter</h3>
                <div className="text-4xl font-bold text-gray-900 mb-1">R$ 49<span className="text-lg font-normal">/mês</span></div>
                <p className="text-gray-600 mb-6">Perfeito para pequenos negócios</p>
                <ul className="text-left space-y-3 mb-8">
                  <li className="flex items-center gap-3">
                    <span className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Até 10 usuários
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Dashboard básico
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Suporte por email
                  </li>
                </ul>
                <button className="w-full py-3 px-6 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors font-semibold">
                  Começar teste grátis
                </button>
              </div>
            </div>

            <div className="bg-blue-600 p-8 rounded-2xl shadow-lg border-2 border-blue-600 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">Mais Popular</span>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-2">Professional</h3>
                <div className="text-4xl font-bold text-white mb-1">R$ 99<span className="text-lg font-normal">/mês</span></div>
                <p className="text-blue-100 mb-6">Para empresas em crescimento</p>
                <ul className="text-left space-y-3 mb-8">
                  <li className="flex items-center gap-3">
                    <span className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-xs">✓</span>
                    </span>
                    <span className="text-white">Até 50 usuários</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-xs">✓</span>
                    </span>
                    <span className="text-white">Dashboard avançado</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-xs">✓</span>
                    </span>
                    <span className="text-white">Automação inteligente</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-xs">✓</span>
                    </span>
                    <span className="text-white">Suporte prioritário</span>
                  </li>
                </ul>
                <button className="w-full py-3 px-6 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold">
                  Começar teste grátis
                </button>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-gray-200">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Enterprise</h3>
                <div className="text-4xl font-bold text-gray-900 mb-1">R$ 199<span className="text-lg font-normal">/mês</span></div>
                <p className="text-gray-600 mb-6">Para grandes corporações</p>
                <ul className="text-left space-y-3 mb-8">
                  <li className="flex items-center gap-3">
                    <span className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Usuários ilimitados
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Recursos premium
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Suporte 24/7 dedicado
                  </li>
                </ul>
                <button className="w-full py-3 px-6 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors font-semibold">
                  Falar com vendas
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-blue-600">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Pronto para transformar seu negócio?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de empresas que já descobriram o poder da gestão inteligente
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="/register" className="px-8 py-4 rounded-lg bg-white text-blue-600 hover:bg-blue-50 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl">
              Começar gratuitamente
            </a>
            <a href="/contact" className="px-8 py-4 rounded-lg bg-blue-500 text-white hover:bg-blue-400 transition-all duration-200 font-semibold text-lg border-2 border-blue-400">
              Falar com especialista
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">ArcSat</h3>
              <p className="text-gray-400">
                Revolucionando a gestão empresarial com tecnologia inteligente e automação avançada.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Produto</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/features" className="hover:text-white transition-colors">Recursos</a></li>
                <li><a href="/pricing" className="hover:text-white transition-colors">Preços</a></li>
                <li><a href="/integrations" className="hover:text-white transition-colors">Integrações</a></li>
                <li><a href="/api" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/about" className="hover:text-white transition-colors">Sobre nós</a></li>
                <li><a href="/careers" className="hover:text-white transition-colors">Carreiras</a></li>
                <li><a href="/blog" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="/contact" className="hover:text-white transition-colors">Contato</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Suporte</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/help" className="hover:text-white transition-colors">Central de Ajuda</a></li>
                <li><a href="/docs" className="hover:text-white transition-colors">Documentação</a></li>
                <li><a href="/status" className="hover:text-white transition-colors">Status do Sistema</a></li>
                <li><a href="/contact" className="hover:text-white transition-colors">Suporte</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 ArcSat. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
