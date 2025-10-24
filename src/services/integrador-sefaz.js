// Módulo de Integração com SEFAZ/ReceitaWS para ArcSat Industrial
// Busca automática de dados empresariais via CNPJ

import axios from 'axios';

class IntegradorSEFAZ {
    constructor() {
        this.baseURL = 'https://www.receitaws.com.br/v1/cnpj/';
        this.timeout = 10000; // 10 segundos
        this.cache = new Map(); // Cache simples em memória
        this.cacheTimeout = 24 * 60 * 60 * 1000; // 24 horas
    }

    // Limpar e validar CNPJ
    limparCNPJ(cnpj) {
        if (!cnpj) return null;
        return cnpj.replace(/[^\d]/g, '');
    }

    // Validar formato do CNPJ
    validarCNPJ(cnpj) {
        const cnpjLimpo = this.limparCNPJ(cnpj);
        
        // Verificar se tem 14 dígitos
        if (!cnpjLimpo || cnpjLimpo.length !== 14) {
            return { valido: false, erro: 'CNPJ deve ter 14 dígitos' };
        }

        // Verificar se não são todos iguais
        if (/^(\d)\1{13}$/.test(cnpjLimpo)) {
            return { valido: false, erro: 'CNPJ inválido - dígitos iguais' };
        }

        // Validação dos dígitos verificadores
        let soma = 0;
        let pos = 5;
        
        for (let i = 0; i < 12; i++) {
            soma += parseInt(cnpjLimpo.charAt(i)) * pos--;
            if (pos < 2) pos = 9;
        }
        
        let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado !== parseInt(cnpjLimpo.charAt(12))) {
            return { valido: false, erro: 'CNPJ inválido - primeiro dígito verificador' };
        }
        
