#!/usr/bin/env node

/**
 * Script para verificar e corrigir o domínio docs.arcsat.com.br
 */

const https = require('https');
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const ZONE_ID = process.env.CLOUDFLARE_ZONE_ID;

console.log('🔍 Verificando registros DNS existentes para docs.arcsat.com.br...\n');

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

async function checkDocsRecord() {
  try {
    // Listar todos os records para docs.arcsat.com.br
    const listOptions = {
      hostname: 'api.cloudflare.com',
      path: `/client/v4/zones/${ZONE_ID}/dns_records?name=docs.arcsat.com.br`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    };
    
    const response = await makeRequest(listOptions);
    
    if (response.statusCode === 200 && response.data.success) {
      const records = response.data.result;
      
      console.log(`📋 Encontrados ${records.length} registros para docs.arcsat.com.br:`);
      
      records.forEach((record, index) => {
        console.log(`\n[${index + 1}] Record ID: ${record.id}`);
        console.log(`    Tipo: ${record.type}`);
        console.log(`    Nome: ${record.name}`);
        console.log(`    Conteúdo: ${record.content}`);
        console.log(`    TTL: ${record.ttl}`);
        console.log(`    Proxied: ${record.proxied || false}`);
        console.log(`    Comentário: ${record.comment || 'Nenhum'}`);
      });
      
      if (records.length > 0) {
        console.log('\n❓ Deseja substituir o record existente? (S/N)');
        console.log('💡 O script pode deletar o record existente e criar um novo.');
        
        // Para automação, vamos tentar atualizar o primeiro record encontrado
        const existingRecord = records[0];
        
        console.log(`\n🔧 Atualizando record existente...`);
        
        const newRecordData = {
          type: 'A',
          name: 'docs.arcsat.com.br',
          content: '192.0.2.4', // IP placeholder
          ttl: 1,
          comment: 'Documentação ArcSat'
        };
        
        const updateOptions = {
          hostname: 'api.cloudflare.com',
          path: `/client/v4/zones/${ZONE_ID}/dns_records/${existingRecord.id}`,
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
            'Content-Type': 'application/json'
          }
        };
        
        const updateResponse = await makeRequest(updateOptions, newRecordData);
        
        if (updateResponse.statusCode === 200 && updateResponse.data.success) {
          console.log('✅ docs.arcsat.com.br atualizado com sucesso!');
          console.log(`📝 Novo tipo: ${newRecordData.type}`);
          console.log(`📝 Novo conteúdo: ${newRecordData.content}`);
        } else {
          console.error('❌ Erro ao atualizar:', updateResponse.data);
        }
      }
    } else {
      console.error('❌ Erro ao listar records:', response.data);
    }
  } catch (error) {
    console.error(`💥 Erro: ${error.message}`);
  }
}

checkDocsRecord();