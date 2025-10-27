# 🚀 Guia de Desenvolvimento - ArcSat CRM

Este guia fornece informações detalhadas para desenvolvedores que trabalham no projeto ArcSat CRM.

## 📋 Índice

- [Configuração do Ambiente](#configuração-do-ambiente)
- [Arquitetura](#arquitetura)
- [Padrões de Código](#padrões-de-código)
- [Banco de Dados](#banco-de-dados)
- [API](#api)
- [Testes](#testes)
- [Deploy](#deploy)

## 🔧 Configuração do Ambiente

### Requisitos

- Node.js 18+
- npm 9+
- MongoDB Atlas (ou local)
- Git
- VS Code (recomendado)

### VS Code Extensions Recomendadas

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "mongodb.mongodb-vscode",
    "ms-azuretools.vscode-docker",
    "ms-vscode.azure-account",
    "bradlc.vscode-tailwindcss"
  ]
}
```

### Configuração Inicial

```bash
# Clone e configure
git clone https://github.com/avilaops/ArcSat.git
cd ArcSat
npm install

# Configure ambiente
cp .env.example .env
# Edite .env com suas configurações

# Inicie desenvolvimento
npm run dev
```

## 🏗️ Arquitetura

### Backend (Node.js + Express)

```
src/
├── config/         # Configurações (DB, monitoring, etc)
├── middleware/     # Middlewares (auth, error handling)
├── models/         # Modelos Mongoose
├── routes/         # Rotas da API
├── utils/          # Funções utilitárias
├── db.js           # Conexão MongoDB
└── server.js       # Entry point
```

### Frontend (Next.js)

```
frontend/arcsat-landing/
├── app/            # App Router (Next.js 16)
│   ├── page.tsx    # Landing page
│   ├── layout.tsx  # Layout principal
│   ├── crm/        # Módulo CRM
│   └── dashboard/  # Dashboard
├── components/     # Componentes reutilizáveis
└── public/         # Assets estáticos
```

### Fluxo de Requisição

```
Client → Next.js → API Gateway → Express Routes → Controller → Model → MongoDB
```

## 📝 Padrões de Código

### Estrutura de Arquivos

#### Models

```javascript
// src/models/exemplo.js
import mongoose from "mongoose";

const exemploSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Nome é obrigatório"],
    trim: true
  },
  // ... outros campos
}, {
  timestamps: true
});

// Métodos
exemploSchema.methods.metodoProprio = function() {
  // implementação
};

// Statics
exemploSchema.statics.metodoEstatico = async function() {
  // implementação
};

export default mongoose.model("Exemplo", exemploSchema);
```

#### Routes

```javascript
// src/routes/exemplo.js
import express from "express";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

// Rotas públicas
router.get("/", getAllExemplos);

// Rotas protegidas
router.use(protect); // Requer autenticação

router.post("/", createExemplo);
router.get("/:id", getExemplo);
router.put("/:id", updateExemplo);
router.delete("/:id", authorize("admin"), deleteExemplo);

export default router;
```

#### Controllers (Pattern)

```javascript
// @desc    Get all items
// @route   GET /api/v1/items
// @access  Public
export const getAllItems = async (req, res) => {
  try {
    const items = await Item.find();
    
    res.json({
      status: "success",
      count: items.length,
      data: items
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message
    });
  }
};
```

### Error Handling

```javascript
// Padrão para erros
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Uso
throw new AppError("Recurso não encontrado", 404);
```

## 🗄️ Banco de Dados

### MongoDB com Mongoose

#### Conexão

```javascript
import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`MongoDB conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Erro: ${error.message}`);
    process.exit(1);
  }
};
```

#### Boas Práticas

1. **Sempre use validações no schema**
```javascript
email: {
  type: String,
  required: [true, "Email é obrigatório"],
  unique: true,
  lowercase: true,
  validate: [validator.isEmail, "Email inválido"]
}
```

2. **Use timestamps**
```javascript
const schema = new mongoose.Schema({
  // campos
}, {
  timestamps: true  // createdAt, updatedAt automático
});
```

3. **Indexes para performance**
```javascript
schema.index({ email: 1 });
schema.index({ company: 1, status: 1 });
```

4. **Populate ao invés de múltiplas queries**
```javascript
const user = await User.findById(id).populate("company");
```

### Cosmos DB (Azure)

#### Best Practices

1. **Partition Key**: Escolha chave com alta cardinalidade
```javascript
// Bom
{ partitionKey: "userId" }

