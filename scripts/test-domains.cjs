#!/usr/bin/env node

/**
 * Script de Teste de Conectividade dos Domínios ArcSat
 */

const https = require('https');
const http = require('http');
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const domains = [
  'arcsat.com.br',
  'www.arcsat.com.br',
  'app.arcsat.com.br',
  'api.arcsat.com.br',
  'docs.arcsat.com.br',
  'auth.arcsat.com.br'
];

console.log('🌐 Testando conectividade dos domínios ArcSat...\n');

function testDomain(domain) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    
    // Testar HTTPS primeiro
    const httpsReq = https.request({
      hostname: domain,
      port: 443,
      path: '/',
      method: 'GET',
      timeout: 5000
    }, (res) => {
      const responseTime = Date.now() - startTime;
      resolve({
        domain,
        status: 'online',
        protocol: 'https',
        statusCode: res.statusCode,
        responseTime: `${responseTime}ms`
      });
    });
    
    httpsReq.on('error', () => {
      // Se HTTPS falhar, testar HTTP
      const httpReq = http.request({
        hostname: domain,
        port: 80,
        path: '/',
        method: 'GET',
        timeout: 5000
      }, (res) => {
        const responseTime = Date.now() - startTime;
        resolve({
          domain,
          status: 'online',
          protocol: 'http',
          statusCode: res.statusCode,
          responseTime: `${responseTime}ms`
        });
      });
      
      httpReq.on('error', () => {
        resolve({
          domain,
          status: 'offline',
          protocol: 'none',
          statusCode: 'N/A',
          responseTime: 'timeout'
        });
      });
      
      httpReq.end();
    });
    
    httpsReq.on('timeout', () => {
      resolve({
        domain,
        status: 'timeout',
        protocol: 'timeout',
        statusCode: 'N/A',
        responseTime: 'timeout'
      });
    });
    
    httpsReq.end();
  });
}

async function testAllDomains() {
  const results = [];
  
  for (const domain of domains) {
    console.log(`🔍 Testando ${domain}...`);
    const result = await testDomain(domain);
    results.push(result);
    
    const statusIcon = result.status === 'online' ? '✅' : 
                      result.status === 'timeout' ? '⏱️' : '❌';
    
    console.log(`  ${statusIcon} ${result.status} | ${result.protocol} | ${result.statusCode} | ${result.responseTime}`);
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 RELATÓRIO DE CONECTIVIDADE');
  console.log('='.repeat(60));
  
  console.log('| Domínio | Status | Protocolo | Código | Tempo |');
  console.log('|---------|--------|-----------|---------|-------|');
  
  results.forEach(result => {
    const status = result.status === 'online' ? '✅' : 
                  result.status === 'timeout' ? '⏱️' : '❌';
    console.log(`| ${result.domain} | ${status} ${result.status} | ${result.protocol} | ${result.statusCode} | ${result.responseTime} |`);
  });
  
  const online = results.filter(r => r.status === 'online').length;
  const offline = results.filter(r => r.status === 'offline').length;
  const timeout = results.filter(r => r.status === 'timeout').length;
  
  console.log(`\n📈 Estatísticas:`);
  console.log(`   ✅ Online: ${online}/${domains.length}`);
  console.log(`   ❌ Offline: ${offline}/${domains.length}`);
  console.log(`   ⏱️ Timeout: ${timeout}/${domains.length}`);
  
  if (offline > 0 || timeout > 0) {
    console.log('\n💡 Nota: Alguns domínios podem estar offline porque:');
    console.log('   - Os serviços Azure ainda não foram configurados');
    console.log('   - A propagação DNS ainda está em andamento');
    console.log('   - Os IPs placeholder precisam ser atualizados');
  }
  
  console.log('\n🔗 Para verificar a propagação DNS completa:');
  console.log('   https://dnschecker.org/');
  console.log('   https://www.whatsmydns.net/');
}

testAllDomains().catch(console.error);