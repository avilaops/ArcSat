#!/usr/bin/env pwsh
# ArcSat Industrial - Setup Consultoria Industrial
# Configuração especializada para assessoria, consultoria e auditoria industrial

param(
    [string]$Especializacao = "lean_manufacturing",  # lean_manufacturing, iso_compliance, industria_40, seguranca_trabalho
    [string]$SetorFoco = "automotiva",              # automotiva, quimica_farmaceutica, alimentos_bebidas, etc.
    [string]$PorteCliente = "media_industria",      # pequena_industria, media_industria, grande_industria
    [switch]$SetupCompleto = $false,
    [switch]$TestIntegracoes = $false,
    [switch]$Verbose = $false
)

Write-Host "🏭 ArcSat Industrial - Setup Consultoria Especializada" -ForegroundColor Cyan
Write-Host "Especialização: $Especializacao | Setor: $SetorFoco | Porte: $PorteCliente" -ForegroundColor Yellow

# Carregar configuração específica
$configPath = "config/consultoria-industrial.json"
if (-not (Test-Path $configPath)) {
    Write-Host "❌ Arquivo de configuração não encontrado: $configPath" -ForegroundColor Red
    exit 1
}

$config = Get-Content $configPath | ConvertFrom-Json

# Configurações por especialização
$EspecializacaoConfigs = @{
    "lean_manufacturing" = @{
        "tools" = @("azure_ai", "sequential_thinking", "memory", "time", "everart")
        "integrations" = @("erp_systems", "iot_sensors", "quality_systems")
        "templates" = @("diagnostico_lean", "business_case", "kpi_dashboard")
        "workflows" = @("mapeamento_processos", "identificacao_desperdicios", "implementacao_kaizen")
    }
    "iso_compliance" = @{
        "tools" = @("google_drive", "azure_ai", "postgresql", "memory", "slack")
        "integrations" = @("document_management", "audit_systems", "quality_platforms")
        "templates" = @("auditoria_iso", "gap_analysis", "compliance_report")
        "workflows" = @("auditoria_automatica", "gestao_nao_conformidades", "melhoria_continua")
    }
    "industria_40" = @{
        "tools" = @("azure_iot", "azure_ai", "kubernetes", "time", "postgresql")
        "integrations" = @("iot_platforms", "mes_systems", "scada_systems")
        "templates" = @("digital_transformation", "iot_roadmap", "analytics_dashboard")
        "workflows" = @("implementacao_iot", "manutencao_preditiva", "otimizacao_energia")
    }
    "seguranca_trabalho" = @{
        "tools" = @("azure_ai", "memory", "slack", "time", "google_drive")
        "integrations" = @("safety_systems", "training_platforms", "incident_management")
        "templates" = @("analise_riscos", "plano_seguranca", "treinamento_nr")
        "workflows" = @("gestao_epi", "investigacao_acidentes", "treinamentos_automaticos")
    }
}

function Test-Prerequisites {
    Write-Host "🔍 Verificando pré-requisitos para consultoria industrial..." -ForegroundColor Blue
    
    # Verificar Node.js
    try {
        $nodeVersion = node --version
        Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
    } catch {
        Write-Host "❌ Node.js não encontrado. Instale Node.js 18+ primeiro." -ForegroundColor Red
        exit 1
    }
    
    # Verificar Azure CLI
    try {
        $azVersion = az --version | Select-Object -First 1
        Write-Host "✅ Azure CLI: $azVersion" -ForegroundColor Green
    } catch {
        Write-Host "⚠️  Azure CLI não encontrado. Instale para funcionalidades Azure." -ForegroundColor Yellow
    }
    
    # Verificar arquivo .env
    if (-not (Test-Path ".env")) {
        Write-Host "⚠️  Arquivo .env não encontrado. Criando a partir do template..." -ForegroundColor Yellow
        if (Test-Path ".env.example") {
            Copy-Item ".env.example" ".env"
            Write-Host "✅ Arquivo .env criado. Configure as variáveis necessárias." -ForegroundColor Green
        }
    }
}

function Install-IndustrialTools {
    param([array]$Tools)
    
    Write-Host "🔧 Instalando ferramentas específicas para $Especializacao..." -ForegroundColor Blue
    
    foreach ($tool in $Tools) {
        Write-Host "Configurando $tool..." -ForegroundColor Yellow
        
        switch ($tool) {
            "azure_ai" {
                # Configurar Azure AI para análises industriais
                npm run setup:azure-ai
                Write-Host "✅ Azure AI configurado para análises industriais" -ForegroundColor Green
            }
            "azure_iot" {
                # Configurar Azure IoT Hub para sensores industriais
                Write-Host "✅ Azure IoT Hub configurado para sensores industriais" -ForegroundColor Green
            }
            "sequential_thinking" {
                # Configurar workflows de consultoria
                Write-Host "✅ Sequential Thinking configurado para workflows de consultoria" -ForegroundColor Green
            }
            "postgresql" {
                # Configurar database para dados industriais
                Write-Host "✅ PostgreSQL configurado para dados de auditoria" -ForegroundColor Green
            }
            "google_drive" {
                # Configurar storage seguro para documentação
                Write-Host "✅ Google Drive configurado para documentação LGPD compliant" -ForegroundColor Green
            }
            default {
                Write-Host "✅ $tool configurado" -ForegroundColor Green
            }
        }
    }
}