// Ruim
{ partitionKey: "status" }
```

2. **Embed vs Reference**: Embed dados frequentemente acessados juntos
```javascript
// Embed (bom para dados que sempre são lidos juntos)
{
  user: {
    name: "João",
    email: "joao@example.com"
  },
  address: {
    street: "Rua A",
    city: "São Paulo"
  }
}

// Reference (bom para dados raramente acessados)
{
  userId: "123",
  companyId: "456"
}
```

## 🔌 API

### Estrutura de Resposta

#### Sucesso

```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "123",
      "name": "João Silva"
    }
  }
}
```

#### Erro

```json
{
  "status": "error",
  "message": "Email ou senha incorretos",
  "code": "AUTH_FAILED"
}
```

### Autenticação JWT

```javascript
// Gerar token
const token = jwt.sign(
  { id: user._id },
  process.env.JWT_SECRET,
  { expiresIn: "1d" }
);

// Verificar token (middleware)
const token = req.headers.authorization?.split(" ")[1];
const decoded = jwt.verify(token, process.env.JWT_SECRET);
```

### Rate Limiting

```javascript
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // limite de requisições
});

app.use("/api/", limiter);
```

## 🧪 Testes

### Estrutura

```
tests/
├── unit/           # Testes unitários
├── integration/    # Testes de integração
├── e2e/            # Testes end-to-end
└── setup.js        # Setup de testes
```

### Exemplo de Teste

```javascript
import User from "../src/models/user.js";

describe("User Model", () => {
  it("deve criar um usuário válido", async () => {
    const userData = {
      name: "Teste",
      email: "teste@example.com",
      password: "senha123",
      company: "123"
    };

    const user = await User.create(userData);
    
    expect(user.name).toBe("Teste");
    expect(user.email).toBe("teste@example.com");
  });

  it("deve falhar sem email", async () => {
    const userData = {
      name: "Teste",
      password: "senha123"
    };

    await expect(User.create(userData)).rejects.toThrow();
  });
});
```

### Rodar Testes

```bash
# Todos os testes
npm test

# Com coverage
npm test -- --coverage

# Watch mode
npm test -- --watch

# Arquivo específico
npm test -- user.test.js
```

## 🚀 Deploy

### Azure App Service

1. **Configure no Azure Portal**
2. **Configure variáveis de ambiente**
3. **Deploy via GitHub Actions**

```yaml
# .github/workflows/azure.yml
- name: Deploy to Azure
  uses: azure/webapps-deploy@v2
  with:
    app-name: 'arcsat-crm'
    package: .
```

### Docker

```bash
# Build
docker build -t arcsat-crm .

# Run
docker run -p 5500:5500 --env-file .env arcsat-crm

# Compose
docker-compose up -d
```

### Vercel (Frontend)

```bash
cd frontend/arcsat-landing
vercel --prod
```

## 🔐 Segurança

### Checklist

- [ ] Todas as senhas hasheadas com bcrypt
- [ ] JWT tokens com expiração
- [ ] Validação de input em todas as rotas
- [ ] CORS configurado corretamente
- [ ] Rate limiting implementado
- [ ] Helmet.js para headers de segurança
- [ ] MongoDB injection prevention
- [ ] XSS protection

## 📊 Monitoring

### Application Insights

```javascript
import appInsights from "applicationinsights";

appInsights.setup(process.env.APPLICATIONINSIGHTS_CONNECTION_STRING)
  .setAutoDependencyCorrelation(true)
  .setAutoCollectRequests(true)
  .setAutoCollectPerformance(true)
  .setAutoCollectExceptions(true)
  .start();
```

## 📚 Recursos Úteis

- [Express.js Docs](https://expressjs.com/)
- [Mongoose Docs](https://mongoosejs.com/)
- [Next.js Docs](https://nextjs.org/docs)
- [MongoDB Best Practices](https://www.mongodb.com/docs/manual/administration/production-notes/)
- [Cosmos DB Best Practices](https://learn.microsoft.com/azure/cosmos-db/)

---

**Dúvidas?** Entre em contato: nicolas@avila.inc
