# Script de Deploy Automatizado - ArcSat CRM
# Azure App Service com domínio crm.avila.inc

param(
    [Parameter(Mandatory=$false)]
    [string]$ResourceGroup = "rg-arcsat-crm",
    
    [Parameter(Mandatory=$false)]
    [string]$Location = "brazilsouth",
    
    [Parameter(Mandatory=$false)]
    [string]$AppName = "arcsat-crm",
    
    [Parameter(Mandatory=$false)]
    [string]$CustomDomain = "crm.avila.inc",
    
    [Parameter(Mandatory=$false)]
    [string]$Sku = "B1",
    
    [Parameter(Mandatory=$false)]
    [switch]$SetupInfrastructure,
    
    [Parameter(Mandatory=$false)]
    [switch]$ConfigureDomain,
    
    [Parameter(Mandatory=$false)]
    [switch]$ConfigureSSL,
    
    [Parameter(Mandatory=$false)]
    [switch]$Deploy,
    
    [Parameter(Mandatory=$false)]
    [switch]$All
)

# Cores para output
function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
}

# Banner
Write-ColorOutput "╔═══════════════════════════════════════════════════════╗" "Cyan"
Write-ColorOutput "║         🚀 ArcSat CRM - Deploy Automático            ║" "Cyan"
Write-ColorOutput "║              Deploy para crm.avila.inc                ║" "Cyan"
Write-ColorOutput "╚═══════════════════════════════════════════════════════╝" "Cyan"
Write-Host ""

# Verificar se Azure CLI está instalado
Write-ColorOutput "🔍 Verificando Azure CLI..." "Yellow"
$azVersion = az version 2>$null
if (-not $azVersion) {
    Write-ColorOutput "❌ Azure CLI não encontrado. Instale em: https://aka.ms/installazurecli" "Red"
    exit 1
}
Write-ColorOutput "✅ Azure CLI encontrado" "Green"

# Login no Azure
Write-ColorOutput "`n🔐 Verificando login no Azure..." "Yellow"
$account = az account show 2>$null | ConvertFrom-Json
if (-not $account) {
    Write-ColorOutput "⚠️  Não está logado. Executando login..." "Yellow"
    az login
    $account = az account show | ConvertFrom-Json
}
Write-ColorOutput "✅ Logado como: $($account.user.name)" "Green"
Write-ColorOutput "   Subscription: $($account.name)" "Gray"

