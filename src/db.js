import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

// Configurações otimizadas para Azure Cosmos DB (MongoDB API)
const mongooseOptions = {
  maxPoolSize: 10,
  minPoolSize: 2,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4, // Use IPv4
  retryWrites: true,
  retryReads: true,
  w: 'majority'
};

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    
    if (!mongoUri) {
      console.error("❌ MONGODB_URI não configurado no ambiente");
      process.exit(1);
    }

    // Conectar ao MongoDB/Cosmos DB
    await mongoose.connect(mongoUri, mongooseOptions);
    
    console.log("✅ MongoDB conectado com sucesso");
    console.log(`📍 Database: ${mongoose.connection.db.databaseName}`);
    
    // Event listeners para monitoramento
    mongoose.connection.on('error', (err) => {
      console.error('❌ Erro no MongoDB:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB desconectado');
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconectado');
    });
    
  } catch (err) {
    console.error("❌ Erro ao conectar MongoDB:", err.message);
    console.error("💡 Verifique se MONGODB_URI está configurado corretamente");
    process.exit(1);
  }
};

// Função para verificar status da conexão
export const isConnected = () => {
  return mongoose.connection.readyState === 1;
};

// Função para fechar conexão graciosamente
export const closeDB = async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB conexão fechada');
  } catch (err) {
    console.error('Erro ao fechar MongoDB:', err);
  }
};