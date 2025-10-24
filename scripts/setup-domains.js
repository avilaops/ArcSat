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
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Configuração dos subdomínios
const SUBDOMAIN_CONFIG = [
  {
    name: BASE_DOMAIN, // arcsat.com.br
    type: 'CNAME',
    content: 'wonderful-sand-0adc5890f.3.azurestaticapps.net',
    description: 'Landing Page (Azure Static Web Apps)',
    proxied: true,
  },
  {
    name: `www.${BASE_DOMAIN}`, // www.arcsat.com.br
    type: 'CNAME', 
    content: 'wonderful-sand-0adc5890f.3.azurestaticapps.net',
    description: 'WWW Redirect',
    proxied: true,
  },
  {
    name: `app.${BASE_DOMAIN}`, // app.arcsat.com.br
    type: 'CNAME',
    content: 'arcsat-app.azurewebsites.net',
    description: 'Aplicação CRM Principal',
    proxied: true,
  },
  {
    name: `api.${BASE_DOMAIN}`, // api.arcsat.com.br
    type: 'CNAME',
    content: 'arcsat-api.azurewebsites.net',
    description: 'API Backend',
    proxied: true,
  },
  {
    name: `docs.${BASE_DOMAIN}`, // docs.arcsat.com.br
    type: 'CNAME',
    content: 'avilaops.github.io',
    description: 'Documentação (GitHub Pages)',
    proxied: true,
  },
  {
    name: `auth.${BASE_DOMAIN}`, // auth.arcsat.com.br
    type: 'CNAME',
    content: 'arcsat-auth.azurewebsites.net',
    description: 'Serviço de Autenticação',
    proxied: true,
  },
  {
    name: `bi.${BASE_DOMAIN}`, // bi.arcsat.com.br
    type: 'CNAME',
    content: 'arcsat-bi.azurewebsites.net',
    description: 'Business Intelligence',
    proxied: true,
  },
  {
    name: `ai.${BASE_DOMAIN}`, // ai.arcsat.com.br
    type: 'CNAME',
    content: 'arcsat-ai.azurewebsites.net',
    description: 'AI & Automação',
    proxied: true,
  },
  {
    name: `webhooks.${BASE_DOMAIN}`, // webhooks.arcsat.com.br
    type: 'CNAME',
    content: 'arcsat-webhooks.azurewebsites.net',
    description: 'Webhooks & Integrações',
    proxied: true,
  },
];

