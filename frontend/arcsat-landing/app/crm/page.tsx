"use client"

import Link from 'next/link'
import { useState } from 'react'

const mockClients = [
  { id: 1, name: 'TechSolutions Ltda', contact: 'João Silva', email: 'joao@techsolutions.com', phone: '(11) 99999-9999', status: 'Ativo' },
  { id: 2, name: 'Industrias ABC S.A.', contact: 'Maria Santos', email: 'maria@industriasabc.com', phone: '(11) 88888-8888', status: 'Prospect' },
  { id: 3, name: 'ConsultPro', contact: 'Pedro Costa', email: 'pedro@consultpro.com', phone: '(11) 77777-7777', status: 'Ativo' },
  { id: 4, name: 'InovaTech', contact: 'Ana Lima', email: 'ana@inovatech.com', phone: '(11) 66666-6666', status: 'Inativo' }
]

const mockLeads = [
  { id: 1, name: 'Empresa XYZ', source: 'Website', score: 85, stage: 'Qualificado' },
  { id: 2, name: 'StartupTech', source: 'LinkedIn', score: 72, stage: 'Contato Inicial' },
  { id: 3, name: 'BigCorp', source: 'Indicação', score: 91, stage: 'Proposta' },
  { id: 4, name: 'LocalBiz', source: 'Google Ads', score: 68, stage: 'Descoberta' }
]

export default function CRMPage() {
  const [activeTab, setActiveTab] = useState('clients')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-2xl font-bold text-blue-600">
                ArcSat
              </Link>
              <span className="text-gray-400">|</span>
              <span className="text-gray-600">CRM</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/dashboard"
                className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                ← Voltar ao Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Sistema CRM</h1>
          <p className="text-gray-600 mt-2">Gerencie seus clientes, leads e relacionamentos</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total de Clientes</p>
                <p className="text-2xl font-bold text-gray-900">{mockClients.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🎯</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Leads Ativos</p>
                <p className="text-2xl font-bold text-gray-900">{mockLeads.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Vendas do Mês</p>
                <p className="text-2xl font-bold text-gray-900">R$ 87.5K</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📈</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Taxa Conversão</p>
                <p className="text-2xl font-bold text-gray-900">3.2%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('clients')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'clients'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Clientes
              </button>
              <button
                onClick={() => setActiveTab('leads')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'leads'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Leads
              </button>
              <button
                onClick={() => setActiveTab('pipeline')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'pipeline'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Pipeline de Vendas
              </button>
            </nav>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'clients' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Lista de Clientes</h2>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                + Novo Cliente
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contato</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telefone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mockClients.map((client) => (
                    <tr key={client.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{client.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.contact}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.phone}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          client.status === 'Ativo' ? 'bg-green-100 text-green-800' :
                          client.status === 'Prospect' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {client.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">Editar</button>
                        <button className="text-red-600 hover:text-red-900">Excluir</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'leads' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Pipeline de Leads</h2>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                + Novo Lead
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lead</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Origem</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estágio</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mockLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{lead.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lead.source}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-gray-900">{lead.score}</span>
                          <div className="ml-2 w-16 h-2 bg-gray-200 rounded-full">
                            <div
                              className={`h-2 rounded-full ${
                                lead.score >= 80 ? 'bg-green-500' : lead.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${lead.score}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          lead.stage === 'Qualificado' ? 'bg-green-100 text-green-800' :
                          lead.stage === 'Proposta' ? 'bg-blue-100 text-blue-800' :
                          lead.stage === 'Contato Inicial' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {lead.stage}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">Qualificar</button>
                        <button className="text-green-600 hover:text-green-900">Converter</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'pipeline' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {['Descoberta', 'Qualificação', 'Proposta', 'Fechamento'].map((stage, index) => (
              <div key={stage} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900 mb-4">{stage}</h3>
                <div className="space-y-3">
                  {mockLeads
                    .filter(lead => 
                      (stage === 'Descoberta' && lead.stage === 'Descoberta') ||
                      (stage === 'Qualificação' && lead.stage === 'Contato Inicial') ||
                      (stage === 'Proposta' && lead.stage === 'Proposta') ||
                      (stage === 'Fechamento' && lead.stage === 'Qualificado')
                    )
                    .map((lead) => (
                      <div key={lead.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="font-medium text-sm text-gray-900">{lead.name}</p>
                        <p className="text-xs text-gray-500">{lead.source}</p>
                        <div className="mt-2 flex justify-between items-center">
                          <span className="text-xs text-gray-600">Score: {lead.score}</span>
                          <button className="text-xs text-blue-600 hover:text-blue-800">Ver detalhes</button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}