# Dockerfile para Backend (Node.js + Express)
FROM node:18-alpine AS base

# Instalar dependências do sistema
RUN apk add --no-cache libc6-compat curl

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências de produção
FROM base AS deps
RUN npm ci --only=production

# Instalar todas as dependências (para build)
FROM base AS deps-dev
RUN npm ci

# Build stage (se necessário)
FROM deps-dev AS build
COPY . .
# Adicione comandos de build aqui se necessário
# RUN npm run build

# Imagem de produção
FROM base AS runner

# Criar usuário não-root
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 expressjs

# Copiar dependências de produção
COPY --from=deps --chown=expressjs:nodejs /app/node_modules ./node_modules

# Copiar código da aplicação
COPY --chown=expressjs:nodejs . .

# Criar diretório de logs
RUN mkdir -p logs && chown -R expressjs:nodejs logs

# Mudar para usuário não-root
USER expressjs

# Expor porta
EXPOSE 5500

# Variáveis de ambiente
ENV NODE_ENV=production
ENV PORT=5500

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:5500/ || exit 1

# Comando para iniciar a aplicação
CMD ["node", "src/server.js"]
