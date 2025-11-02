# 🚀 Deployment Overview - ArcSat

## Quick Links

- 🎯 **Quick Start**: [QUICKSTART-DEPLOYMENT.md](./QUICKSTART-DEPLOYMENT.md) - 5-step deployment guide
- 📘 **Complete Guide**: [AZURE-DEPLOYMENT-GUIDE.md](./AZURE-DEPLOYMENT-GUIDE.md) - Detailed instructions with troubleshooting
- 🌐 **DNS Setup**: [PORKBUN-DNS-SETUP.md](./PORKBUN-DNS-SETUP.md) - Porkbun DNS configuration
- 📊 **Migration Info**: [MIGRATION-SUMMARY.md](./MIGRATION-SUMMARY.md) - Details about Cloudflare → Azure migration

## Current Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     ArcSat Deployment                        │
└─────────────────────────────────────────────────────────────┘

  Developer                GitHub                 Azure
     │                       │                      │
     │  git push            │                      │
     ├──────────────────────►                      │
     │                       │                      │
     │                       │  GitHub Actions      │
     │                       │  - Build Next.js     │
     │                       │  - Run Tests         │
     │                       │  - Deploy            │
     │                       ├─────────────────────►│
     │                       │                      │
     │                       │                 Azure Static
     │                       │                 Web Apps
     │                       │                      │
                                                    │
                                              Porkbun DNS
                                                    │
                                                    ▼
                                            arcsat.com.br
```

## Technology Stack

### Hosting
- **Frontend**: Azure Static Web Apps
- **DNS**: Porkbun
- **SSL/TLS**: Azure (Let's Encrypt - Free & Automatic)
- **CI/CD**: GitHub Actions

### Frontend
- **Framework**: Next.js 16.0.0
- **React**: 19.2.0
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript 5.9.3

### Backend (Separate - Not covered in this deployment)
- **Runtime**: Node.js 20 LTS
- **Framework**: Express
- **Database**: MongoDB Atlas

## Deployment Process

### Automatic Deployment (Recommended)

Every push to the `main` branch triggers automatic deployment:

1. **Trigger**: Push code to `main` branch
2. **Build**: GitHub Actions runs `npm ci && npm run build`
3. **Test**: (Optional) Run test suite
4. **Deploy**: Upload to Azure Static Web Apps
5. **Live**: Changes visible at arcsat.com.br in ~2 minutes

### Manual Deployment

If needed, trigger deployment manually:

```bash
# Via GitHub CLI
gh workflow run "ArcSat CI/CD" --ref main

# Or empty commit to trigger
git commit --allow-empty -m "chore: trigger deployment"
git push origin main
```

## Configuration Files

### `.github/workflows/main.yml`
GitHub Actions workflow - Handles build and deployment

### `frontend/arcsat-landing/public/staticwebapp.config.json`
Azure Static Web Apps configuration - Handles routing and headers

### `package.json`
Dependencies and scripts

## Environment Variables

### Required for GitHub Actions
- `AZURE_STATIC_WEB_APPS_API_TOKEN` - Deployment token from Azure

### Local Development Only
See `.env.example` for backend variables (not needed for frontend deployment)

## DNS Configuration

Domain: **arcsat.com.br**  
Registrar: **Porkbun**  
Management: **Manual via Porkbun Dashboard**

### Required DNS Records

| Type | Host | Value | Purpose |
|------|------|-------|---------|
| ALIAS/A | @ | Azure Static Web App | Main domain |
| CNAME | www | Azure Static Web App | WWW subdomain |

See [PORKBUN-DNS-SETUP.md](./PORKBUN-DNS-SETUP.md) for detailed instructions.

## Monitoring

### GitHub Actions
View deployment status: https://github.com/avilaops/ArcSat/actions

### Azure Portal
View app status: https://portal.azure.com
- Navigate to: Avila > arcsat-frontend

### DNS Status
Check DNS propagation: https://dnschecker.org/#A/arcsat.com.br

## Troubleshooting

### Build Fails
1. Check GitHub Actions logs
2. Test build locally: `cd frontend/arcsat-landing && npm run build`
3. Check for TypeScript errors
4. Verify dependencies are up to date

### Deployment Fails
1. Verify `AZURE_STATIC_WEB_APPS_API_TOKEN` secret is set
2. Check Azure portal for any issues
3. Verify app is running: `az staticwebapp show --name arcsat-frontend --resource-group Avila`

### DNS Issues
1. Check DNS propagation: https://dnschecker.org
2. Verify records in Porkbun dashboard
3. Wait 15-30 minutes for propagation
4. Clear local DNS cache

### SSL Certificate Issues
1. Wait up to 24 hours for automatic certificate issuance
2. Verify domain is validated in Azure portal
3. Check DNS records are correct

## Common Commands

```bash
# Check deployment status
az staticwebapp show \
  --name arcsat-frontend \
  --resource-group Avila

# List custom domains
az staticwebapp hostname list \
  --name arcsat-frontend \
  --resource-group Avila

# View recent deployments
gh run list --workflow="ArcSat CI/CD"

# Build frontend locally
cd frontend/arcsat-landing
npm ci
npm run build

# Start local dev server
npm run dev
```

## Support

### Documentation
- Quick Start: [QUICKSTART-DEPLOYMENT.md](./QUICKSTART-DEPLOYMENT.md)
- Complete Guide: [AZURE-DEPLOYMENT-GUIDE.md](./AZURE-DEPLOYMENT-GUIDE.md)
- DNS Setup: [PORKBUN-DNS-SETUP.md](./PORKBUN-DNS-SETUP.md)
- Migration Info: [MIGRATION-SUMMARY.md](./MIGRATION-SUMMARY.md)

### External Resources
- [Azure Static Web Apps Docs](https://learn.microsoft.com/azure/static-web-apps/)
- [Next.js Docs](https://nextjs.org/docs)
- [GitHub Actions Docs](https://docs.github.com/actions)
- [Porkbun Knowledge Base](https://kb.porkbun.com/)

### Contact
- GitHub Issues: https://github.com/avilaops/ArcSat/issues
- Email: nicolas@avila.inc

---

**Last Updated**: 02/11/2025  
**Version**: 1.0.0  
**Maintained By**: Ávila Ops Team
