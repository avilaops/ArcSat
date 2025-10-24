// Teste simples de conexão MongoDB
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function testConnection() {
  try {
    console.log('🔗 Testando conexão MongoDB...');
    console.log('URI:', process.env.MONGO_URI ? 'Configurada' : 'NÃO CONFIGURADA');
    
    if (!process.env.MONGO_URI) {
      console.error('❌ MONGO_URI não configurada no .env');
      process.exit(1);
    }
    
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 5,
    });
    
    console.log('✅ Conectado ao MongoDB Atlas');
    console.log('📊 Estado da conexão:', mongoose.connection.readyState);
    console.log('🏠 Host:', mongoose.connection.host);
    console.log('📂 Database:', mongoose.connection.name);
    
    // Teste básico de operação
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📁 Collections encontradas:', collections.length);
    
    // Teste de ping
    const ping = await mongoose.connection.db.admin().ping();
    console.log('🏓 Ping:', ping.ok === 1 ? 'OK' : 'FALHOU');
    
    console.log('🎉 Teste de conexão concluído com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro no teste de conexão:', error.message);
    if (error.message.includes('authentication failed')) {
      console.log('💡 Dica: Verifique usuário e senha no MongoDB Atlas');
    }
    if (error.message.includes('ENOTFOUND')) {
      console.log('💡 Dica: Verifique a URL do cluster');
    }
    if (error.message.includes('IP')) {
      console.log('💡 Dica: Adicione seu IP na whitelist do MongoDB Atlas');
    }
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

testConnection();