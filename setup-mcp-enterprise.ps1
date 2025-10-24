#!/usr/bin/env pwsh
# ArcSat CRM - Enterprise MCP Setup Script
# Instala e configura todos os MCP servers para atender múltiplas empresas

param(
    [string]$Tier = "enterprise",  # startup, growth, enterprise
    [switch]$InstallAll = $false,
    [switch]$TestConnections = $false,
    [switch]$Verbose = $false
)

Write-Host "🚀 ArcSat CRM - Enterprise MCP Setup" -ForegroundColor Cyan
Write-Host "Configuration Tier: $Tier" -ForegroundColor Yellow

# Define server configurations by tier
$ServerConfigs = @{
    "startup" = @(
        "@modelcontextprotocol/server-azure",
        "@modelcontextprotocol/server-github", 
        "@modelcontextprotocol/server-filesystem",
        "@modelcontextprotocol/server-memory",
        "@modelcontextprotocol/server-slack",
        "@modelcontextprotocol/server-time"
    )
    "growth" = @(
        "@modelcontextprotocol/server-azure",
        "@modelcontextprotocol/server-github",
        "@modelcontextprotocol/server-filesystem", 
        "@modelcontextprotocol/server-memory",
        "@modelcontextprotocol/server-slack",
        "@modelcontextprotocol/server-brave-search",
        "@modelcontextprotocol/server-postgres",
        "@modelcontextprotocol/server-sequential-thinking",
        "@modelcontextprotocol/server-fetch",
        "@modelcontextprotocol/server-time"
    )
    "enterprise" = @(
        "@modelcontextprotocol/server-azure",
        "@modelcontextprotocol/server-github",
        "@modelcontextprotocol/server-filesystem",
        "@modelcontextprotocol/server-memory", 
        "@modelcontextprotocol/server-slack",
        "@modelcontextprotocol/server-brave-search",
        "@modelcontextprotocol/server-postgres",
        "@modelcontextprotocol/server-sqlite",
        "@modelcontextprotocol/server-sequential-thinking",
        "@modelcontextprotocol/server-everart",
        "@modelcontextprotocol/server-puppeteer",
        "@modelcontextprotocol/server-fetch",
        "@modelcontextprotocol/server-gdrive",
        "@modelcontextprotocol/server-time",
        "@modelcontextprotocol/server-kubernetes",
        "@modelcontextprotocol/server-docker"
    )
}

function Test-Prerequisites {
    Write-Host "🔍 Checking prerequisites..." -ForegroundColor Blue
    
    # Check Node.js
    try {
        $nodeVersion = node --version
        Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
    } catch {
        Write-Host "❌ Node.js not found. Please install Node.js 18+ first." -ForegroundColor Red
        exit 1
    }
    
    # Check npm
    try {
        $npmVersion = npm --version
        Write-Host "✅ npm: $npmVersion" -ForegroundColor Green
    } catch {
        Write-Host "❌ npm not found. Please install npm first." -ForegroundColor Red
        exit 1
    }
    
    # Check if .env exists
    if (-not (Test-Path ".env")) {
        Write-Host "⚠️  .env file not found. Please copy .env.example to .env and configure it." -ForegroundColor Yellow
        if (Test-Path ".env.example") {
            Copy-Item ".env.example" ".env"
            Write-Host "✅ Created .env from .env.example template" -ForegroundColor Green
        }
    }
}

