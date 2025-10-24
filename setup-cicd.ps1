# Script de Configuração Automática do ArcSat CI/CD
# Execute com: .\setup-cicd.ps1

Write-Host "🚀 ArcSat - Configuração de CI/CD" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# 1. Verificar Azure CLI
Write-Host "✅ Verificando Azure CLI..." -ForegroundColor Yellow
$azVersion = az version 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Azure CLI não encontrado. Instale em: https://aka.ms/installazurecli" -ForegroundColor Red
    exit 1
}
Write-Host "   Azure CLI detectado" -ForegroundColor Green

# 2. Obter token do Azure Static Web App
Write-Host ""
Write-Host "✅ Obtendo token do Azure Static Web App..." -ForegroundColor Yellow
$azureToken = az staticwebapp secrets list `
    --name arcsat-frontend `
    --resource-group Avila `
    --query "properties.apiKey" `
    --output tsv 2>$null

if ([string]::IsNullOrEmpty($azureToken)) {
    Write-Host "❌ Erro ao obter token do Azure" -ForegroundColor Red
    exit 1
}
Write-Host "   Token obtido (comprimento: $($azureToken.Length))" -ForegroundColor Green

# 3. Verificar GitHub CLI
Write-Host ""
Write-Host "✅ Verificando GitHub CLI..." -ForegroundColor Yellow
$ghVersion = gh --version 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  GitHub CLI não encontrado" -ForegroundColor Yellow
    Write-Host "   Salvando token em arquivo..." -ForegroundColor Yellow
    $azureToken | Out-File -FilePath ".\AZURE_TOKEN.txt" -Encoding UTF8 -NoNewline
    Write-Host ""
    Write-Host "📋 Configure manualmente:" -ForegroundColor Cyan
    Write-Host "   1. Acesse: https://github.com/avilaops/ArcSat/settings/secrets/actions"
    Write-Host "   2. Crie secret: AZURE_STATIC_WEB_APPS_API_TOKEN"
    Write-Host "   3. Cole o conteúdo de: AZURE_TOKEN.txt"
    Write-Host "   4. Delete o arquivo: Remove-Item .\AZURE_TOKEN.txt"
    exit 0
}

# 4. Verificar autenticação do GitHub
Write-Host "   GitHub CLI detectado" -ForegroundColor Green
Write-Host ""
Write-Host "✅ Verificando autenticação do GitHub..." -ForegroundColor Yellow
gh auth status 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Não autenticado no GitHub" -ForegroundColor Red
    Write-Host "   Execute: gh auth login" -ForegroundColor Yellow
    exit 1
}
Write-Host "   Autenticado" -ForegroundColor Green

# 5. Configurar secret no GitHub
Write-Host ""
Write-Host "✅ Configurando secret AZURE_STATIC_WEB_APPS_API_TOKEN..." -ForegroundColor Yellow
$azureToken | gh secret set AZURE_STATIC_WEB_APPS_API_TOKEN `
    --repo avilaops/ArcSat `
    2>$null

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao configurar secret" -ForegroundColor Red
    exit 1
}
Write-Host "   Secret configurado com sucesso!" -ForegroundColor Green

# 6. Listar secrets configurados
Write-Host ""
Write-Host "✅ Secrets configurados no repositório:" -ForegroundColor Yellow
gh secret list --repo avilaops/ArcSat 2>$null

# 7. Verificar último workflow
Write-Host ""
Write-Host "✅ Verificando último workflow..." -ForegroundColor Yellow
$lastRun = gh run list --repo avilaops/ArcSat --limit 1 --json status,conclusion,createdAt,name 2>$null | ConvertFrom-Json
if ($lastRun) {
    Write-Host "   Nome: $($lastRun[0].name)" -ForegroundColor White
    Write-Host "   Status: $($lastRun[0].status)" -ForegroundColor White
    Write-Host "   Conclusão: $($lastRun[0].conclusion)" -ForegroundColor White
    Write-Host "   Criado em: $($lastRun[0].createdAt)" -ForegroundColor White
}

# 8. Próximos passos
Write-Host ""
Write-Host "🎉 Configuração concluída!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Próximos passos:" -ForegroundColor Cyan
Write-Host "   1. Faça um commit e push para testar o workflow"
Write-Host "   2. Monitore em: https://github.com/avilaops/ArcSat/actions"
Write-Host "   3. Configure environments (opcional):"
Write-Host "      https://github.com/avilaops/ArcSat/settings/environments"
Write-Host ""
Write-Host "🌐 Seu site:" -ForegroundColor Cyan
Write-Host "   • Azure: https://wonderful-sand-0adc5890f.3.azurestaticapps.net"
Write-Host "   • Custom: https://www.arcsat.com.br"
Write-Host ""
