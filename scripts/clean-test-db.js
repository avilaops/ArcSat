#!/usr/bin/env node

/**
 * Script para limpar banco de dados de teste
 * Uso: node scripts/clean-test-db.js
 */

import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env.test" });

const cleanDatabase = async () => {
  try {
    console.log("🔄 Conectando ao banco de dados de teste...");
    
    await mongoose.connect(process.env.MONGO_URI);
    
    console.log("✅ Conectado!");
    console.log("🗑️  Limpando coleções...");

    // Listar todas as coleções
    const collections = await mongoose.connection.db.collections();

    // Deletar documentos de cada coleção
    for (const collection of collections) {
      await collection.deleteMany({});
      console.log(`   ✓ ${collection.collectionName} limpo`);
    }

    console.log("✅ Banco de dados de teste limpo com sucesso!");
    
  } catch (error) {
    console.error("❌ Erro ao limpar banco de dados:", error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log("👋 Conexão fechada");
    process.exit(0);
  }
};

cleanDatabase();
