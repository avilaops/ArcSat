import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function testMongoDB() {
  try {
    console.log('🔌 Testando conexão com MongoDB Atlas...');
    console.log('📝 URI:', process.env.MONGODB_URI?.substring(0, 50) + '...');
    
    await mongoose.connect(process.env.MONGODB_URI);
    
    console.log('✅ Conectado ao MongoDB Atlas com sucesso!');
    
    // Testar operação básica
    const testCollection = mongoose.connection.db.collection('test');
    await testCollection.insertOne({ test: true, timestamp: new Date() });
    console.log('✅ Operação de escrita funcionando!');
    
    const count = await testCollection.countDocuments();
    console.log(`📊 Documentos na coleção test: ${count}`);
    
    await mongoose.disconnect();
    console.log('🔌 Desconectado do MongoDB');
    
  } catch (error) {
    console.error('❌ Erro ao conectar:', error.message);
    process.exit(1);
  }
}

testMongoDB();