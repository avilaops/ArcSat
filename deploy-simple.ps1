# Deploy Simples - ArcSat CRM para crm.avila.inc
param(
    [string]$ResourceGroup = "rg-arcsat-crm",
    [string]$Location = "brazilsouth",
    [string]$AppName = "arcsat-crm",
    [string]$CustomDomain = "crm.avila.inc",
    [string]$Sku = "B1"
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Deploy ArcSat CRM - crm.avila.inc" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# 1. Criar Resource Group
Write-Host "`n[1/6] Criando Resource Group..." -ForegroundColor Yellow
$rgExists = az group exists --name $ResourceGroup
if ($rgExists -eq "false") {
    az group create --name $ResourceGroup --location $Location | Out-Null
    Write-Host "OK - Resource Group criado" -ForegroundColor Green
} else {
    Write-Host "OK - Resource Group ja existe" -ForegroundColor Gray
}

# 2. Criar App Service Plan
Write-Host "`n[2/6] Criando App Service Plan..." -ForegroundColor Yellow
$planName = "$AppName-plan"
$planExists = az appservice plan show --name $planName --resource-group $ResourceGroup 2>$null
if (-not $planExists) {
    az appservice plan create `
        --name $planName `
        --resource-group $ResourceGroup `
        --sku $Sku `
        --is-linux `
        --location $Location | Out-Null
    Write-Host "OK - App Service Plan criado ($Sku)" -ForegroundColor Green
} else {
    Write-Host "OK - App Service Plan ja existe" -ForegroundColor Gray
}

# 3. Criar Web App
Write-Host "`n[3/6] Criando Web App..." -ForegroundColor Yellow
$webAppExists = az webapp show --name $AppName --resource-group $ResourceGroup 2>$null
if (-not $webAppExists) {
    az webapp create `
        --name $AppName `
        --resource-group $ResourceGroup `
        --plan $planName `
        --runtime "NODE:20-lts" | Out-Null
    Write-Host "OK - Web App criado" -ForegroundColor Green
} else {
    Write-Host "OK - Web App ja existe" -ForegroundColor Gray
}

# 4. Configurar App Settings
Write-Host "`n[4/6] Configurando variaveis de ambiente..." -ForegroundColor Yellow
$envContent = Get-Content .env -Raw
$envVars = @{}
$envContent -split "`n" | ForEach-Object {
    if ($_ -match '^([^#][^=]+)=(.*)$') {
        $key = $matches[1].Trim()
        $value = $matches[2].Trim()
        if ($key -and $value) {
            $envVars[$key] = $value
        }
    }
}

$settings = @(
    "NODE_ENV=production"
    "WEBSITE_NODE_DEFAULT_VERSION=~20"
    "SCM_DO_BUILD_DURING_DEPLOYMENT=true"
)
foreach ($key in $envVars.Keys) {
    $settings += "$key=$($envVars[$key])"
}

az webapp config appsettings set `
    --name $AppName `
    --resource-group $ResourceGroup `
    --settings $settings | Out-Null
Write-Host "OK - Variaveis configuradas" -ForegroundColor Green

# 5. Configurar dominio customizado
Write-Host "`n[5/6] Configurando dominio customizado..." -ForegroundColor Yellow
Write-Host "ATENCAO: Configure o DNS primeiro!" -ForegroundColor Red
Write-Host "  Tipo: CNAME" -ForegroundColor Gray
Write-Host "  Nome: crm" -ForegroundColor Gray
Write-Host "  Valor: $AppName.azurewebsites.net" -ForegroundColor Gray

$continue = Read-Host "`nDNS configurado? (s/n)"
if ($continue -eq "s") {
    try {
        az webapp config hostname add `
            --webapp-name $AppName `
            --resource-group $ResourceGroup `
            --hostname $CustomDomain 2>$null | Out-Null
        Write-Host "OK - Dominio adicionado" -ForegroundColor Green
        
        # SSL
        az webapp config ssl create `
            --name $AppName `
            --resource-group $ResourceGroup `
            --hostname $CustomDomain 2>$null | Out-Null
        
        az webapp update `
            --name $AppName `
            --resource-group $ResourceGroup `
            --https-only true | Out-Null
        Write-Host "OK - SSL configurado" -ForegroundColor Green
    } catch {
        Write-Host "AVISO - Verifique o DNS e tente novamente mais tarde" -ForegroundColor Yellow
    }
} else {
    Write-Host "Pulando configuracao de dominio" -ForegroundColor Gray
}

# 6. Deploy
Write-Host "`n[6/6] Fazendo deploy da aplicacao..." -ForegroundColor Yellow
Write-Host "Build do frontend..." -ForegroundColor Gray
Push-Location "frontend\arcsat-landing"
npm install --silent
npm run build --silent
Pop-Location

Write-Host "Criando pacote..." -ForegroundColor Gray
if (Test-Path "deployment.zip") { Remove-Item "deployment.zip" }
Compress-Archive -Path "src","package.json" -DestinationPath "deployment.zip" -Force

Write-Host "Upload para Azure..." -ForegroundColor Gray
az webapp deployment source config-zip `
    --resource-group $ResourceGroup `
    --name $AppName `
    --src "deployment.zip" | Out-Null

az webapp restart --name $AppName --resource-group $ResourceGroup | Out-Null
Write-Host "OK - Deploy concluido!" -ForegroundColor Green

# Resumo
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  DEPLOY CONCLUIDO COM SUCESSO!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "`nURLs:" -ForegroundColor White
Write-Host "  Producao: https://$CustomDomain" -ForegroundColor Green
Write-Host "  Azure: https://$AppName.azurewebsites.net" -ForegroundColor Gray
Write-Host "`nPortal: https://portal.azure.com" -ForegroundColor Gray
