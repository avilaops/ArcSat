#!/usr/bin/env node

/**
 * Script de Configuração de Domínios Cloudflare para ArcSat (CommonJS)
 * Configura automaticamente todos os subdomínios necessários
 */

const https = require('https');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// Configurações da API Cloudflare
const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const ZONE_ID = process.env.CLOUDFLARE_ZONE_ID;
const BASE_DOMAIN = process.env.DOMAIN_ROOT || 'arcsat.com.br';

console.log('🚀 Iniciando configuração de domínios ArcSat na Cloudflare...\n');

// Verificar token
if (!CLOUDFLARE_API_TOKEN) {
  console.error('❌ CLOUDFLARE_API_TOKEN não encontrado no .env');
  process.exit(1);
}

console.log('✅ Token Cloudflare configurado');
console.log('🌐 Domínio base:', BASE_DOMAIN);
console.log('🏷️ Zone ID:', ZONE_ID || 'Será buscado automaticamente');

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
    console.log(`✅ Zone ID encontrado: ${ZONE_ID}`);
    return ZONE_ID;
  }
  
  console.log('🔍 Buscando Zone ID para o domínio...');
  
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
        console.log(`✅ Zone ID encontrado: ${zone.id}`);
        return zone.id;
      } else {
        throw new Error(`Domínio ${BASE_DOMAIN} não encontrado na Cloudflare`);
      }
    } else {
      throw new Error(`Erro na API: ${JSON.stringify(response.data)}`);
    }
  } catch (error) {
    console.error(`❌ Erro ao buscar Zone ID: ${error.message}`);
    throw error;
  }
}

// Função para criar/atualizar DNS record
async function createDNSRecord(zoneId, record) {
  console.log(`🔧 Configurando ${record.name}...`);
  
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
          console.log(`✅ ${record.name} atualizado com sucesso`);
          return updateResponse.data.result;
        } else {
          console.error(`❌ Erro ao atualizar ${record.name}:`, updateResponse.data);
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
          console.log(`✅ ${record.name} criado com sucesso`);
          return createResponse.data.result;
        } else {
          console.error(`❌ Erro ao criar ${record.name}:`, createResponse.data);
          return null;
        }
      }
    } else {
      console.error(`❌ Erro ao listar records:`, listResponse.data);
      return null;
    }
  } catch (error) {
    console.error(`❌ Erro ao configurar ${record.name}: ${error.message}`);
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
  try {
    console.log('\n🎯 Obtendo Zone ID...');
    const zoneId = await getZoneId();
    
    console.log(`\n🔧 Configurando ${subdomains.length} registros DNS...\n`);
    
    // Configurar cada subdomínio
    const results = [];
    for (let i = 0; i < subdomains.length; i++) {
      const subdomain = subdomains[i];
      console.log(`[${i + 1}/${subdomains.length}] Processando ${subdomain.name}...`);
      
      const result = await createDNSRecord(zoneId, subdomain);
      results.push({ subdomain: subdomain.name, success: !!result });
      
      // Pequena pausa entre requisições
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Relatório final
    console.log('\n' + '='.repeat(50));
    console.log('📊 RELATÓRIO FINAL');
    console.log('='.repeat(50));
    
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    
    console.log(`✅ Configurados com sucesso: ${successful}`);
    console.log(`❌ Falhas: ${failed}`);
    
    console.log('\n🌐 Status dos subdomínios:');
    results.forEach(result => {
      const status = result.success ? '✅' : '❌';
      console.log(`  ${status} ${result.subdomain}`);
    });
    
    if (successful === subdomains.length) {
      console.log('\n🎉 Todos os domínios foram configurados com sucesso!');
      console.log('⏳ A propagação DNS pode levar até 24 horas para ser concluída.');
      console.log('🔗 Você pode verificar a propagação em: https://dnschecker.org/');
    } else {
      console.log('\n⚠️ Alguns domínios falharam na configuração.');
      console.log('📝 Verifique os logs acima para mais detalhes.');
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
    console.log(`\n📄 Relatório salvo em: ${reportPath}`);
    
  } catch (error) {
    console.error(`\n💥 Erro crítico: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
}

// Executar script
setupDomains().catch(error => {
  console.error(`💥 Erro não tratado: ${error.message}`);
  console.error(error);
  process.exit(1);
});