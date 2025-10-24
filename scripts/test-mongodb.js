const mongoose = require('mongoose');
require('dotenv').config();

// Cores para console
const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    reset: '\x1b[0m'
};

async function testarConexaoMongoDB() {
    console.log(`${colors.blue}🔍 Testando conexão com MongoDB Atlas...${colors.reset}`);
    
    try {
        // Obter URI do MongoDB das variáveis de ambiente
        const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
        
        if (!mongoUri) {
            console.log(`${colors.red}❌ ERRO: Variável MONGODB_URI não encontrada no .env${colors.reset}`);
            console.log(`${colors.yellow}💡 Configure sua string de conexão MongoDB Atlas em .env.industrial${colors.reset}`);
            process.exit(1);
        }

        console.log(`${colors.blue}📡 Conectando ao MongoDB...${colors.reset}`);
        console.log(`${colors.blue}🔗 URI: ${mongoUri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')}${colors.reset}`);

        // Configuração de conexão com timeouts reduzidos para teste
        const options = {
            maxPoolSize: 5,
            minPoolSize: 1,
            maxIdleTimeMS: 30000,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            bufferCommands: false,
        };

        await mongoose.connect(mongoUri, options);
        
        console.log(`${colors.green}✅ MongoDB Atlas conectado com sucesso!${colors.reset}`);
        console.log(`${colors.green}📊 Database: ${mongoose.connection.name}${colors.reset}`);
        console.log(`${colors.green}🏠 Host: ${mongoose.connection.host}${colors.reset}`);
        console.log(`${colors.green}📈 Estado: ${mongoose.connection.readyState === 1 ? 'Conectado' : 'Desconectado'}${colors.reset}`);

        // Testar operações básicas
        console.log(`${colors.blue}🧪 Testando operações básicas...${colors.reset}`);
        
        // Listar coleções existentes
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log(`${colors.green}📚 Coleções encontradas: ${collections.length}${colors.reset}`);
        
        if (collections.length > 0) {
            collections.forEach(col => {
                console.log(`${colors.green}  - ${col.name}${colors.reset}`);
            });
        }

        // Testar inserção simples
        const TestSchema = new mongoose.Schema({
            nome: String,
            timestamp: { type: Date, default: Date.now }
        });
        
        const TestModel = mongoose.model('conexao_teste', TestSchema);
        
        const testeDoc = new TestModel({
            nome: 'Teste de conexão ArcSat Industrial'
        });
        
        await testeDoc.save();
        console.log(`${colors.green}✅ Documento de teste inserido com sucesso!${colors.reset}`);
        
        // Buscar documento
        const docEncontrado = await TestModel.findOne({ nome: 'Teste de conexão ArcSat Industrial' });
        if (docEncontrado) {
            console.log(`${colors.green}✅ Documento encontrado: ${docEncontrado._id}${colors.reset}`);
        }
        
        // Limpar teste
        await TestModel.deleteOne({ _id: docEncontrado._id });
        console.log(`${colors.green}🧹 Documento de teste removido${colors.reset}`);

        console.log(`${colors.green}🎉 Todos os testes passaram! MongoDB Atlas está funcionando perfeitamente.${colors.reset}`);
        
    } catch (error) {
        console.log(`${colors.red}❌ ERRO na conexão MongoDB:${colors.reset}`);
        console.log(`${colors.red}   ${error.message}${colors.reset}`);
        
        // Diagnósticos específicos
        if (error.message.includes('authentication failed')) {
            console.log(`${colors.yellow}💡 Problema de autenticação - verifique usuário e senha${colors.reset}`);
        } else if (error.message.includes('ENOTFOUND')) {
            console.log(`${colors.yellow}💡 Problema de DNS - verifique a URL do cluster${colors.reset}`);
        } else if (error.message.includes('timeout')) {
            console.log(`${colors.yellow}💡 Timeout de conexão - verifique firewall/IP whitelist${colors.reset}`);
        }
        
        console.log(`${colors.yellow}📖 Guia de solução de problemas:${colors.reset}`);
        console.log(`${colors.yellow}   1. Verificar string de conexão em .env.industrial${colors.reset}`);
        console.log(`${colors.yellow}   2. Verificar usuário e senha no MongoDB Atlas${colors.reset}`);
        console.log(`${colors.yellow}   3. Verificar IP whitelist (0.0.0.0/0 para teste)${colors.reset}`);
        console.log(`${colors.yellow}   4. Verificar se o cluster está ativo${colors.reset}`);
        
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log(`${colors.blue}🔌 Conexão fechada${colors.reset}`);
    }
}

// Executar teste
testarConexaoMongoDB();