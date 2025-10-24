# GitHub Workflows Documentation

This document explains all GitHub Actions workflows configured for the ArcSat project.

## Workflows Overview

### 1. Main CI/CD (`main.yml`)

**Triggers:**
- Push to `main` branch
- Pull requests to `main` branch

**Jobs:**

#### Build Frontend
- Checks out code with submodules
- Sets up Node.js 20.x with npm caching
- Installs dependencies using `npm ci`
- Runs linting (if available, continues on error)
- Builds the Next.js application
- Uploads build artifact for deployment

#### Deploy Frontend (only on push to main)
- Downloads the build artifact
- Checks if Azure Static Web Apps token is configured
- Deploys to Azure Static Web Apps (if token is available)
- Shows warning if deployment is skipped due to missing secret

#### Build Backend
- Checks out code
- Sets up Node.js 20.x with npm caching
- Installs backend dependencies
- Runs TypeScript type checking
- Runs linting (if available)
- Runs tests (if available)
- Builds the backend application

#### Deploy Documentation (only on push to main)
- Checks out code
- Deploys documentation to GitHub Pages

### 2. CodeQL Security Analysis (`codeql.yml`)

**Triggers:**
- Push to `main` branch
- Pull requests to `main` branch
- Weekly schedule (Mondays at 00:00 UTC)

**Purpose:**
- Performs automated security analysis on JavaScript and TypeScript code
- Identifies potential security vulnerabilities
- Runs extended security and quality queries

### 3. Pull Request Validation (`pr-validation.yml`)

**Triggers:**
- Pull requests to `main` branch

**Jobs:**

#### Validate PR Changes
- Checks PR title format (conventional commits)
- Scans for large files (>5MB)
- Checks for potential secrets in code changes

#### Quick Tests
- Runs type checking
- Runs linting
- Runs unit tests (if available)

## Required Secrets

### Azure Deployment

For Azure Static Web Apps deployment to work, you need to configure:

**Secret Name:** `AZURE_STATIC_WEB_APPS_API_TOKEN`

**How to get it:**
1. Create an Azure Static Web App in Azure Portal
2. Go to your Static Web App resource
3. Click on "Manage deployment token" in the Overview section
4. Copy the deployment token
5. Add it to GitHub repository secrets:
   - Go to Settings > Secrets and variables > Actions
   - Click "New repository secret"
   - Name: `AZURE_STATIC_WEB_APPS_API_TOKEN`
   - Value: Paste the deployment token
   - Click "Add secret"

**Documentation:** https://docs.microsoft.com/azure/static-web-apps/get-started-portal

### GitHub Token

**Secret Name:** `GITHUB_TOKEN`
- This is automatically provided by GitHub Actions
- No configuration needed
- Used for deploying documentation to GitHub Pages

## Dependabot Configuration

Automated dependency updates are configured in `.github/dependabot.yml`:

- **Backend dependencies:** Weekly updates on Mondays
- **Frontend dependencies:** Weekly updates on Mondays
- **GitHub Actions:** Weekly updates on Mondays
- Pull requests are auto-labeled and assigned to reviewers

## Workflow Status

### Current State

✅ **Build Frontend** - Working correctly
✅ **Build Backend** - Working correctly
⚠️ **Deploy Frontend** - Requires Azure token to be configured
✅ **Deploy Documentation** - Working (requires GitHub Pages enabled)
✅ **CodeQL Analysis** - Working correctly
✅ **PR Validation** - Working correctly

### Enabling Full Deployment

To enable Azure deployment:

1. **Create Azure Static Web App:**
   ```bash
   # Using Azure CLI
   az staticwebapp create \
     --name arcsat-frontend \
     --resource-group YourResourceGroup \
     --source https://github.com/avilaops/ArcSat \
     --location "East US 2" \
     --branch main \
     --app-location "./frontend/arcsat-landing/out" \
     --output-location "" \
     --login-with-github
   ```

2. **Get Deployment Token:**
   ```bash
   az staticwebapp secrets list \
     --name arcsat-frontend \
     --resource-group YourResourceGroup \
     --query "properties.apiKey" -o tsv
   ```

3. **Add to GitHub Secrets:**
   - Repository Settings > Secrets and variables > Actions
   - New repository secret: `AZURE_STATIC_WEB_APPS_API_TOKEN`
   - Paste the deployment token

4. **Enable GitHub Pages (for documentation):**
   - Repository Settings > Pages
   - Source: Deploy from a branch
   - Branch: `gh-pages` / `root`
   - Save

## Troubleshooting

### Build Failures

**Frontend build fails:**
- Check Node.js version compatibility
- Verify all dependencies are in `package.json`
- Check for TypeScript errors
- Review build logs in GitHub Actions

**Backend build fails:**
- Run `npm run typecheck` locally
- Fix TypeScript errors
- Verify all dependencies are installed
- Check environment variables

### Deployment Issues

**Azure deployment skipped:**
- Verify `AZURE_STATIC_WEB_APPS_API_TOKEN` is configured
- Check secret name matches exactly
- Ensure secret is not expired

**Documentation deployment fails:**
- Enable GitHub Pages in repository settings
- Verify the workflow has `contents: write` permission
- Check if `docs` directory exists and has content

### CodeQL Warnings

**Security alerts:**
- Review CodeQL findings in Security tab
- Fix identified vulnerabilities
- Re-run the analysis

## Best Practices

1. **Always run locally first:**
   ```bash
   # Frontend
   cd frontend/arcsat-landing
   npm install
   npm run build
   
   # Backend
   npm install
   npm run typecheck
   npm run build
   ```

2. **Test before pushing:**
   - Run linting: `npm run lint`
   - Run tests: `npm test`
   - Check types: `npm run typecheck`

3. **Keep dependencies updated:**
   - Review Dependabot PRs weekly
   - Test updates in development environment
   - Merge security updates promptly

4. **Monitor workflow runs:**
   - Check Actions tab regularly
   - Address failures promptly
   - Review security alerts

## Contact

For issues with workflows or deployment:
- **Email:** nicolas@avila.inc
- **GitHub Issues:** https://github.com/avilaops/ArcSat/issues
