# Configuração de DNS Cloudflare para ArcSat

DOMAIN=arcsat.com.br

# Registros A (proxy através do Cloudflare)
arcsat.com.br               -> Azure Static Web App (landing page)
app.arcsat.com.br          -> Azure App Service (frontend)
api.arcsat.com.br          -> Azure App Service (backend)
docs.arcsat.com.br         -> GitHub Pages
auth.arcsat.com.br         -> Azure App Service (autenticação)

# Configurações de SSL/TLS
- Modo: Full (strict)
- Always Use HTTPS: On
- Min TLS Version: 1.2
- HTTP/2: On
- HSTS: On

# Page Rules
- *arcsat.com.br/*
  - SSL: Full (strict)
  - Always Use HTTPS
  - Cache Level: Standard

# Workers (edge functions)
- Redirect www to non-www
- Security headers
- Rate limiting