'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Users, 
  Building2, 
  TrendingUp, 
  DollarSign, 
  Bell, 
  Search,
  Filter,
  Plus,
  Calendar,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react'

const dashboardData = {
  metrics: [
    {
      title: 'Total de Clientes',
      value: '2,543',
      change: '+12.5%',
      trend: 'up',
      icon: Users,
    },
    {
      title: 'Empresas Ativas',
      value: '1,234',
      change: '+8.2%',
      trend: 'up',
      icon: Building2,
    },
    {
      title: 'Receita Mensal',
      value: 'R$ 485.2k',
      change: '+23.1%',
      trend: 'up',
      icon: DollarSign,
    },
    {
      title: 'Taxa de Conversão',
      value: '3.24%',
      change: '+0.4%',
      trend: 'up',
      icon: TrendingUp,
    },
  ],
  recentClients: [
    { name: 'Empresa Alpha Ltda', cnpj: '12.345.678/0001-90', status: 'Ativo', plan: 'Enterprise' },
    { name: 'Beta Solutions', cnpj: '98.765.432/0001-10', status: 'Pendente', plan: 'Growth' },
    { name: 'Gamma Corp', cnpj: '11.222.333/0001-44', status: 'Ativo', plan: 'Startup' },
    { name: 'Delta Industries', cnpj: '55.666.777/0001-88', status: 'Ativo', plan: 'Enterprise' },
  ],
  activities: [
    { action: 'Novo cliente cadastrado', entity: 'Empresa Alpha Ltda', time: '2 min atrás' },
    { action: 'Pagamento processado', entity: 'Beta Solutions', time: '15 min atrás' },
    { action: 'Contrato renovado', entity: 'Gamma Corp', time: '1 hora atrás' },
    { action: 'Support ticket criado', entity: 'Delta Industries', time: '2 horas atrás' },
  ]
}

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <div className="min-h-screen bg-[#0B0F17] text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-white/[0.02] backdrop-blur-xl">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[#0077FF] to-[#00E0FF] bg-clip-text text-transparent">
              ArcSat Dashboard
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
              <Input
                placeholder="Buscar clientes, empresas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-80 pl-10"
              />
            </div>
            <Button variant="outline" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Cliente
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Metrics Grid */}
        <motion.div 
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {dashboardData.metrics.map((metric, index) => {
            const Icon = metric.icon
            return (
              <motion.div
                key={metric.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="hover:scale-105 transition-transform duration-200">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-white/80">
                      {metric.title}
                    </CardTitle>
                    <Icon className="h-4 w-4 text-[#00E0FF]" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{metric.value}</div>
                    <p className="text-xs text-green-400 flex items-center mt-1">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {metric.change} em relação ao mês anterior
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Recent Clients */}
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Clientes Recentes</CardTitle>
                    <CardDescription>
                      Últimos clientes cadastrados no sistema
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filtros
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.recentClients.map((client, index) => (
                    <motion.div
                      key={client.cnpj}
                      className="flex items-center justify-between p-4 rounded-lg bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-colors"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#0077FF] to-[#00E0FF] flex items-center justify-center">
                          <Building2 className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-white">{client.name}</p>
                          <p className="text-sm text-white/60">{client.cnpj}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant={client.status === 'Ativo' ? 'success' : 'warning'}
                        >
                          {client.status}
                        </Badge>
                        <Badge variant="secondary">{client.plan}</Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Activity Feed */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-[#00E0FF]" />
                  Atividades Recentes
                </CardTitle>
                <CardDescription>
                  Últimas ações no sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.activities.map((activity, index) => (
                    <motion.div
                      key={index}
                      className="flex space-x-3"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <div className="h-2 w-2 mt-2 rounded-full bg-[#00E0FF]" />
                      <div className="flex-1 space-y-1">
                        <p className="text-sm text-white/80">
                          {activity.action}
                        </p>
                        <p className="text-sm font-medium text-white">
                          {activity.entity}
                        </p>
                        <p className="text-xs text-white/50">
                          {activity.time}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Charts Section */}
        <motion.div 
          className="grid gap-6 lg:grid-cols-2 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-[#00E0FF]" />
                Crescimento Mensal
              </CardTitle>
              <CardDescription>
                Novos clientes por mês
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center border border-white/10 rounded-lg bg-white/[0.02]">
                <p className="text-white/60">Gráfico de barras será implementado aqui</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChart className="h-5 w-5 mr-2 text-[#00E0FF]" />
                Distribuição por Plano
              </CardTitle>
              <CardDescription>
                Percentual de clientes por plano
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center border border-white/10 rounded-lg bg-white/[0.02]">
                <p className="text-white/60">Gráfico de pizza será implementado aqui</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}