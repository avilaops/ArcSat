# 📖 Documentação da API - ArcSat CRM

Base URL: `http://localhost:5500/api/v1`

## 📚 Índice

- [Autenticação](#autenticação)
- [Usuários](#usuários)
- [Empresas](#empresas)
- [CNPJ](#cnpj)
- [Códigos de Status](#códigos-de-status)
- [Exemplos](#exemplos)

## 🔐 Autenticação

Todas as rotas protegidas requerem um token JWT no header:

```
Authorization: Bearer {token}
```

### POST /auth/register

Registrar novo usuário.

**Request:**
```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123",
  "company": "64f5b3c2e4b0a1234567890"
}
```

**Response: 201 Created**
```json
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f5b3c2e4b0a1234567891",
    "name": "João Silva",
    "email": "joao@example.com",
    "role": "user"
  }
}
```

### POST /auth/login

Login de usuário.

**Request:**
```json
{
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Response: 200 OK**
```json
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f5b3c2e4b0a1234567891",
    "name": "João Silva",
    "email": "joao@example.com",
    "role": "user"
  }
}
```

**Erros:**
- `401` - Email ou senha incorretos
- `400` - Dados inválidos

## 👥 Usuários

### GET /users

Listar todos os usuários (Admin only).

**Headers:**
```
Authorization: Bearer {token}
```

**Response: 200 OK**
```json
{
  "status": "success",
  "count": 2,
  "data": [
    {
      "id": "64f5b3c2e4b0a1234567891",
      "name": "João Silva",
      "email": "joao@example.com",
      "role": "user",
      "company": {
        "id": "64f5b3c2e4b0a1234567890",
        "name": "Empresa XYZ"
      },
      "createdAt": "2025-01-15T10:30:00.000Z"
    }
  ]
}
```

### GET /users/:id

Buscar usuário por ID.

**Response: 200 OK**
```json
{
  "status": "success",
  "data": {
    "id": "64f5b3c2e4b0a1234567891",
    "name": "João Silva",
    "email": "joao@example.com",
    "role": "user",
    "company": {
      "id": "64f5b3c2e4b0a1234567890",
      "name": "Empresa XYZ"
    },
    "createdAt": "2025-01-15T10:30:00.000Z",
    "lastLogin": "2025-01-20T15:45:00.000Z"
  }
}
```

### PUT /users/:id

Atualizar usuário.

**Request:**
```json
{
  "name": "João Silva Jr.",
  "email": "joao.jr@example.com"
}
```

**Response: 200 OK**
```json
{
  "status": "success",
  "data": {
    "id": "64f5b3c2e4b0a1234567891",
    "name": "João Silva Jr.",
    "email": "joao.jr@example.com",
    "role": "user"
  }
}
```

### DELETE /users/:id

Deletar usuário (Admin only).

**Response: 204 No Content**

## 🏢 Empresas

### POST /companies

Criar nova empresa.

**Request:**
```json
{
  "name": "Empresa XYZ Ltda",
  "cnpj": "12.345.678/0001-99",
  "category": "cliente",
  "address": {
    "street": "Rua das Flores",
    "number": "123",
    "neighborhood": "Centro",
    "city": "São Paulo",
    "state": "SP",
    "zipCode": "01234-567"
  },
  "contacts": [
    {
      "name": "Maria Santos",
      "role": "Gerente",
      "phone": "(11) 98765-4321",
      "email": "maria@empresa.com"
    }
  ]
}
```

**Response: 201 Created**
```json
{
  "status": "success",
  "data": {
    "id": "64f5b3c2e4b0a1234567890",
    "name": "Empresa XYZ Ltda",
    "cnpj": "12.345.678/0001-99",
    "category": "cliente",
    "status": "ativo",
    "createdAt": "2025-01-15T10:30:00.000Z"
  }
}
```

### GET /companies

Listar todas as empresas.

**Query Parameters:**
- `category` - Filtrar por categoria (cliente, fornecedor, parceiro)
- `status` - Filtrar por status (ativo, inativo, prospecto)
- `page` - Número da página (padrão: 1)
- `limit` - Items por página (padrão: 10)

**Response: 200 OK**
```json
{
  "status": "success",
  "count": 25,
  "page": 1,
  "pages": 3,
  "data": [
    {
      "id": "64f5b3c2e4b0a1234567890",
      "name": "Empresa XYZ Ltda",
      "cnpj": "12.345.678/0001-99",
      "category": "cliente",
      "status": "ativo"
    }
  ]
}
```

### GET /companies/:id

Buscar empresa por ID.

**Response: 200 OK**
```json
{
  "status": "success",
  "data": {
    "id": "64f5b3c2e4b0a1234567890",
    "name": "Empresa XYZ Ltda",
    "cnpj": "12.345.678/0001-99",
    "category": "cliente",
    "status": "ativo",
    "address": {
      "street": "Rua das Flores",
      "number": "123",
      "city": "São Paulo",
      "state": "SP"
    },
    "contacts": [
      {
        "name": "Maria Santos",
        "role": "Gerente",
        "phone": "(11) 98765-4321",
        "email": "maria@empresa.com"
      }
    ],
    "createdAt": "2025-01-15T10:30:00.000Z"
  }
}
```

### PUT /companies/:id

Atualizar empresa.

**Request:**
```json
{
  "status": "inativo",
  "notes": "Contrato encerrado"
}
```

**Response: 200 OK**
```json
{
  "status": "success",
  "data": {
    "id": "64f5b3c2e4b0a1234567890",
    "name": "Empresa XYZ Ltda",
    "status": "inativo",
    "updatedAt": "2025-01-20T15:45:00.000Z"
  }
}
```

### DELETE /companies/:id

Deletar empresa.

**Response: 204 No Content**

## 🔍 CNPJ

### GET /cnpj/:cnpj

Consultar informações de CNPJ.

**Parâmetros:**
- `cnpj` - CNPJ com ou sem formatação

**Response: 200 OK**
```json
{
  "status": "success",
  "data": {
    "cnpj": "12.345.678/0001-99",
    "razaoSocial": "EMPRESA XYZ LTDA",
    "nomeFantasia": "Empresa XYZ",
    "situacao": "ATIVA",
    "dataAbertura": "2020-01-15",
    "endereco": {
      "logradouro": "Rua das Flores",
      "numero": "123",
      "bairro": "Centro",
      "municipio": "São Paulo",
      "uf": "SP",
      "cep": "01234-567"
    },
    "telefone": "(11) 3456-7890",
    "email": "contato@empresa.com",
    "capitalSocial": "100000.00",
    "atividades": [
      {
        "codigo": "6201-5/00",
        "descricao": "Desenvolvimento de programas de computador sob encomenda"
      }
    ]
  }
}
```

**Erros:**
- `404` - CNPJ não encontrado
- `400` - CNPJ inválido

## 📊 Códigos de Status

| Código | Descrição |
|--------|-----------|
| 200 | OK - Requisição bem-sucedida |
| 201 | Created - Recurso criado com sucesso |
| 204 | No Content - Requisição bem-sucedida sem conteúdo |
| 400 | Bad Request - Dados inválidos |
| 401 | Unauthorized - Não autenticado |
| 403 | Forbidden - Sem permissão |
| 404 | Not Found - Recurso não encontrado |
| 409 | Conflict - Conflito (ex: email já existe) |
| 429 | Too Many Requests - Rate limit excedido |
| 500 | Internal Server Error - Erro no servidor |

## 💡 Exemplos

### JavaScript (Fetch)

```javascript
// Login
const response = await fetch('http://localhost:5500/api/v1/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'joao@example.com',
    password: 'senha123'
  })
});

const { token, user } = await response.json();

// Usar token em requisições
const companiesResponse = await fetch('http://localhost:5500/api/v1/companies', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

const companies = await companiesResponse.json();
```

### cURL

```bash
# Login
curl -X POST http://localhost:5500/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@example.com","password":"senha123"}'

# Listar empresas
curl http://localhost:5500/api/v1/companies \
  -H "Authorization: Bearer {token}"

# Consultar CNPJ
curl http://localhost:5500/api/v1/cnpj/12345678000199
```

### Python (Requests)

```python
import requests

# Login
response = requests.post(
    'http://localhost:5500/api/v1/auth/login',
    json={
        'email': 'joao@example.com',
        'password': 'senha123'
    }
)

data = response.json()
token = data['token']

# Listar empresas
response = requests.get(
    'http://localhost:5500/api/v1/companies',
    headers={'Authorization': f'Bearer {token}'}
)

companies = response.json()
```

## 📝 Notas

- Todos os timestamps estão em formato ISO 8601
- Paginação padrão: 10 items por página
- Rate limit: 100 requisições por 15 minutos
- Token JWT expira em 24 horas

---

**Documentação gerada em:** 2025-10-27
**Versão da API:** v1.0.0
