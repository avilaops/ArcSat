// ArcSat Industrial - Gestão de Clientes para Consultoria
// Módulo integrado com MongoDB Atlas e Azure AI

import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import IntegradorSEFAZ from './services/integrador-sefaz.js';
import 'dotenv/config';

// Schema do Cliente Industrial - Integrado com SEFAZ
const ClienteIndustrialSchema = new mongoose.Schema({
    // Dados básicos obrigatórios
    nomeEmpresa: { type: String, required: true },
    cnpj: { type: String, unique: true, sparse: true },
    setor: { type: String, required: true },
    numeroFuncionarios: { type: Number, required: true },
    
    // Dados detalhados SEFAZ
    nome_fantasia: String,
    razao_social: String,
    situacao_cadastral: String,
    porte_empresa: String,
    natureza_juridica: String,
    data_abertura: String,
    capital_social: String,
    
    // Endereço completo
    endereco: {
        cep: String,
        cidade: String,
        estado: String,
        endereco: String,
        logradouro: String,
        numero: String,
        complemento: String,
        bairro: String,
        endereco_completo: String
    },
    
    // Contato detalhado
    contato: {
        responsavel: String,
        telefone: String,
        email: String,
        telefone_sefaz: String,
        email_sefaz: String
    },
    
    // Atividades CNAE
    atividade_principal: {
        codigo: String,
        descricao: String
    },
    atividades_secundarias: [{
        codigo: String,
        descricao: String
    }],
    
    // Quadro societário
    quadro_societario: [{
        nome: String,
        qualificacao: String,
        pais_origem: String,
        nome_rep_legal: String,
        qual_rep_legal: String
    }],
    
    // Campos de negócio
    desafios: [String],
    especializacao: {
        type: String,
        enum: ['lean_manufacturing', 'iso_compliance', 'industry_40', 'safety_management'],
        default: 'lean_manufacturing'
    },
    etapaConsultoria: {
        type: String,
        enum: ['diagnostico_inicial', 'proposta_comercial', 'implementacao', 'monitoramento', 'finalizado'],
        default: 'diagnostico_inicial'
    },
    status: {
        type: String,
        enum: ['ativo', 'inativo', 'lead', 'cliente', 'ex_cliente'],
        default: 'lead'
    },
    
    // KPIs industriais
    kpis: {
        oee_atual: Number,
        oee_target: Number,
        defeitos_percentual: Number,
        produtividade_baseline: Number,
        custos_manutencao: Number,
        tempo_setup: Number,
        disponibilidade: Number,
        performance: Number,
        qualidade: Number
    },
    
    // Análise IA integrada
    analise_ia: {
        especializacao_recomendada: String,
        prioridades: [String],
        roi_estimado: String,
        timeline_meses: Number,
        modulos: [String],
        confidence_score: Number,
        observacoes_sefaz: [String],
        setor_identificado: String,
        potencial_cliente: Boolean
    },
    
    // Dados SEFAZ
    dados_sefaz: {
        ultima_consulta: Date,
        situacao_receita: String,
        status_validacao: String,
        motivo_situacao: String,
        data_situacao: String,
        ultima_atualizacao_receita: String,
        dados_originais: mongoose.Schema.Types.Mixed
    },
    
    // Histórico e documentos
    historico: [{
        timestamp: { type: Date, default: Date.now },
        acao: String,
        tipo: String,
        usuario: String,
        detalhes: mongoose.Schema.Types.Mixed
    }],
    documentos: [{
        nome: String,
        tipo: String,
        url: String,
        dataUpload: { type: Date, default: Date.now }
    }],
    
    // Timestamps
    dataCreated: { type: Date, default: Date.now },
    dataUpdated: { type: Date, default: Date.now },
    dataUltimaConsultaSefaz: Date
}, {
    timestamps: true
});

// Índices para performance
ClienteIndustrialSchema.index({ nomeEmpresa: 'text', setor: 'text' });
ClienteIndustrialSchema.index({ setor: 1, status: 1 });
ClienteIndustrialSchema.index({ etapaConsultoria: 1 });

const ClienteIndustrial = mongoose.model('ClienteIndustrial', ClienteIndustrialSchema);

