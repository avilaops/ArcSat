# Script PowerShell para Configuração de Domínios ArcSat
# Executa o script Node.js de configuração Cloudflare

param(
    [switch]$Test,
    [switch]$Verify,
    [string]$Domain = "arcsat.com.br"
)

Write-Host "🚀 ArcSat - Configuração de Domínios Cloudflare" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan

# Verificar se Node.js está instalado
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js detectado: $nodeVersion" -ForegroundColor Green
}
catch {
    Write-Host "❌ Node.js não encontrado. Instale Node.js primeiro." -ForegroundColor Red
    exit 1
}

# Verificar se o arquivo .env existe
$envFile = Join-Path $PSScriptRoot "..\\.env"
if (-not (Test-Path $envFile)) {
    Write-Host "❌ Arquivo .env não encontrado em: $envFile" -ForegroundColor Red
    exit 1
}

# Verificar se o token Cloudflare está configurado
$envContent = Get-Content $envFile -Raw
if ($envContent -notmatch "CLOUDFLARE_API_TOKEN=RRxGf7G_yg21arDiIoSyJBao8bzlVwsbW7kTlpMO") {
    Write-Host "⚠️ Token Cloudflare não encontrado no .env" -ForegroundColor Yellow
    Write-Host "Configure CLOUDFLARE_API_TOKEN no arquivo .env" -ForegroundColor Yellow
}

# Função para testar conectividade
function Test-CloudflareAPI {
    Write-Host "🧪 Testando conectividade com Cloudflare..." -ForegroundColor Yellow
    
    try {
        $headers = @{
            "Authorization" = "Bearer RRxGf7G_yg21arDiIoSyJBao8bzlVwsbW7kTlpMO"
            "Content-Type" = "application/json"
        }
        
        $response = Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/user/tokens/verify" -Headers $headers -Method GET
        
        if ($response.success) {
            Write-Host "✅ Token Cloudflare válido" -ForegroundColor Green
            Write-Host "📧 Email: $($response.result.user.email)" -ForegroundColor Blue
            return $true
        } else {
            Write-Host "❌ Token inválido: $($response.errors[0].message)" -ForegroundColor Red
            return $false
        }
    }
    catch {
        Write-Host "❌ Erro ao conectar com Cloudflare: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Função para verificar domínios
function Test-Domains {
    Write-Host "🔍 Verificando domínios configurados..." -ForegroundColor Yellow
    
    $subdomains = @(
        $Domain,
        "www.$Domain",
        "app.$Domain", 
        "api.$Domain",
        "docs.$Domain",
        "auth.$Domain"
    )
    
    foreach ($subdomain in $subdomains) {
        try {
            $result = Resolve-DnsName -Name $subdomain -Type CNAME -ErrorAction SilentlyContinue
            if ($result) {
                Write-Host "✅ $subdomain -> $($result.NameHost)" -ForegroundColor Green
            } else {
                $result = Resolve-DnsName -Name $subdomain -Type A -ErrorAction SilentlyContinue
                if ($result) {
                    Write-Host "✅ $subdomain -> $($result.IPAddress)" -ForegroundColor Green
                } else {
                    Write-Host "❌ $subdomain - Não resolvido" -ForegroundColor Red
                }
            }
        }
        catch {
            Write-Host "❌ $subdomain - Erro: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
}

# Executar baseado nos parâmetros
if ($Test) {
    $isValid = Test-CloudflareAPI
    if (-not $isValid) {
        exit 1
    }
    exit 0
}

if ($Verify) {
    Test-Domains
    exit 0
}

# Configuração principal
Write-Host "🔧 Iniciando configuração de domínios..." -ForegroundColor Yellow

# Testar API primeiro
$isValid = Test-CloudflareAPI
if (-not $isValid) {
    Write-Host "❌ Falha na validação da API. Verifique o token." -ForegroundColor Red
    exit 1
}

# Executar script Node.js
try {
    Write-Host "🚀 Executando configuração..." -ForegroundColor Blue
    
    $scriptPath = Join-Path $PSScriptRoot "setup-domains.js"
    node $scriptPath
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "🎉 Configuração concluída com sucesso!" -ForegroundColor Green
        
        # Verificar domínios após configuração
        Write-Host "`n⏰ Aguardando propagação DNS..." -ForegroundColor Yellow
        Start-Sleep -Seconds 30
        
        Write-Host "`n🔍 Verificando domínios..." -ForegroundColor Blue
        Test-Domains
        
        Write-Host "`n🌐 URLs configuradas:" -ForegroundColor Cyan
        Write-Host "  🏠 Landing Page: https://$Domain" -ForegroundColor Blue
        Write-Host "  📱 Aplicação: https://app.$Domain" -ForegroundColor Blue  
        Write-Host "  🔧 API: https://api.$Domain" -ForegroundColor Blue
        Write-Host "  📚 Docs: https://docs.$Domain" -ForegroundColor Blue
        Write-Host "  🔐 Auth: https://auth.$Domain" -ForegroundColor Blue
        
    } else {
        Write-Host "❌ Falha na configuração" -ForegroundColor Red
        exit 1
    }
}
catch {
    Write-Host "❌ Erro ao executar script: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "`n✅ Configuração de domínios concluída!" -ForegroundColor Green