# ⚡ Quick Start - ArcSat

Este guia rápido mostra como executar o ArcSat em 5 minutos.

## 📦 Instalação Rápida

```bash
# 1. Clonar o repositório
git clone https://github.com/avilaops/ArcSat.git
cd ArcSat

# 2. Instalar dependências do backend
npm install

# 3. Instalar dependências do frontend
cd frontend/arcsat-landing
npm install
cd ../..
```

## 🚀 Executar o Projeto

### Opção 1: Backend + Frontend (2 Terminais)

**Terminal 1 - Backend:**
```bash
npm run dev
# Backend: http://localhost:5500
```

**Terminal 2 - Frontend:**
```bash
cd frontend/arcsat-landing
npm run dev
# Frontend: http://localhost:3000
```

### Opção 2: Apenas Frontend

```bash
cd frontend/arcsat-landing
npm run dev
# Acesse: http://localhost:3000
```

## ✅ Verificar Instalação

### Backend
```bash
# Deve mostrar "Servidor rodando na porta 5500"
npm run dev
```

### Frontend
```bash
cd frontend/arcsat-landing
npm run dev
# Deve abrir em http://localhost:3000
```

## 🔧 Configuração Opcional

### MongoDB (Apenas para funcionalidades completas)

**Opção A: MongoDB Local com Docker**
```bash
docker run -d -p 27017:27017 --name arcsat-mongo mongo:latest
```

**Opção B: MongoDB Atlas (Gratuito)**
1. Criar conta em [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Criar cluster gratuito
3. Copiar connection string
4. Atualizar `.env`:
```bash
MONGO_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/arcsat
```

## 📚 Documentação Completa

Para instruções detalhadas, veja:
- [SETUP.md](./SETUP.md) - Guia completo de configuração
- [README.md](./README.md) - Visão geral do projeto

## 🆘 Problemas Comuns

**Erro: "Cannot find module"**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Porta já em uso**
```bash
# Matar processo na porta 5500
lsof -ti:5500 | xargs kill -9

# Matar processo na porta 3000
lsof -ti:3000 | xargs kill -9
```

## 🎯 Próximos Passos

1. ✅ Instalar dependências
2. ✅ Executar backend e frontend
3. 📱 Acessar http://localhost:3000
4. 🎨 Explorar a interface
5. 🔐 Configurar autenticação (opcional)
6. 💾 Configurar MongoDB (opcional)

---

**Dúvidas?** Consulte [SETUP.md](./SETUP.md) para mais detalhes.
