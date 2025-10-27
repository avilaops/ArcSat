#!/usr/bin/env node

/**
 * Script para criar dados de seed no banco de dados
 * Uso: node scripts/seed-db.js
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../src/models/user.js";
import Company from "../src/models/company.js";

dotenv.config();

const seedDatabase = async () => {
  try {
    console.log("🔄 Conectando ao banco de dados...");
    
    await mongoose.connect(process.env.MONGO_URI);
    
    console.log("✅ Conectado!");
    console.log("🌱 Criando dados de seed...");

    // Limpar dados existentes
    await User.deleteMany({});
    await Company.deleteMany({});

    // Criar empresa exemplo
    const company = await Company.create({
      name: "Ávila Inc",
      cnpj: "12.345.678/0001-99",
      category: "parceiro",
      status: "ativo",
      address: {
        street: "Rua das Flores",
        number: "123",
        neighborhood: "Centro",
        city: "São Paulo",
        state: "SP",
        zipCode: "01234-567"
      },
      contacts: [
        {
          name: "Nicolas Ávila",
          role: "CEO",
          phone: "(11) 98765-4321",
          email: "nicolas@avila.inc"
        }
      ]
    });

    console.log("   ✓ Empresa criada");

    // Criar usuários exemplo
    const users = [
      {
        name: "Admin User",
        email: "admin@avila.inc",
        password: "admin123",
        role: "admin",
        company: company._id
      },
      {
        name: "Regular User",
        email: "user@avila.inc",
        password: "user123",
        role: "user",
        company: company._id
      }
    ];

    for (const userData of users) {
      await User.create(userData);
      console.log(`   ✓ Usuário ${userData.name} criado`);
    }

    console.log("✅ Seed completo!");
    console.log("\n📝 Credenciais de acesso:");
    console.log("   Admin: admin@avila.inc / admin123");
    console.log("   User:  user@avila.inc / user123");
    
  } catch (error) {
    console.error("❌ Erro ao criar seed:", error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log("\n👋 Conexão fechada");
    process.exit(0);
  }
};

seedDatabase();
