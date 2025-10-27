# 🤝 Guia de Contribuição - ArcSat CRM

Obrigado por considerar contribuir com o ArcSat CRM! Este documento fornece diretrizes para contribuir com o projeto.

## 📋 Índice

- [Código de Conduta](#código-de-conduta)
- [Como Contribuir](#como-contribuir)
- [Padrões de Código](#padrões-de-código)
- [Processo de Pull Request](#processo-de-pull-request)
- [Reportando Bugs](#reportando-bugs)
- [Sugerindo Melhorias](#sugerindo-melhorias)

## 📜 Código de Conduta

Este projeto adere a um código de conduta. Ao participar, você deve manter um ambiente respeitoso e colaborativo.

## 🚀 Como Contribuir

### 1. Configure o Ambiente

```bash
# Clone o repositório
git clone https://github.com/avilaops/ArcSat.git
cd ArcSat

# Instale as dependências
npm install
cd frontend/arcsat-landing && npm install && cd ../..

# Configure as variáveis de ambiente
cp .env.example .env
```

### 2. Crie uma Branch

```bash
# Atualize a branch main
git checkout main
git pull origin main

# Crie uma nova branch
git checkout -b tipo/descricao-curta
```

**Tipos de branches:**
- `feature/` - Nova funcionalidade
- `fix/` - Correção de bug
- `docs/` - Documentação
- `refactor/` - Refatoração
- `test/` - Testes
- `chore/` - Tarefas gerais

**Exemplos:**
```bash
git checkout -b feature/adiciona-modulo-vendas
git checkout -b fix/corrige-validacao-email
git checkout -b docs/atualiza-api-readme
```

### 3. Faça suas Alterações

- Escreva código limpo e bem documentado
- Siga os padrões de código do projeto
- Adicione testes quando aplicável
- Atualize a documentação se necessário

### 4. Teste suas Alterações

```bash
# Backend
npm run lint
npm test

# Frontend
cd frontend/arcsat-landing
npm run lint
npm run build
```

### 5. Commit suas Mudanças

Use **commits semânticos** seguindo o padrão [Conventional Commits](https://www.conventionalcommits.org/):

```bash
git add .
git commit -m "tipo: descrição curta"
```

**Tipos de commit:**
- `feat` - Nova funcionalidade
- `fix` - Correção de bug
- `docs` - Documentação
- `style` - Formatação (sem mudança de código)
- `refactor` - Refatoração
- `test` - Testes
- `chore` - Tarefas de build, configurações, etc.
- `perf` - Melhorias de performance
- `ci` - Integração contínua

**Exemplos:**
```bash
git commit -m "feat: adiciona endpoint de busca de produtos"
git commit -m "fix: corrige erro na validação de CNPJ"
git commit -m "docs: atualiza guia de instalação"
git commit -m "refactor: melhora estrutura do modelo User"
git commit -m "test: adiciona testes para rota de auth"
```

### 6. Push para o GitHub

```bash
git push origin tipo/descricao-curta
```

### 7. Abra um Pull Request

1. Acesse o repositório no GitHub
2. Clique em "Compare & pull request"
3. Preencha o template de PR
4. Aguarde a revisão

## 📝 Padrões de Código

### JavaScript/Node.js

```javascript
// ✅ BOM
const getUserById = async (id) => {
  try {
    const user = await User.findById(id);
    return user;
  } catch (error) {
    throw new Error(`Erro ao buscar usuário: ${error.message}`);
  }
};

// ❌ RUIM
const getUser = async(id)=>{
  const user=await User.findById(id);
  return user;
}
```

**Regras:**
- Use `const` e `let`, nunca `var`
- Use arrow functions quando apropriado
- Sempre use try-catch em funções async
- Use nomes descritivos para variáveis e funções
- Adicione comentários quando necessário
- Use aspas duplas para strings

### TypeScript/React

```typescript
// ✅ BOM
interface UserProps {
  name: string;
  email: string;
  role?: "admin" | "user";
}

const UserCard: React.FC<UserProps> = ({ name, email, role = "user" }) => {
  return (
    <div className="user-card">
      <h3>{name}</h3>
      <p>{email}</p>
      <span>{role}</span>
    </div>
  );
};

// ❌ RUIM
const UserCard = (props) => (
  <div>
    <h3>{props.name}</h3>
  </div>
)
```

**Regras:**
- Sempre defina tipos/interfaces
- Use componentes funcionais
- Use hooks do React apropriadamente
- Componentes devem ter responsabilidade única
- Use TypeScript strict mode

### MongoDB/Mongoose

```javascript
// ✅ BOM
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Nome é obrigatório"],
    trim: true,
    minlength: [3, "Nome deve ter no mínimo 3 caracteres"]
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Email inválido"]
  }
}, {
  timestamps: true
});

// ❌ RUIM
const userSchema = new mongoose.Schema({
  name: String,
  email: String
});
```

**Regras:**
- Sempre defina validações nos schemas
- Use `timestamps: true` para createdAt/updatedAt
- Adicione indexes para campos pesquisados
- Use populate() ao invés de múltiplas queries
- Implemente soft deletes quando apropriado

## 🔍 Processo de Pull Request

### Template de PR

Ao abrir um PR, inclua:

```markdown
## Descrição
Breve descrição das mudanças.

## Tipo de Mudança
- [ ] Bug fix
- [ ] Nova funcionalidade
- [ ] Breaking change
- [ ] Documentação

## Como Testar
1. Passo 1
2. Passo 2
3. Passo 3

## Checklist
- [ ] Código segue os padrões do projeto
- [ ] Testes foram adicionados/atualizados
- [ ] Documentação foi atualizada
- [ ] Todos os testes passam
- [ ] Lint passa sem erros
```

### Revisão de Código

- Todos os PRs devem ser revisados por pelo menos 1 pessoa
- Resolva todos os comentários antes do merge
- Mantenha PRs pequenos e focados
- PRs grandes devem ser divididos

### Merge

- Após aprovação, o PR será merged pelo mantenedor
- Use "Squash and merge" para manter histórico limpo
- Delete a branch após o merge

## 🐛 Reportando Bugs

### Antes de Reportar

1. Verifique se o bug já foi reportado
2. Verifique se está na versão mais recente
3. Tente reproduzir o bug

### Como Reportar

Crie uma issue com:

```markdown
**Descrição do Bug**
Descrição clara do que aconteceu.

**Passos para Reproduzir**
1. Vá para '...'
2. Clique em '....'
3. Veja o erro

**Comportamento Esperado**
O que deveria acontecer.

**Screenshots**
Se aplicável, adicione screenshots.

**Ambiente**
- OS: [ex: Windows 11]
- Node: [ex: 18.0.0]
- Browser: [ex: Chrome 120]

**Informações Adicionais**
Qualquer outra informação relevante.
```

## 💡 Sugerindo Melhorias

### Template de Sugestão

```markdown
**Sua Sugestão**
Descrição clara da melhoria.

**Problema que Resolve**
Qual problema isso resolve?

**Solução Proposta**
Como você imagina que isso funcionaria?

**Alternativas Consideradas**
Quais outras soluções você considerou?

**Contexto Adicional**
Screenshots, mockups, exemplos, etc.
```

## 📚 Recursos Úteis

- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [React Best Practices](https://react.dev/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [MongoDB Best Practices](https://www.mongodb.com/docs/manual/administration/production-notes/)

## ❓ Dúvidas

Se tiver dúvidas, você pode:

- Abrir uma issue com a tag `question`
- Entrar em contato: nicolas@avila.inc

---

**Obrigado por contribuir! 🚀**