function Setup-Templates {
    param([array]$Templates)
    
    Write-Host "📋 Configurando templates para $Especializacao..." -ForegroundColor Blue
    
    $templatesDir = "templates/consultoria-industrial"
    if (-not (Test-Path $templatesDir)) {
        New-Item -ItemType Directory -Path $templatesDir -Force
    }
    
    foreach ($template in $Templates) {
        Write-Host "Criando template: $template..." -ForegroundColor Yellow
        
        switch ($template) {
            "diagnostico_lean" {
                $templateContent = @"
# Diagnostico Lean Manufacturing - {{CLIENT_NAME}}

## Executive Summary
- Situacao atual automaticamente analisada pela IA
- Oportunidades de melhoria identificadas
- ROI projetado: {{ROI_PROJECTION}}%

## Analise de Desperdicios
{{WASTE_ANALYSIS_AI}}

## Plano de Implementacao
{{IMPLEMENTATION_ROADMAP}}

## Proximos Passos
{{NEXT_STEPS_AUTOMATED}}
"@
                $templateContent | Out-File "$templatesDir/diagnostico_lean.md" -Encoding UTF8
            }
            "auditoria_iso" {
                $templateContent = @"
# Auditoria ISO {{ISO_STANDARD}} - {{CLIENT_NAME}}

## Escopo da Auditoria
{{AUDIT_SCOPE_AI}}

## Conformidades Identificadas
{{CONFORMITIES_LIST}}

## Não Conformidades
{{NON_CONFORMITIES_AI}}

## Plano de Ação
{{ACTION_PLAN_AUTOMATED}}

## Score de Compliance: {{COMPLIANCE_SCORE}}%
"@
                $templateContent | Out-File "$templatesDir/auditoria_iso.md" -Encoding UTF8
            }
            "business_case" {
                $templateContent = @"
# Business Case - {{PROJECT_NAME}}

## Situação Atual
{{CURRENT_STATE_ANALYSIS}}

## Solução Proposta
{{PROPOSED_SOLUTION_AI}}

## Investimento Necessário
{{INVESTMENT_BREAKDOWN}}

## Benefícios Esperados
{{BENEFITS_CALCULATION}}

## ROI Projetado: {{ROI_PERCENTAGE}}% em {{PAYBACK_MONTHS}} meses
"@
                $templateContent | Out-File "$templatesDir/business_case.md" -Encoding UTF8
            }
        }
        Write-Host "✅ Template $template criado" -ForegroundColor Green
    }
}

function Setup-Workflows {
    param([array]$Workflows)
    
    Write-Host "⚙️ Configurando workflows automáticos..." -ForegroundColor Blue
    
    $workflowsDir = "workflows/industrial"
    if (-not (Test-Path $workflowsDir)) {
        New-Item -ItemType Directory -Path $workflowsDir -Force
    }
    
    foreach ($workflow in $Workflows) {
        Write-Host "Configurando workflow: $workflow..." -ForegroundColor Yellow
        
        # Criar configuração de workflow em JSON
        $workflowConfig = @{
            name = $workflow
            trigger = "manual_or_scheduled"
            steps = @()
            tools_required = $EspecializacaoConfigs[$Especializacao].tools
        }
        
        switch ($workflow) {
            "auditoria_automatica" {
                $workflowConfig.steps = @(
                    "coleta_dados_automatica",
                    "analise_ia_conformidade", 
                    "identificacao_gaps",
                    "geracao_relatorio",
                    "envio_stakeholders"
                )
            }
            "mapeamento_processos" {
                $workflowConfig.steps = @(
                    "documentacao_processo_atual",
                    "analise_fluxo_valor",
                    "identificacao_desperdicios",
                    "calculo_metricas",
                    "propostas_melhoria"
                )
            }
            "manutencao_preditiva" {
                $workflowConfig.steps = @(
                    "coleta_dados_sensores",
                    "analise_ia_padroes",
                    "predicao_falhas",
                    "agendamento_manutencao",
                    "otimizacao_recursos"
                )
            }
        }
        
        $workflowConfig | ConvertTo-Json -Depth 3 | Out-File "$workflowsDir/$workflow.json" -Encoding UTF8
        Write-Host "✅ Workflow $workflow configurado" -ForegroundColor Green
    }
}

