---
name: Backend - Fix TypeScript Errors
about: Corrigir erros de compilação no modelo User.ts
title: '🔧 Fix: Corrigir erros TypeScript no User.ts'
labels: 'backend, typescript, bug'
assignees: ''
---

## 🐛 Problema

O arquivo `src/models/User.ts` possui erros de compilação TypeScript:

1. **Erro de import do bcrypt**: Usando default import incorretamente
2. **Erros de tipo no Mongoose Schema**: Tipos incompatíveis

## 🎯 Solução

### 1. Corrigir import do bcrypt

```typescript
// ❌ ERRADO (atual)
import bcrypt from 'bcrypt'

// ✅ CORRETO
import * as bcrypt from 'bcrypt'
```

### 2. Corrigir tipos do Mongoose

```typescript
// Adicionar tipos corretos para os métodos
interface IUserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

interface IUserModel extends Model<IUser, {}, IUserMethods> {
  findByEmail(email: string): Promise<HydratedDocument<IUser, IUserMethods> | null>;
}
```

## 📁 Arquivo Afetado

- `src/models/User.ts`

## ✅ Critério de Aceitação

- [ ] `npm run build` executa sem erros
- [ ] Todos os tipos do TypeScript corretos
- [ ] Método `comparePassword` funcionando
- [ ] Método estático `findByEmail` funcionando
- [ ] Pre-save hook de hash de senha funcionando

## 🔗 Referências

- [Mongoose + TypeScript](https://mongoosejs.com/docs/typescript.html)
- [bcrypt TypeScript](https://www.npmjs.com/package/@types/bcrypt)

## ⏱️ Prioridade

**HIGH** - Backend não pode ser usado até isso ser corrigido.
