import { MongoClient } from 'mongodb';

async function testConnection() {
    const uri = 'mongodb+srv://nicolasrosaab_db_user:Gio4EAQhbEdQMISl@cluster0.npuhras.mongodb.net/arcsat-production';
    
    try {
        console.log('🔍 Testando conexão com MongoDB Atlas...');
        
        const client = new MongoClient(uri, {
            serverSelectionTimeoutMS: 5000,
            connectTimeoutMS: 10000,
        });
        
        await client.connect();
        console.log('✅ Conexão estabelecida com sucesso!');
        
        // Testar operação básica
        const db = client.db('arcsat-production');
        const collections = await db.listCollections().toArray();
        console.log(`📋 Collections encontradas: ${collections.length}`);
        
        await client.close();
        console.log('🔐 Conexão fechada com sucesso!');
        
    } catch (error) {
        console.error('❌ Erro na conexão:', error.message);
        process.exit(1);
    }
}

testConnection();