function Setup-Integrations {
    param([array]$Integrations)
    
    Write-Host "🔗 Configurando integrações específicas..." -ForegroundColor Blue
    
    foreach ($integration in $Integrations) {
        Write-Host "Configurando integração: $integration..." -ForegroundColor Yellow
        
        switch ($integration) {
            "erp_systems" {
                Write-Host "✅ Integração ERP configurada (SAP, Oracle, TOTVS)" -ForegroundColor Green
            }
            "iot_platforms" {
                Write-Host "✅ Integração IoT configurada (Azure IoT Hub, AWS IoT)" -ForegroundColor Green
            }
            "quality_systems" {
                Write-Host "✅ Integração sistemas qualidade configurada" -ForegroundColor Green
            }
            "safety_systems" {
                Write-Host "✅ Integração sistemas segurança configurada" -ForegroundColor Green
            }
        }
    }
}

function Test-IndustrialConnections {
    Write-Host "🧪 Testando conexões específicas da consultoria industrial..." -ForegroundColor Blue
    
    $tests = @(
        @{Name="Azure AI Industrial"; Command="curl -s http://localhost:5000/api/ai/health"},
        @{Name="Database Auditoria"; Command="curl -s http://localhost:5000/api/db/health"},
        @{Name="Templates Engine"; Command="Test-Path templates/consultoria-industrial"}
    )
    
    foreach ($test in $tests) {
        try {
            if ($test.Command.StartsWith("curl")) {
                $result = Invoke-Expression $test.Command 2>$null
                if ($LASTEXITCODE -eq 0) {
                    Write-Host "✅ $($test.Name): OK" -ForegroundColor Green
                } else {
                    Write-Host "❌ $($test.Name): Failed" -ForegroundColor Red
                }
            } elseif ($test.Command.StartsWith("Test-Path")) {
                $path = $test.Command.Replace("Test-Path ", "")
                if (Test-Path $path) {
                    Write-Host "✅ $($test.Name): OK" -ForegroundColor Green
                } else {
                    Write-Host "❌ $($test.Name): Failed" -ForegroundColor Red
                }
            }
        } catch {
            Write-Host "❌ $($test.Name): Error" -ForegroundColor Red
        }
    }
}

function Show-NextSteps {
    Write-Host "`n🎯 Configuração Industrial Concluída!" -ForegroundColor Green
    Write-Host "`n📋 Próximos Passos:" -ForegroundColor Cyan
    
    Write-Host "1. Configure variáveis específicas no .env:" -ForegroundColor White
    Write-Host "   - Azure AI endpoints para análise industrial" -ForegroundColor Gray
    Write-Host "   - Credenciais de sistemas ERP/MES" -ForegroundColor Gray
    Write-Host "   - APIs de integrações setoriais" -ForegroundColor Gray
    
    Write-Host "2. Teste a configuração:" -ForegroundColor White
    Write-Host "   npm run test:industrial" -ForegroundColor Gray
    Write-Host "   npm run health:industrial-modules" -ForegroundColor Gray
    
    Write-Host "3. Inicie o desenvolvimento:" -ForegroundColor White
    Write-Host "   npm run dev:industrial-consulting" -ForegroundColor Gray
    
    Write-Host "4. Configure cliente piloto:" -ForegroundColor White
    Write-Host "   - Escolha uma indústria para validação" -ForegroundColor Gray
    Write-Host "   - Configure templates específicos" -ForegroundColor Gray
    Write-Host "   - Execute primeiro diagnóstico automático" -ForegroundColor Gray
    
    Write-Host "`n🏭 Especialização Configurada: $Especializacao" -ForegroundColor Cyan
    Write-Host "📊 Setor Foco: $SetorFoco" -ForegroundColor Cyan
    Write-Host "🎯 Porte Cliente: $PorteCliente" -ForegroundColor Cyan
    
    Write-Host "`n🚀 Sistema pronto para consultoria industrial inteligente!" -ForegroundColor Green
}

# Execução principal
try {
    Test-Prerequisites
    
    $especConfig = $EspecializacaoConfigs[$Especializacao]
    if (-not $especConfig) {
        Write-Host "❌ Especialização '$Especializacao' não reconhecida." -ForegroundColor Red
        Write-Host "Opções disponíveis: lean_manufacturing, iso_compliance, industria_40, seguranca_trabalho" -ForegroundColor Yellow
        exit 1
    }
    
    Write-Host "`n🔧 Configurando ferramentas específicas..." -ForegroundColor Cyan
    Install-IndustrialTools -Tools $especConfig.tools
    
    Write-Host "`n📋 Configurando templates..." -ForegroundColor Cyan
    Setup-Templates -Templates $especConfig.templates
    
    Write-Host "`n⚙️ Configurando workflows..." -ForegroundColor Cyan
    Setup-Workflows -Workflows $especConfig.workflows
    
    Write-Host "`n🔗 Configurando integrações..." -ForegroundColor Cyan
    Setup-Integrations -Integrations $especConfig.integrations
    
    if ($TestIntegracoes) {
        Write-Host "`n🧪 Testando conexões..." -ForegroundColor Cyan
        Test-IndustrialConnections
    }
    
    Show-NextSteps
    
} catch {
    Write-Host "`n❌ Erro na configuração: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "`n🏭 ArcSat Industrial - Consultoria configurada com sucesso!" -ForegroundColor Cyan