        soma = 0;
        pos = 6;
        for (let i = 0; i < 13; i++) {
            soma += parseInt(cnpjLimpo.charAt(i)) * pos--;
            if (pos < 2) pos = 9;
        }
        
        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado !== parseInt(cnpjLimpo.charAt(13))) {
            return { valido: false, erro: 'CNPJ inválido - segundo dígito verificador' };
        }

        return { valido: true };
    }

    // Buscar dados na ReceitaWS
    async buscarDadosSEFAZ(cnpj) {
        const cnpjLimpo = this.limparCNPJ(cnpj);
        
        // Validar CNPJ primeiro
        const validacao = this.validarCNPJ(cnpjLimpo);
        if (!validacao.valido) {
            throw new Error(validacao.erro);
        }

        // Verificar cache
        const cacheKey = cnpjLimpo;
        const cached = this.cache.get(cacheKey);
        if (cached && (Date.now() - cached.timestamp) < this.cacheTimeout) {
            console.log('📋 Dados obtidos do cache');
            return cached.data;
        }

        try {
            console.log(`🔍 Buscando dados SEFAZ para CNPJ: ${cnpjLimpo}`);
            
            const response = await axios.get(`${this.baseURL}${cnpjLimpo}`, {
                timeout: this.timeout,
                headers: {
                    'User-Agent': 'ArcSat-Industrial-CRM/1.0.0',
                    'Accept': 'application/json'
                }
            });

            const dados = response.data;

            // Verificar se a consulta foi bem-sucedida
            if (dados.status === 'ERROR') {
                throw new Error(dados.message || 'Erro na consulta SEFAZ');
            }

            // Processar e estruturar os dados
            const dadosProcessados = this.processarDadosSEFAZ(dados);

            // Armazenar no cache
            this.cache.set(cacheKey, {
                data: dadosProcessados,
                timestamp: Date.now()
            });

            console.log(`✅ Dados SEFAZ obtidos para: ${dadosProcessados.razao_social}`);
            return dadosProcessados;

        } catch (error) {
            console.error('❌ Erro ao buscar dados SEFAZ:', error.message);
            
            if (error.code === 'ECONNABORTED') {
                throw new Error('Timeout na consulta SEFAZ - tente novamente');
            } else if (error.response?.status === 429) {
                throw new Error('Muitas consultas - aguarde alguns minutos');
            } else if (error.response?.status === 400) {
                throw new Error('CNPJ não encontrado na base da Receita Federal');
            } else {
                throw new Error(`Erro na consulta SEFAZ: ${error.message}`);
            }
        }
    }

    // Processar e mapear dados da SEFAZ para o formato do sistema
    processarDadosSEFAZ(dados) {
        return {
            // Dados básicos
            cnpj: dados.cnpj,
            razao_social: dados.nome,
            nome_fantasia: dados.fantasia || dados.nome,
            
            // Situação cadastral
            situacao_cadastral: dados.situacao,
            data_abertura: dados.abertura,
            data_situacao: dados.data_situacao,
            motivo_situacao: dados.motivo_situacao,
            
            // Classificação
            natureza_juridica: dados.natureza_juridica,
            porte: dados.porte,
            capital_social: dados.capital_social,
            
            // Endereço completo
            endereco: {
                cep: dados.cep,
                logradouro: dados.logradouro,
                numero: dados.numero,
                complemento: dados.complemento,
                bairro: dados.bairro,
                municipio: dados.municipio,
                uf: dados.uf,
                endereco_completo: `${dados.logradouro}, ${dados.numero}${dados.complemento ? ` - ${dados.complemento}` : ''}, ${dados.bairro}, ${dados.municipio}/${dados.uf}, CEP: ${dados.cep}`
            },
            
            // Contato
            contato: {
                telefone: dados.telefone,
                email: dados.email
            },
            
            // Atividades
            atividade_principal: dados.atividade_principal ? {
                codigo: dados.atividade_principal[0]?.code,
                descricao: dados.atividade_principal[0]?.text
            } : null,
            
            atividades_secundarias: dados.atividades_secundarias?.map(ativ => ({
                codigo: ativ.code,
                descricao: ativ.text
            })) || [],
            
            // Quadro societário (se disponível)
            quadro_societario: dados.qsa?.map(socio => ({
                nome: socio.nome,
                qualificacao: socio.qual,
                pais_origem: socio.pais_origem,
                nome_rep_legal: socio.nome_rep_legal,
                qual_rep_legal: socio.qual_rep_legal
            })) || [],
            
            // Metadados
            ultima_atualizacao: dados.ultima_atualizacao,
            status_receita: dados.status,
            data_consulta: new Date().toISOString(),
            
            // Análise automática para classificação industrial
            analise_industrial: this.analisarPerfilIndustrial(dados),
            
            // Dados originais para referência
            dados_originais_sefaz: dados
        };
    }

    // Analisar perfil industrial baseado nas atividades CNAE
    analisarPerfilIndustrial(dados) {
        const atividades = [
            ...(dados.atividade_principal || []),
            ...(dados.atividades_secundarias || [])
        ];

        const setoresIndustriais = {
            metalurgica: ['24', '25', '26', '27', '28', '29', '30'],
            automotiva: ['29', '30', '45'],
            quimica: ['20', '21'],
            alimenticia: ['10', '11'],
            textil: ['13', '14', '15'],
            farmaceutica: ['21'],
            construcao: ['23', '41', '42', '43'],
            eletronico: ['26', '27'],
            papel: ['17', '18'],
            plastico: ['22'],
            madeira: ['16', '31'],
            mineracao: ['05', '06', '07', '08', '09']
        };

        let setorIdentificado = 'outros';
        let especialiacaoRecomendada = 'lean_manufacturing';
        let prioridadesConsultoria = [];

        // Identificar setor principal
        for (const atividade of atividades) {
            const codigoCNAE = atividade.code?.substring(0, 2);
            
            for (const [setor, codigos] of Object.entries(setoresIndustriais)) {
                if (codigos.includes(codigoCNAE)) {
                    setorIdentificado = setor;
                    break;
                }
            }
            
            if (setorIdentificado !== 'outros') break;
        }

        // Definir especialização recomendada baseada no setor
        const especializacoesPorSetor = {
            metalurgica: 'lean_manufacturing',
            automotiva: 'lean_manufacturing',
            quimica: 'safety_management',
            alimenticia: 'iso_compliance',
            farmaceutica: 'iso_compliance',
            eletronico: 'industry_40',
            construcao: 'safety_management'
        };

        especialiacaoRecomendada = especializacoesPorSetor[setorIdentificado] || 'lean_manufacturing';

        // Definir prioridades baseadas no porte
        const prioridadesPorPorte = {
            'MICRO EMPRESA': ['eficiencia_operacional', 'reducao_custos'],
            'EMPRESA DE PEQUENO PORTE': ['padronizacao_processos', 'controle_qualidade'],
            'DEMAIS': ['automacao_avancada', 'industry_40', 'gestao_estrategica']
        };

        prioridadesConsultoria = prioridadesPorPorte[dados.porte] || prioridadesPorPorte['DEMAIS'];

        return {
            setor_identificado: setorIdentificado,
            especializacao_recomendada: especialiacaoRecomendada,
            prioridades_consultoria: prioridadesConsultoria,
            porte_empresa: dados.porte,
            situacao_ativa: dados.situacao === 'ATIVA',
            potencial_cliente: dados.situacao === 'ATIVA' && dados.porte !== 'MICRO EMPRESA',
            observacoes: this.gerarObservacoesConsultoria(dados, setorIdentificado)
        };
    }

    // Gerar observações para consultoria
    gerarObservacoesConsultoria(dados, setor) {
        const observacoes = [];

        if (dados.situacao !== 'ATIVA') {
            observacoes.push('⚠️ Empresa com situação cadastral irregular - verificar antes de abordar');
        }

        if (dados.porte === 'MICRO EMPRESA') {
            observacoes.push('💼 Microempresa - focar em soluções simples e baixo custo');
        } else if (dados.porte === 'EMPRESA DE PEQUENO PORTE') {
            observacoes.push('🏢 Pequena empresa - bom potencial para lean manufacturing');
        } else {
            observacoes.push('🏭 Grande empresa - potencial para projetos complexos e Industry 4.0');
        }

        if (setor === 'quimica' || setor === 'farmaceutica') {
            observacoes.push('🔬 Setor regulamentado - priorizar compliance e segurança');
        }

        if (setor === 'automotiva' || setor === 'metalurgica') {
            observacoes.push('⚙️ Setor manufatureiro - alto potencial para Lean e automação');
        }

        const anosOperacao = new Date().getFullYear() - new Date(dados.abertura.split('/').reverse().join('-')).getFullYear();
        if (anosOperacao > 20) {
            observacoes.push('🕐 Empresa estabelecida - possível resistência a mudanças, focar em ROI');
        } else if (anosOperacao < 5) {
            observacoes.push('🚀 Empresa jovem - maior abertura para inovação');
        }

        return observacoes;
    }

    // Mapear dados SEFAZ para o schema do cliente
    mapearParaSchemaCliente(dadosSEFAZ) {
        const especialização = dadosSEFAZ.analise_industrial.especializacao_recomendada;
        const setor = dadosSEFAZ.analise_industrial.setor_identificado;

        return {
            // Dados obrigatórios
            nomeEmpresa: dadosSEFAZ.razao_social,
            cnpj: dadosSEFAZ.cnpj,
            setor: setor,
            especializacao: especialização,
            
            // Dados detalhados
            nome_fantasia: dadosSEFAZ.nome_fantasia,
            situacao_cadastral: dadosSEFAZ.situacao_cadastral,
            porte_empresa: dadosSEFAZ.porte,
            natureza_juridica: dadosSEFAZ.natureza_juridica,
            data_abertura: dadosSEFAZ.data_abertura,
            capital_social: dadosSEFAZ.capital_social,
            
            // Endereço
            endereco: {
                cep: dadosSEFAZ.endereco.cep,
                cidade: dadosSEFAZ.endereco.municipio,
                estado: dadosSEFAZ.endereco.uf,
                endereco: dadosSEFAZ.endereco.endereco_completo,
                bairro: dadosSEFAZ.endereco.bairro,
                numero: dadosSEFAZ.endereco.numero,
                complemento: dadosSEFAZ.endereco.complemento
            },
            
            // Contato
            contato: {
                telefone: dadosSEFAZ.contato.telefone,
                email: dadosSEFAZ.contato.email
            },
            
            // Atividades
            atividade_principal: dadosSEFAZ.atividade_principal,
            atividades_secundarias: dadosSEFAZ.atividades_secundarias,
            
            // Status inicial baseado na análise
            status: dadosSEFAZ.analise_industrial.situacao_ativa ? 'lead' : 'inativo',
            etapaConsultoria: 'diagnostico_inicial',
            
            // Análise IA integrada
            analise_ia: {
                especializacao_recomendada: especialização,
                prioridades: dadosSEFAZ.analise_industrial.prioridades_consultoria,
                roi_estimado: '200-400%',
                timeline_meses: setor === 'quimica' || setor === 'farmaceutica' ? 8 : 6,
                modulos: ['diagnostico_inicial', 'mapeamento_processos'],
                confidence_score: 0.85,
                observacoes_sefaz: dadosSEFAZ.analise_industrial.observacoes
            },
            
            // Metadados SEFAZ
            dados_sefaz: {
                ultima_consulta: dadosSEFAZ.data_consulta,
                situacao_receita: dadosSEFAZ.status_receita,
                quadro_societario: dadosSEFAZ.quadro_societario
            }
        };
    }

    // Estimar número de funcionários baseado no porte
    estimarFuncionarios(porte) {
        const estimativas = {
            'MICRO EMPRESA': 5,
            'EMPRESA DE PEQUENO PORTE': 25,
            'DEMAIS': 100
        };
        
        return estimativas[porte] || 50;
    }
}

export default IntegradorSEFAZ;