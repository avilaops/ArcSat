# 🚀 Quick Start Guide - ArcSat CRM

Guia rápido para começar a usar o ArcSat CRM em minutos!

## ⚡ Setup Rápido (5 minutos)

### 1. Clone e Instale

```bash
# Clone o repositório
git clone https://github.com/avilaops/ArcSat.git
cd ArcSat

# Instale dependências do backend
npm install

# Instale dependências do frontend
cd frontend/arcsat-landing
npm install
cd ../..
```

### 2. Configure Variáveis de Ambiente

```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite o .env com suas credenciais
# Mínimo necessário:
# - MONGO_URI (MongoDB Atlas)
# - JWT_SECRET (min 32 caracteres)
# - PORT (padrão: 5500)
```

### 3. Inicie o Projeto

```bash
# Terminal 1 - Backend
npm run dev

# Terminal 2 - Frontend
npm run frontend:dev
```

**Pronto!** 🎉

- Backend: http://localhost:5500
- Frontend: http://localhost:3000
- Docs: http://localhost:3000/docs

## 📦 MongoDB Atlas Setup (2 minutos)

1. Acesse [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crie uma conta gratuita
3. Crie um cluster (tier gratuito)
4. **Database Access**: Crie um usuário
5. **Network Access**: Adicione `0.0.0.0/0` (dev) ou seu IP
6. **Connect**: Copie a connection string
7. Cole no `.env` como `MONGO_URI`

## 🎯 Primeiros Passos

### Criar Dados de Teste

```bash
npm run db:seed
```

Isso cria:
- 1 empresa exemplo
- 2 usuários (admin e user)

**Credenciais:**
- Admin: `admin@avila.inc` / `admin123`
- User: `user@avila.inc` / `user123`

### Testar a API

```bash
# Login
curl -X POST http://localhost:5500/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@avila.inc","password":"admin123"}'

# Copie o token retornado e use nas próximas requisições
```

### Abrir o Frontend

Acesse http://localhost:3000 no navegador.

## 🐳 Docker (Alternativa)

```bash
# Subir tudo com Docker Compose
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar
docker-compose down
```

## 📝 Comandos Úteis

```bash
# Backend
npm start              # Produção
npm run dev            # Desenvolvimento
npm test               # Testes
npm run lint           # Lint
npm run format         # Formatar código

# Frontend
npm run frontend:dev   # Desenvolvimento
npm run frontend:build # Build produção

# Database
npm run db:seed        # Criar dados de teste
npm run db:clean       # Limpar dados de teste

# Docker
npm run docker:build   # Build imagem
npm run docker:run     # Rodar container
npm run docker:compose # Docker Compose up
npm run docker:down    # Docker Compose down
```

## 🔍 Verificar Instalação

```bash
# Verificar Node.js
node --version  # Deve ser >= 18.0.0

# Verificar npm
npm --version   # Deve ser >= 9.0.0

# Verificar servidor backend
curl http://localhost:5500

# Verificar frontend
curl http://localhost:3000
```

## ❓ Problemas Comuns

### "Cannot connect to MongoDB"

- Verifique `MONGO_URI` no `.env`
- Confirme que o IP está liberado no Atlas
- Teste a conexão manualmente

### "Port already in use"

```bash
# Windows
netstat -ano | findstr :5500
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5500 | xargs kill
```

### "Module not found"

```bash
# Reinstale dependências
rm -rf node_modules package-lock.json
npm install
```

## 📚 Próximos Passos

1. ✅ **Leia a documentação completa**: [README.md](../README.md)
2. ✅ **Explore a API**: [docs/API.md](API.md)
3. ✅ **Contribua**: [CONTRIBUTING.md](../CONTRIBUTING.md)
4. ✅ **Desenvolva**: [docs/DEVELOPMENT.md](DEVELOPMENT.md)

## 🆘 Ajuda

- 📧 Email: nicolas@avila.inc
- 🐛 Issues: https://github.com/avilaops/ArcSat/issues
- 📖 Docs: ./docs/

---

**Tempo estimado de setup: 5-10 minutos** ⏱️
