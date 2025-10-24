#!/usr/bin/env node

/**
 * Script de Configuração de Domínios Cloudflare para ArcSat
 * Configura automaticamente todos os subdomínios necessários
 */

import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carregar variáveis de ambiente
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Configurações da API Cloudflare
const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const ZONE_ID = process.env.CLOUDFLARE_ZONE_ID;
const BASE_DOMAIN = process.env.DOMAIN_ROOT || 'arcsat.com.br';

// Cores para output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Função para log colorido
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Função para fazer requisições HTTP
function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(responseData);
          resolve({
            statusCode: res.statusCode,
            data: parsedData
          });
        } catch (error) {
          resolve({
            statusCode: res.statusCode,
            data: responseData
          });
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

// Função para obter o Zone ID se não estiver configurado
async function getZoneId() {
  if (ZONE_ID) {
    log(`✅ Zone ID encontrado: ${ZONE_ID}`, 'green');
    return ZONE_ID;
  }
  
  log('🔍 Buscando Zone ID para o domínio...', 'yellow');
  
  const options = {
    hostname: 'api.cloudflare.com',
    path: '/client/v4/zones',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
      'Content-Type': 'application/json'
    }
  };
  
  try {
    const response = await makeRequest(options);
    
    if (response.statusCode === 200 && response.data.success) {
      const zones = response.data.result;
      const zone = zones.find(z => z.name === BASE_DOMAIN);
      
      if (zone) {
        log(`✅ Zone ID encontrado: ${zone.id}`, 'green');
        return zone.id;
      } else {
        throw new Error(`Domínio ${BASE_DOMAIN} não encontrado na Cloudflare`);
      }
    } else {
      throw new Error(`Erro na API: ${JSON.stringify(response.data)}`);
    }
  } catch (error) {
    log(`❌ Erro ao buscar Zone ID: ${error.message}`, 'red');
    throw error;
  }
}

// Função para criar/atualizar DNS record
async function createDNSRecord(zoneId, record) {
  log(`🔧 Configurando ${record.name}...`, 'cyan');
  
  // Primeiro, verificar se o record já existe
  const listOptions = {
    hostname: 'api.cloudflare.com',
    path: `/client/v4/zones/${zoneId}/dns_records?name=${record.name}&type=${record.type}`,
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
      'Content-Type': 'application/json'
    }
  };
  
  try {
    const listResponse = await makeRequest(listOptions);
    
    if (listResponse.statusCode === 200 && listResponse.data.success) {
      const existingRecords = listResponse.data.result;
      
      if (existingRecords.length > 0) {
        // Record existe, atualizar
        const existingRecord = existingRecords[0];
        const updateOptions = {
          hostname: 'api.cloudflare.com',
          path: `/client/v4/zones/${zoneId}/dns_records/${existingRecord.id}`,
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
            'Content-Type': 'application/json'
          }
        };
        
        const updateResponse = await makeRequest(updateOptions, record);
        
        if (updateResponse.statusCode === 200 && updateResponse.data.success) {
          log(`✅ ${record.name} atualizado com sucesso`, 'green');
          return updateResponse.data.result;
        } else {
          log(`❌ Erro ao atualizar ${record.name}: ${JSON.stringify(updateResponse.data)}`, 'red');
          return null;
        }
      } else {
        // Record não existe, criar
        const createOptions = {
          hostname: 'api.cloudflare.com',
          path: `/client/v4/zones/${zoneId}/dns_records`,
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
            'Content-Type': 'application/json'
          }
        };
        
        const createResponse = await makeRequest(createOptions, record);
        
        if (createResponse.statusCode === 200 && createResponse.data.success) {
          log(`✅ ${record.name} criado com sucesso`, 'green');
          return createResponse.data.result;
        } else {
          log(`❌ Erro ao criar ${record.name}: ${JSON.stringify(createResponse.data)}`, 'red');
          return null;
        }
      }
    } else {
      log(`❌ Erro ao listar records: ${JSON.stringify(listResponse.data)}`, 'red');
      return null;
    }
  } catch (error) {
    log(`❌ Erro ao configurar ${record.name}: ${error.message}`, 'red');
    return null;
  }
}