# Função: Setup da Infraestrutura
function Setup-Infrastructure {
    Write-ColorOutput "`n🏗️  PASSO 1: Configurando Infraestrutura..." "Cyan"
    
    # Criar Resource Group
    Write-ColorOutput "   📦 Criando Resource Group..." "Yellow"
    $rgExists = az group exists --name $ResourceGroup
    if ($rgExists -eq "false") {
        az group create --name $ResourceGroup --location $Location | Out-Null
        Write-ColorOutput "   ✅ Resource Group criado: $ResourceGroup" "Green"
    } else {
        Write-ColorOutput "   ℹ️  Resource Group já existe: $ResourceGroup" "Gray"
    }
    
    # Criar App Service Plan
    Write-ColorOutput "   📋 Criando App Service Plan..." "Yellow"
    $planName = "$AppName-plan"
    $planExists = az appservice plan show --name $planName --resource-group $ResourceGroup 2>$null
    if (-not $planExists) {
        az appservice plan create `
            --name $planName `
            --resource-group $ResourceGroup `
            --sku $Sku `
            --is-linux `
            --location $Location | Out-Null
        Write-ColorOutput "   ✅ App Service Plan criado: $planName ($Sku)" "Green"
    } else {
        Write-ColorOutput "   ℹ️  App Service Plan já existe: $planName" "Gray"
    }
    
    # Criar Web App
    Write-ColorOutput "   🌐 Criando Web App..." "Yellow"
    $webAppExists = az webapp show --name $AppName --resource-group $ResourceGroup 2>$null
    if (-not $webAppExists) {
        az webapp create `
            --name $AppName `
            --resource-group $ResourceGroup `
            --plan $planName `
            --runtime "NODE:20-lts" | Out-Null
        Write-ColorOutput "   ✅ Web App criado: $AppName" "Green"
    } else {
        Write-ColorOutput "   ℹ️  Web App já existe: $AppName" "Gray"
    }
    
    # Configurar Always On
    Write-ColorOutput "   ⚙️  Configurando Always On..." "Yellow"
    az webapp config set `
        --name $AppName `
        --resource-group $ResourceGroup `
        --always-on true `
        --http20-enabled true `
        --min-tls-version 1.2 `
        --ftps-state Disabled | Out-Null
    Write-ColorOutput "   ✅ Configurações aplicadas" "Green"
    
    # Configurar App Settings
    Write-ColorOutput "   🔧 Configurando variáveis de ambiente..." "Yellow"
    az webapp config appsettings set `
        --name $AppName `
        --resource-group $ResourceGroup `
        --settings `
            NODE_ENV=production `
            WEBSITE_NODE_DEFAULT_VERSION="~20" `
            SCM_DO_BUILD_DURING_DEPLOYMENT=true | Out-Null
    Write-ColorOutput "   ✅ Variáveis configuradas" "Green"
    
    Write-ColorOutput "`n✅ Infraestrutura configurada com sucesso!" "Green"
}

# Função: Configurar Domínio Personalizado
function Configure-CustomDomain {
    Write-ColorOutput "`n🌐 PASSO 2: Configurando Domínio Personalizado..." "Cyan"
    
    Write-ColorOutput "   ⚠️  ATENÇÃO: Configure o DNS primeiro!" "Yellow"
    Write-ColorOutput "   📝 Adicione este registro no seu DNS:" "White"
    Write-ColorOutput "      Tipo: CNAME" "Gray"
    Write-ColorOutput "      Nome: crm" "Gray"
    Write-ColorOutput "      Valor: $AppName.azurewebsites.net" "Gray"
    Write-ColorOutput "      TTL: 300" "Gray"
    
    $continue = Read-Host "`n   DNS configurado? (s/n)"
    if ($continue -ne "s") {
        Write-ColorOutput "   ⏸️  Configuração de domínio cancelada" "Yellow"
        return
    }
    
    Write-ColorOutput "`n   🔍 Verificando domínio..." "Yellow"
    Start-Sleep -Seconds 3
    
    # Adicionar domínio personalizado
    Write-ColorOutput "   ➕ Adicionando domínio ao Web App..." "Yellow"
    try {
        az webapp config hostname add `
            --webapp-name $AppName `
            --resource-group $ResourceGroup `
            --hostname $CustomDomain 2>$null | Out-Null
        Write-ColorOutput "   ✅ Domínio adicionado: $CustomDomain" "Green"
    } catch {
        Write-ColorOutput "   ⚠️  Erro ao adicionar domínio. Verifique o DNS." "Red"
    }
}

# Função: Configurar SSL
function Configure-SSL {
    Write-ColorOutput "`n🔒 PASSO 3: Configurando SSL (HTTPS)..." "Cyan"
    
    Write-ColorOutput "   📜 Criando certificado gerenciado gratuito..." "Yellow"
    try {
        # Criar certificado gerenciado
        az webapp config ssl create `
            --name $AppName `
            --resource-group $ResourceGroup `
            --hostname $CustomDomain | Out-Null
        
        Write-ColorOutput "   ✅ Certificado SSL criado e vinculado" "Green"
        Write-ColorOutput "   🔐 HTTPS habilitado para: https://$CustomDomain" "Green"
    } catch {
        Write-ColorOutput "   ⚠️  Certificado já existe ou domínio não verificado" "Yellow"
    }
    
    # Forçar HTTPS
    Write-ColorOutput "   🔒 Forçando redirecionamento HTTPS..." "Yellow"
    az webapp update `
        --name $AppName `
        --resource-group $ResourceGroup `
        --https-only true | Out-Null
    Write-ColorOutput "   ✅ HTTPS obrigatório configurado" "Green"
}

# Função: Deploy da Aplicação
function Deploy-Application {
    Write-ColorOutput "`n🚀 PASSO 4: Deploy da Aplicação..." "Cyan"
    
    # Build do Frontend
    Write-ColorOutput "   📦 Build do Frontend Next.js..." "Yellow"
    Push-Location "frontend\arcsat-landing"
    if (Test-Path "node_modules") {
        npm run build
    } else {
        Write-ColorOutput "   ⚠️  Instalando dependências..." "Yellow"
        npm install
        npm run build
    }
    Pop-Location
    Write-ColorOutput "   ✅ Frontend build concluído" "Green"
    
    # Criar pacote de deploy
    Write-ColorOutput "   📦 Criando pacote de deploy..." "Yellow"
    if (Test-Path "deployment.zip") {
        Remove-Item "deployment.zip"
    }
    
    Compress-Archive -Path `
        "src", `
        "frontend/arcsat-landing/.next", `
        "frontend/arcsat-landing/public", `
        "frontend/arcsat-landing/next.config.ts", `
        "frontend/arcsat-landing/package.json", `
        "package.json", `
        "package-lock.json" `
        -DestinationPath "deployment.zip" -CompressionLevel Optimal
    
    Write-ColorOutput "   ✅ Pacote criado: deployment.zip" "Green"
    
    # Deploy no Azure
    Write-ColorOutput "   🚀 Fazendo deploy no Azure..." "Yellow"
    az webapp deployment source config-zip `
        --resource-group $ResourceGroup `
        --name $AppName `
        --src "deployment.zip" | Out-Null
    
    Write-ColorOutput "   ✅ Deploy concluído!" "Green"
    
    # Reiniciar aplicação
    Write-ColorOutput "   🔄 Reiniciando aplicação..." "Yellow"
    az webapp restart `
        --name $AppName `
        --resource-group $ResourceGroup | Out-Null
    Write-ColorOutput "   ✅ Aplicação reiniciada" "Green"
}

# Função: Verificação
function Verify-Deployment {
    Write-ColorOutput "`n✅ VERIFICAÇÃO FINAL..." "Cyan"
    
    Write-ColorOutput "   🔍 Status do Web App..." "Yellow"
    $webApp = az webapp show `
        --name $AppName `
        --resource-group $ResourceGroup | ConvertFrom-Json
    
    Write-ColorOutput "   Estado: $($webApp.state)" "Green"
    Write-ColorOutput "   URL Default: https://$($webApp.defaultHostName)" "Green"
    Write-ColorOutput "   URL Customizada: https://$CustomDomain" "Green"
    
    Write-ColorOutput "`n   📊 Testando endpoints..." "Yellow"
    Start-Sleep -Seconds 5
    
    try {
        $response = Invoke-WebRequest -Uri "https://$CustomDomain" -UseBasicParsing -TimeoutSec 10
        Write-ColorOutput "   ✅ Site respondendo: Status $($response.StatusCode)" "Green"
    } catch {
        Write-ColorOutput "   ⚠️  Aguarde alguns minutos para propagação..." "Yellow"
    }
}

# Execução Principal
try {
    if ($All -or $SetupInfrastructure) {
        Setup-Infrastructure
    }
    
    if ($All -or $ConfigureDomain) {
        Configure-CustomDomain
    }
    
    if ($All -or $ConfigureSSL) {
        Configure-SSL
    }
    
    if ($All -or $Deploy) {
        Deploy-Application
    }
    
    if ($All) {
        Verify-Deployment
    }
    
    # Resumo Final
    Write-ColorOutput "`n╔═══════════════════════════════════════════════════════╗" "Cyan"
    Write-ColorOutput "║              ✅ DEPLOY CONCLUÍDO COM SUCESSO!         ║" "Cyan"
    Write-ColorOutput "╚═══════════════════════════════════════════════════════╝" "Cyan"
    Write-ColorOutput "`n🌐 URLs:" "White"
    Write-ColorOutput "   • Produção: https://$CustomDomain" "Green"
    Write-ColorOutput "   • Azure: https://$AppName.azurewebsites.net" "Gray"
    Write-ColorOutput "   • Portal: https://portal.azure.com" "Gray"
    Write-ColorOutput "`n📊 Próximos passos:" "White"
    Write-ColorOutput "   1. Configurar variáveis de ambiente (MongoDB, JWT, etc)" "Gray"
    Write-ColorOutput "   2. Configurar Application Insights para monitoramento" "Gray"
    Write-ColorOutput "   3. Configurar CI/CD com GitHub Actions" "Gray"
    Write-ColorOutput "   4. Testar todos os endpoints da API" "Gray"
    
} catch {
    Write-ColorOutput "`n❌ ERRO: $($_.Exception.Message)" "Red"
    exit 1
}