class GestaoClientesIndustrial {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 5000;
        this.integradorSEFAZ = new IntegradorSEFAZ();
        this.setupMiddleware();
        this.connectMongoDB();
        this.setupAzureAI();
        this.setupRoutes();
    }

    setupMiddleware() {
        this.app.use(helmet());
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.static('public'));
    }

    async connectMongoDB() {
        try {
            const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/arcsat-industrial';
            
            await mongoose.connect(mongoUri, {
                maxPoolSize: 10,
                minPoolSize: 2,
                maxIdleTimeMS: 30000,
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMS: 45000,
            });
            
            console.log('✅ MongoDB Atlas conectado com sucesso');
            console.log(`📊 Database: ${mongoose.connection.name}`);
            
            // Event listeners para monitoramento
            mongoose.connection.on('error', (error) => {
                console.error('❌ Erro MongoDB:', error);
            });

            mongoose.connection.on('disconnected', () => {
                console.warn('⚠️  MongoDB desconectado');
            });

            mongoose.connection.on('reconnected', () => {
                console.log('🔄 MongoDB reconectado');
            });

        } catch (error) {
            console.error('❌ Erro ao conectar MongoDB Atlas:', error.message);
            console.log('🔄 Tentando novamente em 5 segundos...');
            setTimeout(() => this.connectMongoDB(), 5000);
        }
    }

    setupAzureAI() {
        try {
            // Azure OpenAI será configurado posteriormente
            // Sistema funciona offline por enquanto
            this.openaiClient = null;
            console.log('⚠️  Azure OpenAI em modo offline - funcionalidades básicas disponíveis');
        } catch (error) {
            console.log('⚠️  Erro ao configurar Azure AI:', error.message);
        }
    }

    setupRoutes() {
        // Health check
        this.app.get('/health', async (req, res) => {
            const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
            const clientesCount = await ClienteIndustrial.countDocuments();
            
            res.json({ 
                status: 'ok', 
                timestamp: new Date().toISOString(),
                azure_ai: !!this.openaiClient,
                mongodb: dbStatus,
                clientes_total: clientesCount,
                version: '1.0.0'
            });
        });

        // Consulta SEFAZ por CNPJ
        this.app.get('/api/sefaz/consultar/:cnpj', async (req, res) => {
            try {
                const cnpj = req.params.cnpj;
                console.log(`🔍 Consultando SEFAZ para CNPJ: ${cnpj}`);
                
                const dadosSEFAZ = await this.integradorSEFAZ.buscarDadosSEFAZ(cnpj);
                const dadosCliente = this.integradorSEFAZ.mapearParaSchemaCliente(dadosSEFAZ);
                
                // Estimar funcionários se não informado
                if (!dadosCliente.numeroFuncionarios) {
                    dadosCliente.numeroFuncionarios = this.integradorSEFAZ.estimarFuncionarios(dadosSEFAZ.porte);
                }
                
                res.json({ 
                    success: true, 
                    dados_sefaz: dadosSEFAZ,
                    dados_cliente: dadosCliente,
                    recomendacoes: dadosSEFAZ.analise_industrial
                });
            } catch (error) {
                console.error('Erro consulta SEFAZ:', error);
                res.status(400).json({ 
                    success: false, 
                    error: error.message,
                    codigo: 'SEFAZ_ERROR'
                });
            }
        });

        // Validar CNPJ
        this.app.get('/api/sefaz/validar/:cnpj', (req, res) => {
            try {
                const cnpj = req.params.cnpj;
                const validacao = this.integradorSEFAZ.validarCNPJ(cnpj);
                
                res.json({
                    success: true,
                    valido: validacao.valido,
                    erro: validacao.erro || null,
                    cnpj_limpo: this.integradorSEFAZ.limparCNPJ(cnpj)
                });
            } catch (error) {
                res.status(400).json({ 
                    success: false, 
                    error: error.message 
                });
            }
        });

        // Criar cliente com dados SEFAZ automáticos
        this.app.post('/api/clientes/novo-sefaz', async (req, res) => {
            try {
                const { cnpj, dadosAdicionais = {} } = req.body;
                
                if (!cnpj) {
                    return res.status(400).json({ error: 'CNPJ é obrigatório' });
                }

                console.log(`🏭 Criando cliente com integração SEFAZ para: ${cnpj}`);
                
                // Buscar dados SEFAZ
                const dadosSEFAZ = await this.integradorSEFAZ.buscarDadosSEFAZ(cnpj);
                let dadosCliente = this.integradorSEFAZ.mapearParaSchemaCliente(dadosSEFAZ);
                
                // Mesclar com dados adicionais fornecidos
                dadosCliente = { ...dadosCliente, ...dadosAdicionais };
                
                // Verificar se já existe cliente com este CNPJ
                const clienteExistente = await ClienteIndustrial.findOne({ cnpj: dadosSEFAZ.cnpj });
                if (clienteExistente) {
                    return res.status(409).json({ 
                        success: false,
                        error: 'Cliente já cadastrado com este CNPJ',
                        cliente_existente: clienteExistente._id
                    });
                }
                
                // Criar cliente no MongoDB
                const cliente = new ClienteIndustrial({
                    ...dadosCliente,
                    dataUltimaConsultaSefaz: new Date()
                });

                // Análise inicial com IA se disponível
                if (this.openaiClient) {
                    try {
                        const analiseIA = await this.analisarPerfilClienteComSEFAZ(cliente, dadosSEFAZ);
                        cliente.analise_ia = { ...cliente.analise_ia, ...analiseIA };
                    } catch (error) {
                        console.log('IA offline, usando análise SEFAZ padrão');
                    }
                }

                const clienteSalvo = await cliente.save();
                
                // Registrar no histórico
                await this.adicionarHistorico(
                    clienteSalvo._id, 
                    'Cliente criado com integração SEFAZ automática', 
                    'criacao_sefaz',
                    { cnpj, situacao_sefaz: dadosSEFAZ.situacao_cadastral }
                );
                
                res.json({ 
                    success: true, 
                    cliente: clienteSalvo,
                    dados_sefaz: dadosSEFAZ,
                    integracao: 'automatica'
                });
                
            } catch (error) {
                console.error('Erro ao criar cliente SEFAZ:', error);
                res.status(500).json({ error: error.message });
            }
        });

        // Atualizar cliente existente com dados SEFAZ
        this.app.put('/api/clientes/:id/sync-sefaz', async (req, res) => {
            try {
                const clienteId = req.params.id;
                const cliente = await ClienteIndustrial.findById(clienteId);
                
                if (!cliente) {
                    return res.status(404).json({ error: 'Cliente não encontrado' });
                }
                
                if (!cliente.cnpj) {
                    return res.status(400).json({ error: 'Cliente não possui CNPJ para sincronização' });
                }
                
                console.log(`🔄 Sincronizando dados SEFAZ para: ${cliente.nomeEmpresa}`);
                
                // Buscar dados atualizados SEFAZ
                const dadosSEFAZ = await this.integradorSEFAZ.buscarDadosSEFAZ(cliente.cnpj);
                const dadosAtualizados = this.integradorSEFAZ.mapearParaSchemaCliente(dadosSEFAZ);
                
                // Preservar dados de negócio existentes
                const camposPreservados = {
                    etapaConsultoria: cliente.etapaConsultoria,
                    status: cliente.status,
                    kpis: cliente.kpis,
                    historico: cliente.historico,
                    documentos: cliente.documentos,
                    desafios: cliente.desafios
                };
                
                // Atualizar cliente
                const clienteAtualizado = await ClienteIndustrial.findByIdAndUpdate(
                    clienteId,
                    {
                        ...dadosAtualizados,
                        ...camposPreservados,
                        dataUltimaConsultaSefaz: new Date(),
                        dataUpdated: new Date()
                    },
                    { new: true, runValidators: true }
                );
                
                // Registrar sincronização
                await this.adicionarHistorico(
                    clienteId,
                    'Dados sincronizados com SEFAZ',
                    'sync_sefaz',
                    { situacao_anterior: cliente.situacao_cadastral, situacao_atual: dadosSEFAZ.situacao_cadastral }
                );
                
                res.json({
                    success: true,
                    cliente: clienteAtualizado,
                    dados_sefaz: dadosSEFAZ,
                    sincronizacao: new Date().toISOString()
                });
                
            } catch (error) {
                console.error('Erro ao sincronizar SEFAZ:', error);
                res.status(500).json({ error: error.message });
            }
        });
        this.app.post('/api/clientes/novo', async (req, res) => {
            try {
                const cliente = await this.criarNovoCliente(req.body);
                res.json({ success: true, cliente });
            } catch (error) {
                console.error('Erro ao criar cliente:', error);
                res.status(500).json({ error: error.message });
            }
        });

        this.app.get('/api/clientes/:id/diagnostico', async (req, res) => {
            try {
                const diagnostico = await this.gerarDiagnosticoIA(req.params.id);
                res.json({ success: true, diagnostico });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        this.app.get('/api/clientes/:id/relatorio', async (req, res) => {
            try {
                const relatorio = await this.gerarRelatorioExecutivo(req.params.id);
                res.json({ success: true, relatorio });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        this.app.get('/api/clientes', async (req, res) => {
            try {
                const { setor, status, etapa, limit = 20, skip = 0 } = req.query;
                
                // Filtros dinâmicos
                const filtros = {};
                if (setor) filtros.setor = setor;
                if (status) filtros.status = status;
                if (etapa) filtros.etapaConsultoria = etapa;

                const clientes = await ClienteIndustrial
                    .find(filtros)
                    .select('-historico -documentos') // Campos pesados opcionais
                    .limit(parseInt(limit))
                    .skip(parseInt(skip))
                    .sort({ dataCreated: -1 });

                const total = await ClienteIndustrial.countDocuments(filtros);

                res.json({ 
                    success: true, 
                    clientes,
                    pagination: {
                        total,
                        limit: parseInt(limit),
                        skip: parseInt(skip),
                        hasMore: (parseInt(skip) + parseInt(limit)) < total
                    }
                });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        // Busca textual
        this.app.get('/api/clientes/buscar/:termo', async (req, res) => {
            try {
                const termo = req.params.termo;
                const clientes = await ClienteIndustrial
                    .find({ $text: { $search: termo } })
                    .select('-historico -documentos')
                    .limit(10);

                res.json({ success: true, clientes });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        // Atualizar cliente
        this.app.put('/api/clientes/:id', async (req, res) => {
            try {
                const cliente = await ClienteIndustrial.findByIdAndUpdate(
                    req.params.id,
                    { ...req.body, dataUpdated: new Date() },
                    { new: true, runValidators: true }
                );

                if (!cliente) {
                    return res.status(404).json({ error: 'Cliente não encontrado' });
                }

                // Adicionar ao histórico
                await this.adicionarHistorico(req.params.id, 'Dados atualizados', 'update', req.body);

                res.json({ success: true, cliente });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        // Estatísticas do dashboard
        this.app.get('/api/dashboard/stats', async (req, res) => {
            try {
                const stats = await this.gerarEstatisticasDashboard();
                res.json({ success: true, stats });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        // Dashboard para consultoria
        this.app.get('/dashboard', (req, res) => {
            res.send(this.getDashboardHTML());
        });
    }

    async criarNovoCliente(dadosCliente) {
        try {
            // Criar novo cliente no MongoDB
            const cliente = new ClienteIndustrial({
                ...dadosCliente,
                dataCreated: new Date(),
                status: 'lead',
                etapaConsultoria: 'diagnostico_inicial'
            });

            // Análise inicial com IA (se disponível)
            if (this.openaiClient) {
                try {
                    const analiseIA = await this.analisarPerfilCliente(cliente);
                    cliente.analise_ia = analiseIA;
                } catch (error) {
                    console.log('IA offline, continuando sem análise automática');
                    cliente.analise_ia = {
                        especializacao_recomendada: 'lean_manufacturing',
                        prioridades: ['eficiencia_operacional'],
                        roi_estimado: '250-400%',
                        timeline_meses: 6,
                        modulos: ['diagnostico_inicial'],
                        confidence_score: 0.5
                    };
                }
            }

            // Salvar no MongoDB
            const clienteSalvo = await cliente.save();
            
            // Adicionar registro no histórico
            await this.adicionarHistorico(clienteSalvo._id, 'Cliente criado no sistema', 'criacao');
            
            return clienteSalvo;
        } catch (error) {
            console.error('Erro ao criar cliente:', error);
            throw new Error(`Erro ao salvar cliente: ${error.message}`);
        }
    }

    async analisarPerfilClienteComSEFAZ(cliente, dadosSEFAZ) {
        if (!this.openaiClient) {
            return {
                status: 'offline',
                message: 'IA não disponível',
                dados_sefaz_utilizados: true
            };
        }

        const prompt = `
        Analise este perfil empresarial para consultoria industrial, considerando dados oficiais da Receita Federal:
        
        DADOS SEFAZ:
        Empresa: ${dadosSEFAZ.razao_social}
        CNPJ: ${dadosSEFAZ.cnpj}
        Situação: ${dadosSEFAZ.situacao_cadastral}
        Porte: ${dadosSEFAZ.porte}
        Setor: ${dadosSEFAZ.analise_industrial.setor_identificado}
        Atividade Principal: ${dadosSEFAZ.atividade_principal?.descricao}
        Anos de Operação: ${new Date().getFullYear() - new Date(dadosSEFAZ.data_abertura.split('/').reverse().join('-')).getFullYear()}
        Capital Social: ${dadosSEFAZ.capital_social}
        
        ANÁLISE AUTOMÁTICA SEFAZ:
        Especialização Sugerida: ${dadosSEFAZ.analise_industrial.especializacao_recomendada}
        Prioridades: ${dadosSEFAZ.analise_industrial.prioridades_consultoria.join(', ')}
        Potencial Cliente: ${dadosSEFAZ.analise_industrial.potencial_cliente ? 'Alto' : 'Médio'}
        
        Forneça análise detalhada:
        1. Viabilidade como cliente (score 0-100)
        2. Especialização mais adequada
        3. Potencial de ROI realista
        4. Principais desafios esperados
        5. Abordagem comercial recomendada
        6. Timeline de implementação
        7. Investimento estimado
        
        Responda em JSON estruturado considerando os dados oficiais SEFAZ.
        `;

        try {
            const response = await this.openaiClient.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 1000,
                temperature: 0.6
            });

            const analiseIA = JSON.parse(response.choices[0].message.content);
            
            return {
                ...analiseIA,
                dados_sefaz_utilizados: true,
                confidence_score: Math.min(0.95, analiseIA.viabilidade_score / 100),
                fonte_analise: 'IA + SEFAZ'
            };
            
        } catch (error) {
            console.log('Erro na análise IA, usando análise SEFAZ padrão');
            return {
                viabilidade_score: dadosSEFAZ.analise_industrial.potencial_cliente ? 75 : 45,
                especializacao_recomendada: dadosSEFAZ.analise_industrial.especializacao_recomendada,
                roi_estimado: dadosSEFAZ.porte === 'DEMAIS' ? '300-500%' : '200-350%',
                timeline_meses: dadosSEFAZ.analise_industrial.setor_identificado === 'quimica' ? 8 : 6,
                investimento_estimado: this.calcularInvestimentoEstimado(dadosSEFAZ.porte),
                abordagem_comercial: this.definirAbordagemComercial(dadosSEFAZ),
                dados_sefaz_utilizados: true,
                confidence_score: 0.75,
                fonte_analise: 'SEFAZ'
            };
        }
    }

    calcularInvestimentoEstimado(porte) {
        const investimentos = {
            'MICRO EMPRESA': 'R$ 15.000 - R$ 40.000',
            'EMPRESA DE PEQUENO PORTE': 'R$ 30.000 - R$ 80.000',
            'DEMAIS': 'R$ 80.000 - R$ 300.000'
        };
        
        return investimentos[porte] || 'R$ 50.000 - R$ 150.000';
    }

    definirAbordagemComercial(dadosSEFAZ) {
        if (dadosSEFAZ.situacao_cadastral !== 'ATIVA') {
            return 'Aguardar regularização da situação cadastral';
        }
        
        if (dadosSEFAZ.porte === 'MICRO EMPRESA') {
            return 'Focar em soluções simples, baixo custo e rápido retorno';
        } else if (dadosSEFAZ.porte === 'EMPRESA DE PEQUENO PORTE') {
            return 'Demonstrar cases de sucesso e ROI tangível';
        } else {
            return 'Apresentação técnica detalhada com foco em inovação';
        }
    }

    async gerarDiagnosticoIA(clienteId) {
        try {
            const cliente = await ClienteIndustrial.findById(clienteId);
            if (!cliente) throw new Error('Cliente não encontrado');

            const diagnostico = {
                cliente_id: clienteId,
                data_diagnostico: new Date().toISOString(),
                situacao_atual: {},
                oportunidades: [],
                recomendacoes: [],
                roi_projetado: null
            };

            if (this.openaiClient) {
                try {
                    const prompt = `
                    Gere um diagnóstico industrial detalhado para:
                    
                    Empresa: ${cliente.nomeEmpresa}
                    Setor: ${cliente.setor}
                    Funcionários: ${cliente.numeroFuncionarios}
                    Desafios: ${cliente.desafios?.join(', ')}
                    Especialização: ${cliente.especializacao}
                    
                    Inclua:
                    1. Análise da situação atual
                    2. Principais oportunidades de melhoria
                    3. Recomendações específicas por especialização
                    4. ROI projetado realista
                    5. Timeline de implementação
                    6. KPIs a serem monitorados
                    
                    Formato JSON estruturado.
                    `;

                    const response = await this.openaiClient.chat.completions.create({
                        model: 'gpt-4o-mini',
                        messages: [{ role: 'user', content: prompt }],
                        max_tokens: 1200,
                        temperature: 0.6
                    });

                    Object.assign(diagnostico, JSON.parse(response.choices[0].message.content));
                } catch (error) {
                    console.log('Usando diagnóstico template offline');
                }
            }

            // Fallback se IA não disponível
            if (!diagnostico.situacao_atual.resumo) {
                diagnostico.situacao_atual = {
                    resumo: `Análise inicial para ${cliente.nomeEmpresa}`,
                    areas_criticas: ['Eficiência operacional', 'Controle de qualidade', 'Gestão de estoque'],
                    indicadores_atuais: 'Em avaliação',
                    nivel_maturidade: 'Básico'
                };
                diagnostico.oportunidades = [
                    'Implementação de metodologia Lean Manufacturing',
                    'Automação de processos críticos',
                    'Sistema de gestão visual (5S)',
                    'Controle estatístico de qualidade (CEP)',
                    'OEE Dashboard em tempo real'
                ];
                diagnostico.roi_projetado = '250-400% em 8-12 meses';
                diagnostico.timeline_meses = 6;
            }

            // Salvar diagnóstico no histórico do cliente
            await this.adicionarHistorico(clienteId, 'Diagnóstico IA gerado', 'diagnostico', diagnostico);
            
            return diagnostico;
        } catch (error) {
            console.error('Erro ao gerar diagnóstico:', error);
            throw error;
        }
    }

    async gerarRelatorioExecutivo(clienteId) {
        try {
            const cliente = await ClienteIndustrial.findById(clienteId);
            if (!cliente) throw new Error('Cliente não encontrado');

            const relatorio = {
                cliente: cliente.nomeEmpresa,
                data: new Date().toLocaleDateString('pt-BR'),
                resumo_executivo: {},
                kpis_principais: {},
                recomendacoes: [],
                proximos_passos: []
            };

            if (this.openaiClient) {
                try {
                    const prompt = `
                    Gere um relatório executivo de consultoria industrial para:
                    
                    Cliente: ${cliente.nomeEmpresa}
                    Setor: ${cliente.setor}
                    Funcionários: ${cliente.numeroFuncionarios}
                    Etapa: ${cliente.etapaConsultoria}
                    Especialização: ${cliente.especializacao}
                    KPIs Atuais: OEE ${cliente.kpis?.oee_atual || 'N/A'}%, Defeitos ${cliente.kpis?.defeitos_percentual || 'N/A'}%
                    
                    Inclua:
                    1. Resumo executivo profissional
                    2. KPIs principais e metas
                    3. Recomendações estratégicas
                    4. Próximos passos priorizados
                    5. Timeline de implementação
                    6. ROI esperado por fase
                    
                    Formato executivo profissional em JSON.
                    `;

                    const response = await this.openaiClient.chat.completions.create({
                        model: 'gpt-4o-mini',
                        messages: [{ role: 'user', content: prompt }],
                        max_tokens: 1000,
                        temperature: 0.5
                    });

                    Object.assign(relatorio, JSON.parse(response.choices[0].message.content));
                } catch (error) {
                    console.log('Usando relatório template offline');
                }
            }

            // Template offline personalizado por especialização
            if (!relatorio.resumo_executivo.situacao) {
                const especializacaoData = this.getTemplateEspecializacao(cliente.especializacao);
                
                relatorio.resumo_executivo = {
                    situacao: `Consultoria ${especializacaoData.nome} em andamento para ${cliente.nomeEmpresa}`,
                    progresso: `Fase ${cliente.etapaConsultoria} em execução`,
                    resultado_esperado: especializacaoData.resultado_esperado,
                    prazo_estimado: especializacaoData.prazo
                };
                
                relatorio.kpis_principais = especializacaoData.kpis;
                relatorio.proximos_passos = especializacaoData.proximos_passos;
                relatorio.investimento_estimado = especializacaoData.investimento;
            }

            // Salvar relatório no histórico
            await this.adicionarHistorico(clienteId, 'Relatório executivo gerado', 'relatorio', relatorio);
            
            return relatorio;
        } catch (error) {
            console.error('Erro ao gerar relatório:', error);
            throw error;
        }
    }

    getTemplateEspecializacao(especializacao) {
        const templates = {
            lean_manufacturing: {
                nome: 'Lean Manufacturing',
                resultado_esperado: 'Redução de 30-50% dos desperdícios e aumento de 25% na produtividade',
                prazo: '4-6 meses',
                kpis: {
                    oee_target: '85%+',
                    reducao_desperdicios: '30-50%',
                    tempo_setup: '-40%',
                    estoque_wip: '-60%'
                },
                proximos_passos: [
                    'Mapeamento completo do fluxo de valor',
                    'Implementação de 5S nas áreas piloto',
                    'Setup de células de produção lean',
                    'Treinamento equipe em metodologia Lean'
                ],
                investimento: 'R$ 50.000 - R$ 150.000'
            },
            iso_compliance: {
                nome: 'ISO Compliance',
                resultado_esperado: 'Certificação ISO e melhoria de 40% nos processos de qualidade',
                prazo: '8-12 meses',
                kpis: {
                    conformidade: '95%+',
                    nao_conformidades: '-70%',
                    satisfacao_cliente: '90%+',
                    eficiencia_auditoria: '80%+'
                },
                proximos_passos: [
                    'Diagnóstico de conformidade atual',
                    'Elaboração da documentação ISO',
                    'Treinamento de equipe auditora interna',
                    'Pré-auditoria e certificação'
                ],
                investimento: 'R$ 80.000 - R$ 200.000'
            },
            industry_40: {
                nome: 'Indústria 4.0',
                resultado_esperado: 'Digitalização completa e aumento de 60% na eficiência',
                prazo: '6-10 meses',
                kpis: {
                    digitalizacao: '90%+',
                    tempo_real_monitoramento: '100%',
                    predictive_maintenance: '80%',
                    data_driven_decisions: '85%'
                },
                proximos_passos: [
                    'Auditoria de infraestrutura tecnológica',
                    'Implementação de sensores IoT',
                    'Desenvolvimento de dashboards real-time',
                    'Integração com sistemas ERP'
                ],
                investimento: 'R$ 200.000 - R$ 500.000'
            },
            safety_management: {
                nome: 'Gestão de Segurança',
                resultado_esperado: 'Zero acidentes e 100% conformidade NR-12',
                prazo: '3-6 meses',
                kpis: {
                    acidentes: '0',
                    near_miss_reporting: '100%',
                    conformidade_nr12: '100%',
                    cultura_seguranca: '90%+'
                },
                proximos_passos: [
                    'Avaliação completa de riscos (APR)',
                    'Adequação de máquinas à NR-12',
                    'Treinamento em segurança comportamental',
                    'Implementação de sistema de near miss'
                ],
                investimento: 'R$ 30.000 - R$ 100.000'
            }
        };

        return templates[especializacao] || templates.lean_manufacturing;
    }

    async adicionarHistorico(clienteId, acao, tipo, detalhes = null) {
        try {
            await ClienteIndustrial.findByIdAndUpdate(
                clienteId,
                {
                    $push: {
                        historico: {
                            timestamp: new Date(),
                            acao,
                            tipo,
                            usuario: 'sistema',
                            detalhes
                        }
                    },
                    dataUpdated: new Date()
                }
            );
        } catch (error) {
            console.error('Erro ao adicionar histórico:', error);
        }
    }

    async gerarEstatisticasDashboard() {
        try {
            const stats = await Promise.all([
                ClienteIndustrial.countDocuments(),
                ClienteIndustrial.countDocuments({ status: 'ativo' }),
                ClienteIndustrial.countDocuments({ etapaConsultoria: 'implementacao' }),
                ClienteIndustrial.aggregate([
                    { $group: { _id: '$setor', count: { $sum: 1 } } },
                    { $sort: { count: -1 } }
                ]),
                ClienteIndustrial.aggregate([
                    { $group: { _id: '$especializacao', count: { $sum: 1 } } }
                ]),
                ClienteIndustrial.aggregate([
                    { $group: { _id: '$etapaConsultoria', count: { $sum: 1 } } }
                ])
            ]);

            return {
                total_clientes: stats[0],
                clientes_ativos: stats[1],
                projetos_implementacao: stats[2],
                clientes_por_setor: stats[3],
                especializacoes: stats[4],
                pipeline: stats[5],
                ultima_atualizacao: new Date().toISOString()
            };
        } catch (error) {
            console.error('Erro ao gerar estatísticas:', error);
            return {
                total_clientes: 0,
                clientes_ativos: 0,
                projetos_implementacao: 0,
                erro: 'Dados indisponíveis temporariamente'
            };
        }
    }

    getDashboardHTML() {
        return `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>ArcSat Industrial - Gestão de Clientes</title>
            <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 20px; background: #f5f7fa; }
                .header { background: linear-gradient(135deg, #0077FF, #00E0FF); color: white; padding: 20px; border-radius: 10px; margin-bottom: 20px; }
                .container { max-width: 1200px; margin: 0 auto; }
                .cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-bottom: 30px; }
                .card { background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                .btn { background: #0077FF; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; text-decoration: none; display: inline-block; margin: 5px; }
                .btn:hover { background: #0056CC; }
                .status { padding: 5px 10px; border-radius: 20px; font-size: 12px; font-weight: bold; }
                .status.ativo { background: #e8f5e8; color: #2d5a2d; }
                .footer { text-align: center; margin-top: 40px; color: #666; }
                #clientes { margin-top: 20px; }
                .cliente-item { background: white; margin: 10px 0; padding: 15px; border-radius: 8px; border-left: 4px solid #0077FF; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🏭 ArcSat Industrial - Gestão de Clientes</h1>
                    <p>Sistema inteligente para consultoria industrial com IA</p>
                </div>
                
                <div class="cards">
                    <div class="card">
                        <h3>� Busca por CNPJ</h3>
                        <p>Criar cliente automaticamente via CNPJ com dados da Receita Federal</p>
                        <input type="text" id="cnpjInput" placeholder="Digite o CNPJ (somente números)" maxlength="14" style="width: 100%; padding: 10px; margin: 10px 0; border: 1px solid #ddd; border-radius: 5px;">
                        <button class="btn" onclick="buscarPorCNPJ()">🏭 Buscar na SEFAZ</button>
                        <button class="btn" onclick="validarCNPJ()">✅ Validar CNPJ</button>
                    </div>
                    
                    <div class="card">
                        <h3>�📊 Novo Cliente Manual</h3>
                        <p>Cadastrar nova indústria manualmente</p>
                        <button class="btn" onclick="novoCliente()">+ Adicionar Cliente</button>
                    </div>
                    
                    <div class="card">
                        <h3>🔍 Diagnóstico IA</h3>
                        <p>Gerar análise automática com inteligência artificial</p>
                        <button class="btn" onclick="gerarDiagnostico()">🤖 Diagnóstico IA</button>
                    </div>
                    
                    <div class="card">
                        <h3>📋 Relatório Executivo</h3>
                        <p>Relatório profissional para apresentação</p>
                        <button class="btn" onclick="gerarRelatorio()">📊 Gerar Relatório</button>
                    </div>
                </div>
                
                <div class="card">
                    <h3>📈 Resultado da Consulta SEFAZ</h3>
                    <div id="resultadoSefaz" style="display: none;">
                        <div id="dadosEmpresa"></div>
                        <button class="btn" onclick="criarClienteSefaz()" id="btnCriarSefaz" style="display: none;">🏭 Criar Cliente com Dados SEFAZ</button>
                    </div>
                </div>
                
                <div class="card">
                    <h3>👥 Clientes Ativos</h3>
                    <div id="clientes">Carregando clientes...</div>
                    <button class="btn" onclick="carregarClientes()">🔄 Atualizar Lista</button>
                </div>
            </div>
            
            <div class="footer">
                <p>🚀 ArcSat Industrial - Powered by Azure AI | Status: <span id="status">Verificando...</span></p>
            </div>

            <script>
                let dadosSefazGlobal = null;

                // Verificar status do sistema
                fetch('/health')
                    .then(r => r.json())
                    .then(data => {
                        const status = data.mongodb === 'connected' && data.azure_ai ? '✅ Todos os sistemas Online' : 
                                     data.mongodb === 'connected' ? '⚠️ MongoDB OK, IA Offline' : '❌ MongoDB Offline';
                        document.getElementById('status').textContent = status;
                    });

                // Formatar CNPJ enquanto digita
                document.addEventListener('DOMContentLoaded', function() {
                    const cnpjInput = document.getElementById('cnpjInput');
                    if (cnpjInput) {
                        cnpjInput.addEventListener('input', function(e) {
                            let value = e.target.value.replace(/\\D/g, '');
                            if (value.length <= 14) {
                                e.target.value = value;
                            }
                        });
                    }
                });

                // Validar CNPJ
                function validarCNPJ() {
                    const cnpj = document.getElementById('cnpjInput').value;
                    if (!cnpj) {
                        alert('Digite um CNPJ para validar');
                        return;
                    }

                    fetch('/api/sefaz/validar/' + cnpj)
                        .then(r => r.json())
                        .then(data => {
                            if (data.success) {
                                if (data.valido) {
                                    alert('✅ CNPJ válido! Pode prosseguir com a consulta.');
                                } else {
                                    alert('❌ CNPJ inválido: ' + data.erro);
                                }
                            }
                        })
                        .catch(err => alert('Erro na validação: ' + err.message));
                }

                // Buscar dados na SEFAZ
                function buscarPorCNPJ() {
                    const cnpj = document.getElementById('cnpjInput').value;
                    if (!cnpj) {
                        alert('Digite um CNPJ para buscar');
                        return;
                    }

                    const resultadoDiv = document.getElementById('resultadoSefaz');
                    const dadosDiv = document.getElementById('dadosEmpresa');
                    
                    resultadoDiv.style.display = 'block';
                    dadosDiv.innerHTML = '<p>🔍 Consultando SEFAZ...</p>';

                    fetch('/api/sefaz/consultar/' + cnpj)
                        .then(r => r.json())
                        .then(data => {
                            if (data.success) {
                                dadosSefazGlobal = data;
                                exibirDadosSefaz(data);
                                document.getElementById('btnCriarSefaz').style.display = 'inline-block';
                            } else {
                                dadosDiv.innerHTML = '<p style="color: red;">❌ ' + data.error + '</p>';
                                document.getElementById('btnCriarSefaz').style.display = 'none';
                            }
                        })
                        .catch(err => {
                            dadosDiv.innerHTML = '<p style="color: red;">❌ Erro de conexão: ' + err.message + '</p>';
                            document.getElementById('btnCriarSefaz').style.display = 'none';
                        });
                }

                // Exibir dados obtidos da SEFAZ
                function exibirDadosSefaz(data) {
                    const sefaz = data.dados_sefaz;
                    const cliente = data.dados_cliente;
                    const recom = data.recomendacoes;
                    
                    const statusClass = sefaz.situacao_cadastral === 'ATIVA' ? 'ativo' : 'inativo';
                    
                    document.getElementById('dadosEmpresa').innerHTML = 
                        '<h4>🏭 ' + sefaz.razao_social + ' <span class="status ' + statusClass + '">' + sefaz.situacao_cadastral + '</span></h4>' +
                        '<p><strong>CNPJ:</strong> ' + sefaz.cnpj + '</p>' +
                        '<p><strong>Nome Fantasia:</strong> ' + (sefaz.nome_fantasia || 'N/A') + '</p>' +
                        '<p><strong>Porte:</strong> ' + sefaz.porte + ' | <strong>Setor:</strong> ' + recom.setor_identificado + '</p>' +
                        '<p><strong>Endereço:</strong> ' + sefaz.endereco.endereco_completo + '</p>' +
                        '<p><strong>Atividade Principal:</strong> ' + (sefaz.atividade_principal?.descricao || 'N/A') + '</p>' +
                        '<p><strong>Especialização Recomendada:</strong> ' + recom.especializacao_recomendada.replace('_', ' ').toUpperCase() + '</p>' +
                        '<p><strong>Potencial Cliente:</strong> ' + (recom.potencial_cliente ? '✅ Alto' : '⚠️ Médio') + '</p>' +
                        '<details><summary><strong>Análise Detalhada</strong></summary>' +
                        '<ul>' + recom.observacoes.map(obs => '<li>' + obs + '</li>').join('') + '</ul>' +
                        '</details>';
                }

                // Criar cliente com dados SEFAZ
                function criarClienteSefaz() {
                    if (!dadosSefazGlobal) {
                        alert('Nenhum dado SEFAZ disponível');
                        return;
                    }

                    const dadosAdicionais = {};
                    
                    // Perguntar dados complementares
                    const responsavel = prompt('Nome do responsável/contato:');
                    const telefone = prompt('Telefone de contato:');
                    const email = prompt('Email de contato:');
                    const desafios = prompt('Principais desafios (separados por vírgula):');
                    
                    if (responsavel) dadosAdicionais['contato.responsavel'] = responsavel;
                    if (telefone) dadosAdicionais['contato.telefone'] = telefone;
                    if (email) dadosAdicionais['contato.email'] = email;
                    if (desafios) dadosAdicionais.desafios = desafios.split(',').map(d => d.trim());

                    fetch('/api/clientes/novo-sefaz', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            cnpj: dadosSefazGlobal.dados_sefaz.cnpj,
                            dadosAdicionais
                        })
                    })
                    .then(r => r.json())
                    .then(data => {
                        if (data.success) {
                            alert('✅ Cliente criado com sucesso!\\n\\nID: ' + data.cliente._id + '\\nEmpresa: ' + data.cliente.nomeEmpresa);
                            carregarClientes();
                            // Limpar formulário
                            document.getElementById('cnpjInput').value = '';
                            document.getElementById('resultadoSefaz').style.display = 'none';
                            dadosSefazGlobal = null;
                        } else {
                            alert('❌ ' + data.error);
                        }
                    })
                    .catch(err => alert('❌ Erro: ' + err.message));
                }

                // Carregar lista de clientes
                function carregarClientes() {
                    fetch('/api/clientes?limit=10')
                        .then(r => r.json())
                        .then(data => {
                            const container = document.getElementById('clientes');
                            if (data.clientes.length === 0) {
                                container.innerHTML = '<p>Nenhum cliente cadastrado ainda.</p>';
                                return;
                            }
                            
                            container.innerHTML = data.clientes.map(cliente => 
                                '<div class="cliente-item">' +
                                '<h4>' + cliente.nomeEmpresa + ' <span class="status ' + cliente.status + '">' + cliente.status + '</span></h4>' +
                                '<p><strong>Setor:</strong> ' + cliente.setor + ' | <strong>Funcionários:</strong> ' + cliente.numeroFuncionarios + '</p>' +
                                '<p><strong>Etapa:</strong> ' + cliente.etapaConsultoria + ' | <strong>Especialização:</strong> ' + cliente.especializacao + '</p>' +
                                '<p><strong>Criado:</strong> ' + new Date(cliente.dataCreated).toLocaleDateString('pt-BR') + '</p>' +
                                '<button class="btn" onclick="verDiagnostico(\\'' + cliente._id + '\\')">🔍 Diagnóstico</button>' +
                                '<button class="btn" onclick="verRelatorio(\\'' + cliente._id + '\\')">📊 Relatório</button>' +
                                '</div>'
                            ).join('');
                            
                            // Mostrar informação de paginação
                            if (data.pagination) {
                                container.innerHTML += '<p><strong>Total:</strong> ' + data.pagination.total + ' clientes</p>';
                            }
                        })
                        .catch(err => {
                            document.getElementById('clientes').innerHTML = '<p>Erro ao carregar clientes. Verifique se o servidor está rodando.</p>';
                            console.error('Erro:', err);
                        });
                }

                function novoCliente() {
                    const nome = prompt('Nome da empresa:');
                    const setor = prompt('Setor (ex: metalurgica, automotiva, quimica, alimenticia):');
                    const funcionarios = prompt('Número de funcionários:');
                    const cnpj = prompt('CNPJ (opcional):');
                    const desafios = prompt('Principais desafios (separados por vírgula):');
                    const especializacao = prompt('Especialização (lean_manufacturing, iso_compliance, industry_40, safety_management):') || 'lean_manufacturing';
                    
                    if (nome && setor && funcionarios) {
                        const clienteData = {
                            nomeEmpresa: nome,
                            setor: setor,
                            numeroFuncionarios: parseInt(funcionarios),
                            especializacao: especializacao
                        };
                        
                        if (cnpj) clienteData.cnpj = cnpj;
                        if (desafios) clienteData.desafios = desafios.split(',').map(d => d.trim());
                        
                        fetch('/api/clientes/novo', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(clienteData)
                        })
                        .then(r => r.json())
                        .then(data => {
                            if (data.success) {
                                alert('✅ Cliente criado com sucesso! ID: ' + data.cliente._id);
                                carregarClientes();
                            } else {
                                alert('❌ Erro: ' + (data.error || 'Erro desconhecido'));
                            }
                        })
                        .catch(err => {
                            alert('❌ Erro de conexão: ' + err.message);
                        });
                    }
                }

                function gerarDiagnostico() {
                    const clienteId = prompt('ID do cliente (ou deixe vazio para o último):');
                    if (!clienteId) {
                        alert('Primeiro cadastre um cliente');
                        return;
                    }
                    
                    fetch('/api/clientes/' + clienteId + '/diagnostico')
                        .then(r => r.json())
                        .then(data => {
                            alert('✅ Diagnóstico gerado! Verifique o console para detalhes.');
                            console.log('Diagnóstico:', data.diagnostico);
                        });
                }

                function verDiagnostico(clienteId) {
                    fetch('/api/clientes/' + clienteId + '/diagnostico')
                        .then(r => r.json())
                        .then(data => {
                            alert('Diagnóstico gerado! Verifique o console para detalhes.');
                            console.log('Diagnóstico:', data.diagnostico);
                        });
                }

                function verRelatorio(clienteId) {
                    fetch('/api/clientes/' + clienteId + '/relatorio')
                        .then(r => r.json())
                        .then(data => {
                            alert('Relatório gerado! Verifique o console para detalhes.');
                            console.log('Relatório:', data.relatorio);
                        });
                }

                // Carregar clientes ao iniciar
                carregarClientes();
            </script>
        </body>
        </html>
        `;
    }

    start() {
        this.app.listen(this.port, () => {
            console.log(`🚀 ArcSat Industrial - Gestão de Clientes`);
            console.log(`🌐 Servidor rodando em: http://localhost:${this.port}`);
            console.log(`📊 Dashboard disponível em: http://localhost:${this.port}/dashboard`);
            console.log(`🤖 Azure AI: ${this.openaiClient ? 'Conectado' : 'Offline'}`);
            console.log(`⏰ Iniciado em: ${new Date().toLocaleString('pt-BR')}`);
        });
    }
}

// Inicializar o sistema
const gestaoClientes = new GestaoClientesIndustrial();
gestaoClientes.start();