// Configuração dos subdomínios
const subdomains = [
  {
    name: BASE_DOMAIN,
    type: 'A',
    content: '192.0.2.1', // IP placeholder - será atualizado para o IP real do Azure
    ttl: 1,
    comment: 'Domínio principal - Landing Page'
  },
  {
    name: `www.${BASE_DOMAIN}`,
    type: 'CNAME',
    content: BASE_DOMAIN,
    ttl: 1,
    comment: 'Redirecionamento WWW'
  },
  {
    name: `app.${BASE_DOMAIN}`,
    type: 'A',
    content: '192.0.2.2', // IP placeholder - será atualizado para o IP do dashboard
    ttl: 1,
    comment: 'Dashboard/Aplicação Principal'
  },
  {
    name: `api.${BASE_DOMAIN}`,
    type: 'A',
    content: '192.0.2.3', // IP placeholder - será atualizado para o IP da API
    ttl: 1,
    comment: 'API Backend'
  },
  {
    name: `docs.${BASE_DOMAIN}`,
    type: 'A',
    content: '192.0.2.4', // IP placeholder - será atualizado para o IP da documentação
    ttl: 1,
    comment: 'Documentação'
  },
  {
    name: `auth.${BASE_DOMAIN}`,
    type: 'CNAME',
    content: `api.${BASE_DOMAIN}`,
    ttl: 1,
    comment: 'Serviço de Autenticação'
  }
];

// Função principal
async function setupDomains() {
  log('🚀 Iniciando configuração de domínios ArcSat na Cloudflare\n', 'bright');
  
  // Verificar token
  if (!CLOUDFLARE_API_TOKEN) {
    log('❌ CLOUDFLARE_API_TOKEN não encontrado no .env', 'red');
    process.exit(1);
  }
  
  log('✅ Token Cloudflare configurado', 'green');
  
  try {
    // Obter Zone ID
    const zoneId = await getZoneId();
    
    log(`\n🎯 Configurando ${subdomains.length} registros DNS...\n`, 'yellow');
    
    // Configurar cada subdomínio
    const results = [];
    for (const subdomain of subdomains) {
      const result = await createDNSRecord(zoneId, subdomain);
      results.push({ subdomain: subdomain.name, success: !!result });
      
      // Pequena pausa entre requisições
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Relatório final
    log('\n📊 RELATÓRIO FINAL:', 'bright');
    log('═══════════════════════════════════════════', 'cyan');
    
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    
    log(`✅ Configurados com sucesso: ${successful}`, 'green');
    log(`❌ Falhas: ${failed}`, failed > 0 ? 'red' : 'green');
    
    log('\n🌐 Subdomínios configurados:', 'blue');
    results.forEach(result => {
      const status = result.success ? '✅' : '❌';
      const color = result.success ? 'green' : 'red';
      log(`  ${status} ${result.subdomain}`, color);
    });
    
    if (successful === subdomains.length) {
      log('\n🎉 Todos os domínios foram configurados com sucesso!', 'green');
      log('⏳ A propagação DNS pode levar até 24 horas para ser concluída.', 'yellow');
      log('🔗 Você pode verificar a propagação em: https://dnschecker.org/', 'cyan');
    } else {
      log('\n⚠️ Alguns domínios falharam na configuração.', 'yellow');
      log('📝 Verifique os logs acima para mais detalhes.', 'yellow');
    }
    
    // Salvar relatório
    const reportPath = path.join(__dirname, '..', 'domain-setup-report.json');
    const report = {
      timestamp: new Date().toISOString(),
      domain: BASE_DOMAIN,
      zoneId,
      results,
      summary: {
        total: subdomains.length,
        successful,
        failed
      }
    };
    
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    log(`\n📄 Relatório salvo em: ${reportPath}`, 'cyan');
    
  } catch (error) {
    log(`\n💥 Erro crítico: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Executar script
if (import.meta.url === `file://${process.argv[1]}`) {
  setupDomains().catch(error => {
    log(`💥 Erro não tratado: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
  });
}

export { setupDomains };