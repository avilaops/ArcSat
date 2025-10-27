# 🔒 Política de Segurança - ArcSat CRM

## 🛡️ Versões Suportadas

Apenas a versão mais recente recebe atualizações de segurança.

| Versão | Suportada          |
| ------ | ------------------ |
| 1.0.x  | :white_check_mark: |
| < 1.0  | :x:                |

## 🚨 Reportando Vulnerabilidades

### ⚠️ NÃO crie issues públicas para vulnerabilidades de segurança!

Se você descobrir uma vulnerabilidade de segurança, por favor reporte de forma responsável:

1. **Email**: Envie para nicolas@avila.inc
2. **Assunto**: `[SECURITY] Descrição breve`
3. **Conteúdo**:
   - Descrição detalhada da vulnerabilidade
   - Passos para reproduzir
   - Impacto potencial
   - Sugestões de correção (se houver)

### 📅 Tempo de Resposta

- **Confirmação inicial**: 24-48 horas
- **Análise e correção**: 7-14 dias
- **Divulgação pública**: Após correção e release

## 🔐 Práticas de Segurança

### Para Desenvolvedores

#### ✅ Obrigatório

- [ ] **Nunca** commite credenciais ou secrets
- [ ] Use variáveis de ambiente para dados sensíveis
- [ ] Hash todas as senhas com bcrypt (min 12 rounds)
- [ ] Valide e sanitize todos os inputs
- [ ] Use JWT com expiração apropriada
- [ ] Implemente rate limiting em todas as rotas
- [ ] Use HTTPS em produção
- [ ] Mantenha dependências atualizadas
- [ ] Execute `npm audit` regularmente
- [ ] Use CORS apropriadamente

#### 🔍 Checklist de Segurança

```bash
# Antes de cada commit
npm audit                # Verificar vulnerabilidades
npm run lint             # Verificar código
npm test                 # Rodar testes

# Verificar secrets expostos
git log -p | grep -i "password\|secret\|key"
```

### Configurações de Segurança

#### JWT

```javascript
// ✅ BOM
const token = jwt.sign(
  { id: user._id },
  process.env.JWT_SECRET,  // Min 32 caracteres
  { expiresIn: "24h" }     // Expiração definida
);

// ❌ RUIM
const token = jwt.sign(
  { id: user._id, password: user.password },  // Nunca incluir senha
  "secret123"  // Secret fraco
);
```

#### Senha

```javascript
// ✅ BOM
const hashedPassword = await bcrypt.hash(password, 12);  // Min 12 rounds

// ❌ RUIM
const hashedPassword = crypto.createHash('md5')
  .update(password)
  .digest('hex');  // MD5 é inseguro
```

#### Validação de Input

```javascript
// ✅ BOM
const { email, password } = req.body;

if (!validator.isEmail(email)) {
  throw new Error("Email inválido");
}

if (password.length < 8) {
  throw new Error("Senha deve ter no mínimo 8 caracteres");
}

// ❌ RUIM
const user = await User.create(req.body);  // Sem validação
```

#### MongoDB Injection

```javascript
// ✅ BOM
const user = await User.findOne({ email: sanitize(email) });

// Use mongoose com validação no schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    validate: [validator.isEmail, "Email inválido"]
  }
});

// ❌ RUIM
const query = `db.users.find({ email: "${email}" })`; // Nunca use strings cruas
```

#### CORS

```javascript
// ✅ BOM - Produção
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

// ✅ BOM - Desenvolvimento
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:5500"],
  credentials: true
}));

// ❌ RUIM - Nunca em produção
app.use(cors({ origin: "*" }));
```

#### Rate Limiting

```javascript
// ✅ BOM
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutos
  max: 100,                   // 100 requisições
  message: "Muitas requisições, tente novamente mais tarde"
});

app.use("/api/", limiter);

// Mais restritivo para login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,  // Apenas 5 tentativas
  skipSuccessfulRequests: true
});

app.use("/api/v1/auth/login", loginLimiter);
```

#### Headers de Segurança (Helmet)

```javascript
import helmet from "helmet";

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
```

## 🔒 Variáveis de Ambiente Sensíveis

### ✅ Nunca commite

- `MONGO_URI`
- `JWT_SECRET`
- `EMAIL_PASS`
- `AZURE_SUBSCRIPTION_ID`
- `API_KEYS`
- Qualquer credencial

### ✅ Use .env.example

```bash
# .env.example (OK para commitar)
MONGO_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/dbname
JWT_SECRET=seu_segredo_aqui_min_32_caracteres

# .env (NUNCA commitar)
MONGO_URI=mongodb+srv://real_user:real_pass@cluster.mongodb.net/arcsat
JWT_SECRET=kjh234kj5h234kjh5234kjh5234kjh52
```

## 🚀 Deploy Seguro

### Azure App Service

```bash
# Configure secrets via Azure CLI (não no código)
az webapp config appsettings set \
  --resource-group Avila \
  --name arcsat-crm \
  --settings \
  JWT_SECRET="@Microsoft.KeyVault(SecretUri=https://...)" \
  MONGO_URI="@Microsoft.KeyVault(SecretUri=https://...)"
```

### GitHub Actions

```yaml
# Use GitHub Secrets
env:
  MONGO_URI: ${{ secrets.MONGO_URI }}
  JWT_SECRET: ${{ secrets.JWT_SECRET }}
```

## 📋 Auditoria Regular

### Semanal

```bash
npm audit                    # Vulnerabilidades
npm outdated                 # Atualizações disponíveis
```

### Mensal

```bash
npm audit fix                # Corrigir vulnerabilidades
npm update                   # Atualizar dependências
```

### Trimestral

- Revisão completa de código
- Teste de penetração
- Atualização de dependências major

## 🔗 Recursos

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Express Security](https://expressjs.com/en/advanced/best-practice-security.html)
- [MongoDB Security](https://www.mongodb.com/docs/manual/security/)

## 📞 Contato

Para questões de segurança: nicolas@avila.inc

**PGP Key Fingerprint**: (se aplicável)

---

**Última atualização**: 2025-10-27
