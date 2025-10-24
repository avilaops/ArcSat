---
name: Backend - Create Company Model
about: Implementar modelo Mongoose para empresas/clientes corporativos
title: '✨ Feature: Criar modelo Company.ts'
labels: 'backend, feature, database'
assignees: ''
---

## 🎯 Objetivo

Criar modelo Mongoose completo para gestão de empresas/clientes corporativos (B2B).

## 📋 Requisitos

### Interface TypeScript

```typescript
interface ICompany {
  id: string;
  cnpj: string; // Único, validado
  razaoSocial: string;
  nomeFantasia: string;
  email: string;
  telefone: string;
  endereco: {
    cep: string;
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
  };
  subscriptionPlan: SubscriptionPlan; // BASIC | PRO | ENTERPRISE
  subscriptionStatus: SubscriptionStatus; // ACTIVE | SUSPENDED | CANCELLED
  paymentMethod?: string;
  billingDay?: number; // 1-28
  createdAt: Date;
  updatedAt: Date;
}
```

### Validações

- [x] CNPJ: 14 dígitos, formato válido
- [x] Email: formato válido
- [x] Telefone: formato válido (DDD + número)
- [x] CEP: 8 dígitos

### Métodos

```typescript
// Método estático
CompanyModel.findByCNPJ(cnpj: string): Promise<ICompany | null>

// Método de instância
company.toPublicJSON(): object // Remove campos sensíveis
```

### Indexes

- CNPJ (único)
- Email (único)
- subscriptionStatus + createdAt (para queries)

## 📁 Localização

`src/models/Company.ts`

## ✅ Critério de Aceitação

- [ ] Interface `ICompany` definida em `src/types/index.ts`
- [ ] Schema Mongoose implementado
- [ ] Validações implementadas (CNPJ, email, telefone)
- [ ] Método `findByCNPJ` implementado
- [ ] Método `toPublicJSON` implementado
- [ ] Indexes criados
- [ ] TypeScript compila sem erros
- [ ] Testes unitários (opcional)

## 🔗 Referências

- [Mongoose Schema Types](https://mongoosejs.com/docs/schematypes.html)
- [Mongoose Validation](https://mongoosejs.com/docs/validation.html)
- [Validação CNPJ](https://www.npmjs.com/package/cnpj)

## ⏱️ Prioridade

**MEDIUM** - Necessário para CRUD de empresas.