// Função para fazer requisições à API do Cloudflare
function makeCloudflareRequest(method, endpoint, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.cloudflare.com',
      port: 443,
      path: endpoint,
      method: method,
      headers: {
        'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(responseData);
          resolve(parsedData);
        } catch (error) {
          reject(new Error(`Failed to parse response: ${error.message}`));
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

// Obter Zone ID automaticamente
async function getZoneId() {
  try {
    const response = await makeCloudflareRequest('GET', '/client/v4/zones');
    
    if (!response.success) {
      throw new Error(`Cloudflare API error: ${response.errors?.[0]?.message || 'Unknown error'}`);
    }

    const zone = response.result.find(z => z.name === BASE_DOMAIN);
    if (!zone) {
      throw new Error(`Zone ${BASE_DOMAIN} not found in your Cloudflare account`);
    }

    return zone.id;
  } catch (error) {
    throw new Error(`Failed to get zone ID: ${error.message}`);
  }
}

// Listar registros DNS existentes
async function listDnsRecords(zoneId) {
  try {
    const response = await makeCloudflareRequest('GET', `/client/v4/zones/${zoneId}/dns_records`);
    
    if (!response.success) {
      throw new Error(`Failed to list DNS records: ${response.errors?.[0]?.message || 'Unknown error'}`);
    }

    return response.result;
  } catch (error) {
    throw new Error(`Failed to list DNS records: ${error.message}`);
  }
}

// Criar ou atualizar registro DNS
async function createOrUpdateDnsRecord(zoneId, config) {
  try {
    // Verificar se o registro já existe
    const existingRecords = await listDnsRecords(zoneId);
    const existingRecord = existingRecords.find(r => r.name === config.name && r.type === config.type);

    const recordData = {
      type: config.type,
      name: config.name,
      content: config.content,
      proxied: config.proxied || false,
      ttl: config.proxied ? 1 : 300, // TTL automático se proxied
    };

    let response;
    if (existingRecord) {
      // Atualizar registro existente
      response = await makeCloudflareRequest(
        'PUT', 
        `/client/v4/zones/${zoneId}/dns_records/${existingRecord.id}`,
        recordData
      );
      log(`🔄 Atualizando: ${config.name} -> ${config.content}`, 'yellow');
    } else {
      // Criar novo registro
      response = await makeCloudflareRequest(
        'POST',
        `/client/v4/zones/${zoneId}/dns_records`,
        recordData
      );
      log(`➕ Criando: ${config.name} -> ${config.content}`, 'green');
    }

    if (!response.success) {
      throw new Error(`DNS operation failed: ${response.errors?.[0]?.message || 'Unknown error'}`);
    }

    return response.result;
  } catch (error) {
    throw new Error(`Failed to create/update DNS record for ${config.name}: ${error.message}`);
  }
}

// Configurar SSL/TLS settings
async function configureSSLSettings(zoneId) {
  try {
    log('🔒 Configurando SSL/TLS...', 'blue');
    
    // Configurar SSL para Full (strict)
    const sslResponse = await makeCloudflareRequest(
      'PATCH',
      `/client/v4/zones/${zoneId}/settings/ssl`,
      { value: 'full' }
    );

    // Configurar Always Use HTTPS
    const httpsResponse = await makeCloudflareRequest(
      'PATCH',
      `/client/v4/zones/${zoneId}/settings/always_use_https`,
      { value: 'on' }
    );

    // Configurar Min TLS Version
    const tlsResponse = await makeCloudflareRequest(
      'PATCH',
      `/client/v4/zones/${zoneId}/settings/min_tls_version`,
      { value: '1.2' }
    );

    log('✅ SSL/TLS configurado', 'green');
  } catch (error) {
    log(`⚠️ Aviso: Falha ao configurar SSL: ${error.message}`, 'yellow');
  }
}

// Criar Page Rules
async function createPageRules(zoneId) {
  try {
    log('📄 Configurando Page Rules...', 'blue');
    
    const pageRuleData = {
      targets: [
        {
          target: 'url',
          constraint: {
            operator: 'matches',
            value: `*${BASE_DOMAIN}/*`
          }
        }
      ],
      actions: [
        { id: 'ssl', value: 'flexible' },
        { id: 'always_use_https', value: {} }
      ],
      priority: 1,
      status: 'active'
    };

    const response = await makeCloudflareRequest(
      'POST',
      `/client/v4/zones/${zoneId}/pagerules`,
      pageRuleData
    );

    if (response.success) {
      log('✅ Page Rules configuradas', 'green');
    }
  } catch (error) {
    log(`⚠️ Aviso: Falha ao configurar Page Rules: ${error.message}`, 'yellow');
  }
}

// Função principal
async function setupDomains() {
  try {
    log('🚀 Iniciando configuração de domínios ArcSat...', 'cyan');
    log('==========================================', 'cyan');

    // Validar token da API
    if (!CLOUDFLARE_API_TOKEN) {
      throw new Error('CLOUDFLARE_API_TOKEN não encontrado nas variáveis de ambiente');
    }

    log(`📧 Domínio base: ${BASE_DOMAIN}`, 'blue');
    log(`🔑 Token API: ${CLOUDFLARE_API_TOKEN.substring(0, 10)}...`, 'blue');

    // Obter Zone ID
    log('\n🔍 Obtendo Zone ID...', 'yellow');
    const zoneId = ZONE_ID || await getZoneId();
    log(`✅ Zone ID: ${zoneId}`, 'green');

    // Atualizar .env com Zone ID se não existir
    if (!ZONE_ID) {
      const envPath = path.join(__dirname, '..', '.env');
      let envContent = fs.readFileSync(envPath, 'utf8');
      envContent = envContent.replace(
        'CLOUDFLARE_ZONE_ID=your_zone_id_here',
        `CLOUDFLARE_ZONE_ID=${zoneId}`
      );
      fs.writeFileSync(envPath, envContent);
      log('✅ Zone ID adicionado ao .env', 'green');
    }

    // Configurar cada subdomínio
    log('\n🌐 Configurando subdomínios...', 'yellow');
    for (const config of SUBDOMAIN_CONFIG) {
      try {
        await createOrUpdateDnsRecord(zoneId, config);
        log(`  ✅ ${config.name} - ${config.description}`, 'green');
      } catch (error) {
        log(`  ❌ ${config.name} - Erro: ${error.message}`, 'red');
      }
    }

    // Configurar SSL
    await configureSSLSettings(zoneId);

    // Criar Page Rules
    await createPageRules(zoneId);

    // Resumo final
    log('\n🎉 Configuração concluída!', 'green');
    log('============================', 'green');
    log(`\n📊 Subdomínios configurados:`, 'cyan');
    
    SUBDOMAIN_CONFIG.forEach(config => {
      log(`  🔗 ${config.name}`, 'blue');
      log(`     └─ ${config.description}`, 'blue');
    });

    log(`\n⏰ Aguarde alguns minutos para propagação DNS`, 'yellow');
    log(`🔍 Verifique: https://${BASE_DOMAIN}`, 'green');

    // Salvar configuração
    const configFile = path.join(__dirname, '..', 'cloudflare-config.json');
    fs.writeFileSync(configFile, JSON.stringify({
      zoneId,
      baseDomain: BASE_DOMAIN,
      subdomains: SUBDOMAIN_CONFIG,
      configuredAt: new Date().toISOString(),
    }, null, 2));

    log(`📝 Configuração salva em: cloudflare-config.json`, 'green');

  } catch (error) {
    log(`\n❌ Erro na configuração: ${error.message}`, 'red');
    console.error('Stack trace:', error);
    process.exit(1);
  }
}

// Executar se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  setupDomains();
}

export { setupDomains };