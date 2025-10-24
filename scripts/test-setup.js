#!/usr/bin/env node

/**
 * Script Simples de Teste - Configuração de Domínios Cloudflare
 */

console.log('🚀 Iniciando configuração de domínios Cloudflare...\n');

// Tentar carregar variáveis de ambiente
try {
  const fs = await import('fs');
  const path = await import('path');
  const { fileURLToPath } = await import('url');
  
  console.log('✅ Módulos carregados com sucesso');
  
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  
  console.log('📁 Diretório do script:', __dirname);
  
  // Verificar se .env existe
  const envPath = path.join(__dirname, '..', '.env');
  console.log('📄 Procurando .env em:', envPath);
  
  if (fs.existsSync(envPath)) {
    console.log('✅ Arquivo .env encontrado');
    
    // Carregar dotenv
    const dotenv = await import('dotenv');
    const result = dotenv.config({ path: envPath });
    
    if (result.error) {
      console.error('❌ Erro ao carregar .env:', result.error);
    } else {
      console.log('✅ Variáveis de ambiente carregadas');
      console.log('🔑 CLOUDFLARE_API_TOKEN:', process.env.CLOUDFLARE_API_TOKEN ? 'Configurado' : 'Não encontrado');
      console.log('🏷️ CLOUDFLARE_ZONE_ID:', process.env.CLOUDFLARE_ZONE_ID ? 'Configurado' : 'Não encontrado');
      console.log('🌐 DOMAIN_ROOT:', process.env.DOMAIN_ROOT || 'Não configurado');
    }
  } else {
    console.error('❌ Arquivo .env não encontrado');
  }
  
} catch (error) {
  console.error('❌ Erro:', error.message);
}

console.log('\n✅ Teste concluído');