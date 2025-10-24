// Teste da integração SEFAZ para ArcSat Industrial
import IntegradorSEFAZ from '../src/services/integrador-sefaz.js';

const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    reset: '\x1b[0m'
};

async function testarIntegracaoSEFAZ() {
    console.log(`${colors.blue}🧪 Testando Integração SEFAZ/ReceitaWS${colors.reset}`);
    
    const integrador = new IntegradorSEFAZ();
    
    // CNPJs de teste (empresas reais para validação)
    const cnpjsTeste = [
        '11.222.333/0001-81', // CNPJ inválido para teste
        '07.526.557/0001-00', // TIM Celular (exemplo real)
        '09.073.477/0001-04', // Magazine Luiza (exemplo real)
        '33.000.167/0001-01'  // Globo (exemplo real)
    ];
    
    console.log(`${colors.blue}📋 Testando ${cnpjsTeste.length} CNPJs...${colors.reset}\n`);
    
    for (let i = 0; i < cnpjsTeste.length; i++) {
        const cnpj = cnpjsTeste[i];
        console.log(`${colors.blue}${i + 1}. Testando CNPJ: ${cnpj}${colors.reset}`);
        
        try {
            // Primeiro validar o CNPJ
            const validacao = integrador.validarCNPJ(cnpj);
            console.log(`   Validação: ${validacao.valido ? '✅ Válido' : '❌ ' + validacao.erro}`);
            
            if (!validacao.valido) {
                console.log(`${colors.yellow}   ⏭️  Pulando consulta SEFAZ (CNPJ inválido)${colors.reset}\n`);
                continue;
            }
            
            // Buscar dados na SEFAZ
            console.log(`   🔍 Consultando SEFAZ...`);
            const dadosSEFAZ = await integrador.buscarDadosSEFAZ(cnpj);
            
            console.log(`${colors.green}   ✅ Sucesso!${colors.reset}`);
            console.log(`   📋 Empresa: ${dadosSEFAZ.razao_social}`);
            console.log(`   🏢 Situação: ${dadosSEFAZ.situacao_cadastral}`);
            console.log(`   🏭 Setor: ${dadosSEFAZ.analise_industrial.setor_identificado}`);
            console.log(`   🎯 Especialização: ${dadosSEFAZ.analise_industrial.especializacao_recomendada}`);
            console.log(`   💰 Potencial: ${dadosSEFAZ.analise_industrial.potencial_cliente ? 'Alto' : 'Médio'}`);
            
            // Testar mapeamento para cliente
            const dadosCliente = integrador.mapearParaSchemaCliente(dadosSEFAZ);
            console.log(`   🗂️  Mapeamento: ${Object.keys(dadosCliente).length} campos`);
            
            // Mostrar análise industrial
            if (dadosSEFAZ.analise_industrial.observacoes.length > 0) {
                console.log(`   💡 Observações:`);
                dadosSEFAZ.analise_industrial.observacoes.forEach(obs => {
                    console.log(`      - ${obs}`);
                });
            }
            
        } catch (error) {
            console.log(`${colors.red}   ❌ Erro: ${error.message}${colors.reset}`);
            
            if (error.message.includes('não encontrado')) {
                console.log(`${colors.yellow}   ℹ️  CNPJ não existe na base da Receita Federal${colors.reset}`);
            } else if (error.message.includes('Muitas consultas')) {
                console.log(`${colors.yellow}   ⏰ Rate limit atingido - aguarde alguns minutos${colors.reset}`);
                break; // Parar teste se atingir rate limit
            }
        }
        
        console.log(''); // Linha em branco
        
        // Delay entre consultas para evitar rate limit
        if (i < cnpjsTeste.length - 1) {
            console.log(`${colors.blue}   ⏳ Aguardando 2 segundos...${colors.reset}`);
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }
    
    console.log(`${colors.green}🎉 Teste de integração SEFAZ concluído!${colors.reset}`);
    console.log(`${colors.blue}📖 Próximos passos:${colors.reset}`);
    console.log(`   1. Configure MONGODB_URI em .env`);
    console.log(`   2. Execute: npm run industrial:start`);
    console.log(`   3. Acesse: http://localhost:5000/dashboard`);
    console.log(`   4. Teste busca por CNPJ no dashboard`);
}

// Executar teste
testarIntegracaoSEFAZ().catch(console.error);