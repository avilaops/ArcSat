import express from "express";
import cors from "cors";
import { connectDB } from "./db.js";
import dotenv from "dotenv";

// Importar rotas
import authRoutes from "./routes/auth.js";
import cnpjRoutes from "./routes/cnpj.js";

// Carregar variáveis de ambiente
dotenv.config();

// Inicializar Express
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Conexão com o banco de dados
connectDB();

// Rotas
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/cnpj", cnpjRoutes);

// Rota básica
app.get("/", (req, res) => {
  res.json({ 
    message: "Bem-vindo ao CRM da Ávila Inc",
    version: "1.0.0",
    docs: "/docs",
    status: "online"
  });
});

// Health check endpoint para Azure App Service
app.get("/health", (req, res) => {
  const healthcheck = {
    uptime: process.uptime(),
    status: "OK",
    timestamp: Date.now(),
    database: "connected" // Será atualizado pelo middleware de DB
  };
  
  try {
    res.status(200).json(healthcheck);
  } catch (error) {
    healthcheck.status = "ERROR";
    res.status(503).json(healthcheck);
  }
});

// Endpoint de status detalhado
app.get("/api/v1/status", (req, res) => {
  res.json({
    service: "ArcSat CRM",
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development",
    mongodb: {
      connected: true,
      host: process.env.MONGODB_URI ? "configured" : "not configured"
    },
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Tratamento de erros 404
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Rota não encontrada"
  });
});

// Porta do servidor
const PORT = process.env.PORT || 5000;

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