function Install-MCPServers {
    param([array]$Servers)
    
    Write-Host "📦 Installing MCP servers for tier: $Tier" -ForegroundColor Blue
    
    foreach ($server in $Servers) {
        Write-Host "Installing $server..." -ForegroundColor Yellow
        
        try {
            if ($Verbose) {
                npm install -g $server --verbose
            } else {
                npm install -g $server --silent
            }
            Write-Host "✅ $server installed successfully" -ForegroundColor Green
        } catch {
            Write-Host "❌ Failed to install $server" -ForegroundColor Red
            Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
}

function Test-MCPConnections {
    Write-Host "🔗 Testing MCP server connections..." -ForegroundColor Blue
    
    $testServers = @(
        @{Name="Azure"; Command="npx @modelcontextprotocol/server-azure --help"},
        @{Name="GitHub"; Command="npx @modelcontextprotocol/server-github --help"},
        @{Name="Memory"; Command="npx @modelcontextprotocol/server-memory --help"}
    )
    
    foreach ($test in $testServers) {
        try {
            $result = Invoke-Expression $test.Command 2>$null
            if ($LASTEXITCODE -eq 0) {
                Write-Host "✅ $($test.Name) server: OK" -ForegroundColor Green
            } else {
                Write-Host "❌ $($test.Name) server: Failed" -ForegroundColor Red
            }
        } catch {
            Write-Host "❌ $($test.Name) server: Error" -ForegroundColor Red
        }
    }
}

function Show-Configuration {
    Write-Host "📋 Current MCP Configuration:" -ForegroundColor Cyan
    Write-Host "Tier: $Tier" -ForegroundColor White
    Write-Host "Servers to install: $($ServerConfigs[$Tier].Count)" -ForegroundColor White
    
    Write-Host "`n🎯 Business Capabilities Enabled:" -ForegroundColor Cyan
    
    switch ($Tier) {
        "startup" {
            Write-Host "- Basic CRM functionality" -ForegroundColor White
            Write-Host "- Team communication (Slack)" -ForegroundColor White
            Write-Host "- Cloud storage (Azure)" -ForegroundColor White
            Write-Host "- Simple automation" -ForegroundColor White
        }
        "growth" {
            Write-Host "- Advanced CRM with BI" -ForegroundColor White
            Write-Host "- Market intelligence (Brave Search)" -ForegroundColor White
            Write-Host "- Database integration (PostgreSQL)" -ForegroundColor White
            Write-Host "- Process automation" -ForegroundColor White
            Write-Host "- API integrations" -ForegroundColor White
        }
        "enterprise" {
            Write-Host "- Full CRM suite with all features" -ForegroundColor White
            Write-Host "- Advanced AI automation" -ForegroundColor White
            Write-Host "- Web scraping & data collection" -ForegroundColor White
            Write-Host "- Container orchestration" -ForegroundColor White
            Write-Host "- Enterprise security & compliance" -ForegroundColor White
            Write-Host "- Content generation" -ForegroundColor White
            Write-Host "- Document management" -ForegroundColor White
        }
    }
}

function Show-NextSteps {
    Write-Host "`n🎯 Next Steps:" -ForegroundColor Cyan
    Write-Host "1. Configure your .env file with API keys" -ForegroundColor White
    Write-Host "2. Restart VS Code to load MCP servers" -ForegroundColor White
    Write-Host "3. Run setup tasks: Ctrl+Shift+P > Tasks: Run Task" -ForegroundColor White
    Write-Host "4. Execute 'Setup Azure AI' task" -ForegroundColor White
    Write-Host "5. Test connections with 'Azure Health Check'" -ForegroundColor White
    
    Write-Host "`n🔧 Available Commands:" -ForegroundColor Cyan
    Write-Host "npm run dev:ai          # Start backend with AI" -ForegroundColor White
    Write-Host "npm run setup:azure-ai  # Configure Azure AI" -ForegroundColor White
    Write-Host "npm run test:ai         # Test AI integrations" -ForegroundColor White
    
    Write-Host "`n📚 Documentation:" -ForegroundColor Cyan
    Write-Host ".vscode/SYNC.md         # Sync instructions" -ForegroundColor White
    Write-Host ".vscode/mcp-enterprise-config.json # MCP configuration" -ForegroundColor White
    Write-Host "docs/                   # Full documentation" -ForegroundColor White
}

# Main execution
try {
    Test-Prerequisites
    Show-Configuration
    
    if ($InstallAll -or (Read-Host "`nProceed with installation? (y/N)") -eq "y") {
        Install-MCPServers -Servers $ServerConfigs[$Tier]
        
        if ($TestConnections) {
            Test-MCPConnections
        }
        
        Write-Host "`n🎉 MCP Enterprise Setup completed successfully!" -ForegroundColor Green
        Show-NextSteps
    } else {
        Write-Host "Setup cancelled by user." -ForegroundColor Yellow
    }
} catch {
    Write-Host "`n❌ Setup failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "`n🚀 ArcSat CRM ready to serve multiple enterprises!" -ForegroundColor Cyan