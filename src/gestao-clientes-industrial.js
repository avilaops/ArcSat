// ArcSat Industrial - Gestão de Clientes para Consultoria
// Módulo integrado com MongoDB Atlas e Azure AI

const { OpenAIClient, AzureKeyCredential } = require('@azure/openai');
const { DefaultAzureCredential } = require('@azure/identity');
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

// Schema do Cliente Industrial
const ClienteIndustrialSchema = new mongoose.Schema({
    nomeEmpresa: { type: String, required: true },
    cnpj: { type: String, unique: true },
    setor: { type: String, required: true },
    numeroFuncionarios: { type: Number, required: true },
    endereco: {
        cep: String,
        cidade: String,
        estado: String,
        endereco: String
    },
    contato: {
        responsavel: String,
        telefone: String,
        email: String
    },
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
    kpis: {
        oee_atual: Number,
        oee_target: Number,
        defeitos_percentual: Number,
        produtividade_baseline: Number,
        custos_manutencao: Number,
        tempo_setup: Number,
        disponibilidade: Number
    },
    analise_ia: {
        especializacao_recomendada: String,
        prioridades: [String],
        roi_estimado: String,
        timeline_meses: Number,
        modulos: [String],
        confidence_score: Number
    },
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
    dataCreated: { type: Date, default: Date.now },
    dataUpdated: { type: Date, default: Date.now }
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
            // Configurar Azure OpenAI
            const endpoint = process.env.AZURE_OPENAI_ENDPOINT || 'https://arcsat-resource.openai.azure.com/';
            const apiKey = process.env.AZURE_OPENAI_API_KEY;
            
            if (apiKey) {
                this.openaiClient = new OpenAIClient(endpoint, new AzureKeyCredential(apiKey));
                console.log('✅ Azure OpenAI configurado com sucesso');
            } else {
                console.log('⚠️  Azure OpenAI API Key não encontrada, usando modo offline');
            }
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

        // Gestão de Clientes Industriais
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

    async analisarPerfilCliente(cliente) {
        if (!this.openaiClient) {
            return { status: 'offline', message: 'IA não disponível' };
        }

        const prompt = `
        Analise o perfil desta indústria para consultoria:
        
        Empresa: ${cliente.nomeEmpresa}
        Setor: ${cliente.setor}
        Funcionários: ${cliente.numeroFuncionarios}
        Principais Desafios: ${cliente.desafios || 'Não especificado'}
        
        Forneça:
        1. Especialização recomendada (Lean, ISO, Indústria 4.0, Segurança)
        2. Prioridades de consultoria
        3. ROI estimado
        4. Timeline sugerida
        5. Módulos recomendados
        
        Responda em formato JSON estruturado.
        `;

        try {
            const response = await this.openaiClient.getChatCompletions(
                'gpt-4o-mini', // ou o modelo que você tem disponível
                [{ role: 'user', content: prompt }],
                { maxTokens: 800, temperature: 0.7 }
            );

            return JSON.parse(response.choices[0].message.content);
        } catch (error) {
            return { 
                especializacao_recomendada: 'lean_manufacturing',
                prioridades: ['reducao_desperdicios', 'aumento_produtividade'],
                roi_estimado: '250-400%',
                timeline_meses: 6,
                modulos: ['diagnostico_lean', 'kanban_digital', 'oee_dashboard']
            };
        }
    }

    async gerarDiagnosticoIA(clienteId) {
        const cliente = this.clientes.get(clienteId);
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
                Desafios: ${cliente.desafios}
                
                Inclua:
                1. Análise da situação atual
                2. Principais oportunidades de melhoria
                3. Recomendações específicas
                4. ROI projetado
                5. Próximos passos prioritários
                
                Formato JSON estruturado.
                `;

                const response = await this.openaiClient.getChatCompletions(
                    'gpt-4o-mini',
                    [{ role: 'user', content: prompt }],
                    { maxTokens: 1200, temperature: 0.6 }
                );

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
                indicadores_atuais: 'Em avaliação'
            };
            diagnostico.oportunidades = [
                'Implementação de metodologia Lean',
                'Automação de processos críticos',
                'Sistema de gestão visual',
                'Controle estatístico de qualidade'
            ];
            diagnostico.roi_projetado = '250-400% em 8-12 meses';
        }

        this.adicionarHistorico(clienteId, 'Diagnóstico gerado', 'diagnostico');
        return diagnostico;
    }

    async gerarRelatorioExecutivo(clienteId) {
        const cliente = this.clientes.get(clienteId);
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
                Etapa: ${cliente.etapaConsultoria}
                
                Inclua:
                1. Resumo executivo
                2. KPIs principais
                3. Recomendações estratégicas
                4. Próximos passos
                5. Timeline de implementação
                
                Formato executivo profissional em JSON.
                `;

                const response = await this.openaiClient.getChatCompletions(
                    'gpt-4o-mini',
                    [{ role: 'user', content: prompt }],
                    { maxTokens: 1000, temperature: 0.5 }
                );

                Object.assign(relatorio, JSON.parse(response.choices[0].message.content));
            } catch (error) {
                console.log('Usando relatório template offline');
            }
        }

        // Template offline
        if (!relatorio.resumo_executivo.situacao) {
            relatorio.resumo_executivo = {
                situacao: `Consultoria em andamento para ${cliente.nomeEmpresa}`,
                progresso: 'Fase de diagnóstico concluída',
                resultado_esperado: 'Aumento de 30-50% na eficiência operacional'
            };
            relatorio.kpis_principais = {
                eficiencia: 'Em avaliação',
                qualidade: 'Baseline sendo estabelecido',
                produtividade: 'Potencial de melhoria identificado'
            };
            relatorio.proximos_passos = [
                'Implementação de sistema Kanban',
                'Treinamento de equipe em Lean',
                'Setup de dashboards de monitoramento',
                'Início da fase de implementação'
            ];
        }

        this.adicionarHistorico(clienteId, 'Relatório executivo gerado', 'relatorio');
        return relatorio;
    }

    adicionarHistorico(clienteId, acao, tipo) {
        const cliente = this.clientes.get(clienteId);
        if (cliente) {
            cliente.historico.push({
                timestamp: new Date().toISOString(),
                acao,
                tipo,
                usuario: 'sistema'
            });
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
                        <h3>📊 Novo Cliente</h3>
                        <p>Cadastrar nova indústria para consultoria</p>
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
                    <h3>👥 Clientes Ativos</h3>
                    <div id="clientes">Carregando clientes...</div>
                    <button class="btn" onclick="carregarClientes()">🔄 Atualizar Lista</button>
                </div>
            </div>
            
            <div class="footer">
                <p>🚀 ArcSat Industrial - Powered by Azure AI | Status: <span id="status">Verificando...</span></p>
            </div>

            <script>
                // Verificar status do sistema
                fetch('/health')
                    .then(r => r.json())
                    .then(data => {
                        document.getElementById('status').textContent = data.azure_ai ? '✅ IA Online' : '⚠️ IA Offline';
                    });

                // Carregar lista de clientes
                function carregarClientes() {
                    fetch('/api/clientes')
                        .then(r => r.json())
                        .then(data => {
                            const container = document.getElementById('clientes');
                            if (data.clientes.length === 0) {
                                container.innerHTML = '<p>Nenhum cliente cadastrado ainda.</p>';
                                return;
                            }
                            
                            container.innerHTML = data.clientes.map(cliente => 
                                '<div class="cliente-item">' +
                                '<h4>' + cliente.nomeEmpresa + ' <span class="status ativo">' + cliente.status + '</span></h4>' +
                                '<p><strong>Setor:</strong> ' + cliente.setor + ' | <strong>Funcionários:</strong> ' + cliente.numeroFuncionarios + '</p>' +
                                '<p><strong>Etapa:</strong> ' + cliente.etapaConsultoria + '</p>' +
                                '<button class="btn" onclick="verDiagnostico(\\'' + cliente.id + '\\')">🔍 Diagnóstico</button>' +
                                '<button class="btn" onclick="verRelatorio(\\'' + cliente.id + '\\')">📊 Relatório</button>' +
                                '</div>'
                            ).join('');
                        });
                }

                function novoCliente() {
                    const nome = prompt('Nome da empresa:');
                    const setor = prompt('Setor (ex: metalurgica, automotiva, quimica):');
                    const funcionarios = prompt('Número de funcionários:');
                    const desafios = prompt('Principais desafios:');
                    
                    if (nome && setor && funcionarios) {
                        fetch('/api/clientes/novo', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                nomeEmpresa: nome,
                                setor: setor,
                                numeroFuncionarios: parseInt(funcionarios),
                                desafios: desafios
                            })
                        })
                        .then(r => r.json())
                        .then(data => {
                            alert('✅ Cliente criado com sucesso!');
                            carregarClientes();
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