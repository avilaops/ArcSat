import Link from 'next/link'

const dashboardStats = [
  { label: 'Clientes Ativos', value: '1,247', change: '+12%', color: 'blue' },
  { label: 'Vendas do Mês', value: 'R$ 87.5K', change: '+8%', color: 'green' },
  { label: 'Leads em Aberto', value: '156', change: '+24%', color: 'orange' },
  { label: 'Taxa de Conversão', value: '3.2%', change: '+0.8%', color: 'purple' }
]

const recentActivity = [
  { id: 1, action: 'Novo cliente cadastrado', details: 'Empresa TechSolutions Ltda', time: '2 min ago', type: 'new' },
  { id: 2, action: 'Venda concluída', details: 'R$ 25.000 - Contrato anual', time: '15 min ago', type: 'sale' },
  { id: 3, action: 'Lead qualificado', details: 'Industrias ABC S.A.', time: '1 hora ago', type: 'lead' },
  { id: 4, action: 'Reunião agendada', details: 'Demo produto - 14h00', time: '2 horas ago', type: 'meeting' }
]

const quickActions = [
  { id: 'new-client', label: 'Novo Cliente', icon: '👥', url: '/clients/new', color: 'blue' },
  { id: 'new-sale', label: 'Registrar Venda', icon: '💰', url: '/sales/new', color: 'green' },
  { id: 'new-lead', label: 'Novo Lead', icon: '🎯', url: '/leads/new', color: 'orange' },
  { id: 'reports', label: 'Relatórios', icon: '📊', url: '/reports', color: 'purple' }
]

const systemShortcuts = [
  { id: 'crm', label: 'CRM', url: '/crm', color: 'blue' },
  { id: 'erp', label: 'ERP', url: '/erp', color: 'green' },
  { id: 'industrial', label: 'Industrial', url: '/industrial', color: 'orange' },
  { id: 'ai', label: 'IA', url: '/ai', color: 'purple' }
]

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="https://arcsat.com.br" className="text-2xl font-bold text-blue-600">
                ArcSat
              </Link>
              <span className="text-gray-400">|</span>
              <span className="text-gray-600">Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Bem-vindo, Admin</span>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">A</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Principal</h1>
          <p className="text-gray-600 mt-2">Visão geral das suas operações e métricas importantes</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`text-sm font-medium ${
                  stat.color === 'blue' ? 'text-blue-600' :
                  stat.color === 'green' ? 'text-green-600' :
                  stat.color === 'orange' ? 'text-orange-600' :
                  'text-purple-600'
                }`}>
                  {stat.change}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* System Shortcuts */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Acesso Rápido aos Sistemas</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {systemShortcuts.map((system) => (
              <Link
                key={system.id}
                href={system.url}
                className={`p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-center ${
                  system.color === 'blue' ? 'hover:border-blue-300' :
                  system.color === 'green' ? 'hover:border-green-300' :
                  system.color === 'orange' ? 'hover:border-orange-300' :
                  'hover:border-purple-300'
                }`}
              >
                <div className={`text-2xl mb-2 ${
                  system.color === 'blue' ? 'text-blue-600' :
                  system.color === 'green' ? 'text-green-600' :
                  system.color === 'orange' ? 'text-orange-600' :
                  'text-purple-600'
                }`}>
                  {system.id === 'crm' ? '👥' : system.id === 'erp' ? '📊' : system.id === 'industrial' ? '🏭' : '🤖'}
                </div>
                <p className="font-medium text-gray-900">{system.label}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((action) => (
                <Link
                  key={action.id}
                  href={action.url}
                  className={`p-4 border-2 border-gray-200 rounded-lg hover:shadow-md transition-all text-center ${
                    action.color === 'blue' ? 'hover:border-blue-300 hover:bg-blue-50' :
                    action.color === 'green' ? 'hover:border-green-300 hover:bg-green-50' :
                    action.color === 'orange' ? 'hover:border-orange-300 hover:bg-orange-50' :
                    'hover:border-purple-300 hover:bg-purple-50'
                  }`}
                >
                  <div className="text-2xl mb-2">{action.icon}</div>
                  <p className="font-medium text-gray-900 text-sm">{action.label}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Atividade Recente</h2>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'new' ? 'bg-blue-500' :
                    activity.type === 'sale' ? 'bg-green-500' :
                    activity.type === 'lead' ? 'bg-orange-500' :
                    'bg-purple-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-600">{activity.details}</p>
                    <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* External Links */}
        <div className="mt-8 p-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white">
          <h3 className="text-xl font-semibold mb-4">Links Externos</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a
              href="https://docs.arcsat.com.br"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-center"
            >
              <div className="text-2xl mb-2">📚</div>
              <p className="text-sm font-medium">Documentação</p>
            </a>
            <a
              href="https://api.arcsat.com.br"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-center"
            >
              <div className="text-2xl mb-2">🔗</div>
              <p className="text-sm font-medium">API</p>
            </a>
            <a
              href="https://auth.arcsat.com.br"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-center"
            >
              <div className="text-2xl mb-2">🔐</div>
              <p className="text-sm font-medium">Autenticação</p>
            </a>
            <a
              href="https://arcsat.com.br"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-center"
            >
              <div className="text-2xl mb-2">🏠</div>
              <p className="text-sm font-medium">Site Principal</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}