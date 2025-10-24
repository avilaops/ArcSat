---
name: Backend - Implement JWT Authentication
about: Sistema completo de autenticação com JWT
title: '🔐 Feature: Implementar autenticação JWT'
labels: 'backend, authentication, security'
assignees: ''
---

## 🎯 Objetivo

Implementar sistema completo de autenticação JWT com:
- Registro de usuários
- Login com email/senha
- Refresh tokens
- Middleware de autenticação

## 📋 Tarefas

### 1. Criar Middleware de Autenticação

**Arquivo:** `src/middleware/auth.ts`

```typescript
export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  // Verificar token no header Authorization
  // Validar token JWT
  // Adicionar user ao req
  // Chamar next() ou retornar 401
}
```

### 2. Criar Rotas de Autenticação

**Arquivo:** `src/routes/auth.ts`

**Endpoints:**

#### POST `/auth/register`
```typescript
{
  name: string;
  email: string;
  password: string;
}
```

#### POST `/auth/login`
```typescript
{
  email: string;
  password: string;
}
// Retorna: { accessToken, refreshToken, user }
```

#### POST `/auth/refresh`
```typescript
{
  refreshToken: string;
}
// Retorna: { accessToken }
```

#### POST `/auth/logout`
```typescript
// Invalidar refresh token
```

#### GET `/auth/me`
```typescript
// Retorna dados do usuário autenticado
```

### 3. Configuração JWT

**Arquivo:** `src/config/env.ts`

```typescript
JWT_SECRET: process.env.JWT_SECRET,
JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '15m',
JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
```

### 4. Validação com Zod

```typescript
const registerSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
});
```

## 📁 Arquivos a Criar

- `src/middleware/auth.ts`
- `src/routes/auth.ts`
- `src/controllers/auth.controller.ts`
- `src/utils/jwt.ts`

## ✅ Critério de Aceitação

- [ ] Endpoint `/auth/register` funcionando
- [ ] Endpoint `/auth/login` funcionando
- [ ] Endpoint `/auth/refresh` funcionando
- [ ] Endpoint `/auth/logout` funcionando
- [ ] Endpoint `/auth/me` funcionando
- [ ] Middleware `authenticate` protegendo rotas
- [ ] Validação Zod em todos os endpoints
- [ ] Senhas hasheadas com bcrypt
- [ ] Tokens JWT com expiração
- [ ] Refresh tokens persistidos
- [ ] Rate limiting (10 req/min no login)
- [ ] TypeScript sem erros
- [ ] Testes unitários

## 🔒 Segurança

- [ ] Senhas NUNCA retornadas nas respostas
- [ ] Tokens assinados com secret forte
- [ ] Rate limiting implementado
- [ ] CORS configurado corretamente
- [ ] Helmet habilitado

## 🔗 Referências

- [JWT Best Practices](https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/)
- [jsonwebtoken npm](https://www.npmjs.com/package/jsonwebtoken)
- [Zod](https://zod.dev/)

## ⏱️ Prioridade

**HIGH** - Necessário para qualquer funcionalidade protegida.
