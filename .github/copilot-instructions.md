# ArcSat - Sistema de Gestão Empresarial

## Project Overview

ArcSat is a comprehensive business management system (CRM/ERP) that revolutionizes how Brazilian companies manage their processes. The system features advanced automation with integrated AI, real-time dashboards, team management, financial control, and mobile access.

**Owner:** Ávila Inc  
**Contact:** nicolas@avila.inc  
**Website:** https://avila.inc

## Project Structure

```
/
├── frontend/arcsat-landing/       # Landing page (Next.js 16 + Tailwind)
├── src/                           # Backend API (Node.js + Express)
│   ├── models/                    # MongoDB models
│   ├── routes/                    # API routes
│   ├── middleware/                # Authentication and middlewares
│   ├── config/                    # Configurations (monitoring)
│   ├── utils/                     # Utilities (multi-tenant)
│   ├── db.js                      # Database connection
│   └── server.js                  # Entry point
├── docs/                          # Documentation (Docsify)
└── .github/workflows/             # CI/CD (GitHub Actions)
```

## Technology Stack

### Frontend
- **Next.js 16.0** - React framework with App Router
- **TypeScript** - Static typing
- **Tailwind CSS 4** - Modern styling
- **React Compiler** - Optimized performance
- **React 19.2** - Latest React features
- **Geist UI** - Component library
- **Phosphor Icons** - Icon system

### Backend
- **Node.js 18+** - JavaScript runtime
- **Express** - Web framework
- **MongoDB Atlas** - Database
- **Mongoose 8.0** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password encryption
- **Application Insights** - Monitoring

### DevOps & Cloud
- **Azure Static Web Apps** - Frontend hosting
- **Azure App Service** - API backend
- **Cloudflare** - DNS and CDN
- **GitHub Actions** - CI/CD automation
- **Application Insights** - Monitoring

## Development Setup

### Prerequisites
- Node.js 18+ (required)
- npm 9+ (required)
- MongoDB Atlas account
- Azure CLI (for deployment)

### Backend Setup
```bash
npm install
cp .env.example .env  # Configure your variables
npm start             # Production
npm run dev          # Development with nodemon
```

Backend runs on: http://localhost:5500

### Frontend Setup
```bash
cd frontend/arcsat-landing
npm install
npm run dev
```

Frontend runs on: http://localhost:3000

### Documentation
```bash
npm run docs:serve  # Note: Uses port 3000 by default
# Or specify a different port to avoid conflict with frontend:
docsify serve docs -p 3001
```

Docs available on: http://localhost:3000 (or custom port)

## Environment Variables

Required environment variables (see `.env.example`):
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - JWT secret key
- `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS` - Email configuration (Porkbun)
- `FRONTEND_URL` - Frontend URL (default: http://localhost:3000)
- `PORT` - Backend port (default: 5500)
- `NODE_ENV` - Environment (development/production)

## Code Style & Standards

### General Principles
- Write clear, maintainable code
- Follow existing patterns in the codebase
- Use descriptive variable and function names
- Add comments only when necessary for complex logic
- Keep functions small and focused on single responsibility

### Backend (Node.js)
- Use ES modules (`import`/`export`)
- Use `async`/`await` for asynchronous operations
- Follow REST API conventions
- Implement proper error handling
- Use middleware for cross-cutting concerns
- Validate input data
- Keep route handlers thin, move logic to services

### Frontend (Next.js + TypeScript)
- Use TypeScript for all new code
- Follow Next.js App Router conventions
- Use server components by default, client components when necessary
- Keep components small and reusable
- Use Tailwind CSS for styling
- Follow React best practices (hooks, composition)
- Ensure accessibility (semantic HTML, ARIA labels)

### Testing
- Run `npm test` for backend tests (Jest)
- Use `npm run lint` to check code style (ESLint)
- Use `npm run format` to format code (Prettier)
- Frontend has ESLint configured

## Key Features & Architecture

### Multi-Tenancy
- All models automatically include `company_id`
- Data isolation per company
- Uses `multiTenantPlugin` utility

```javascript
import multiTenantPlugin from './utils/multiTenant.js'
schema.plugin(multiTenantPlugin)
```

### Authentication
- JWT-based authentication
- Protected routes use `protect` middleware
- Role-based access control with `restrictTo` middleware

```javascript
import { protect, restrictTo } from './middleware/auth.js'
router.get('/admin', protect, restrictTo('admin'), handler)
```

### Webhooks
- HMAC signature verification
- Event-based system

```javascript
await webhook.trigger('contact.created', payload)
```

### Custom Domains
- Support for custom domains per company
- DNS verification required

## Production URLs

- **Landing Page:** https://arcsat.com.br
- **Application:** https://app.arcsat.com.br
- **API:** https://api.arcsat.com.br
- **Documentation:** https://docs.arcsat.com.br
- **Authentication:** https://auth.arcsat.com.br

## CI/CD

### Deployment
- Frontend: Azure Static Web Apps (automatic via GitHub Actions)
- Backend: Azure App Service (automatic on push to main)

### Workflows
- Defined in `.github/workflows/main.yml`
- Automatic deployment on push to main branch
- Build and test before deployment

## Contributing Guidelines

### When Making Changes
1. Always test your changes locally before committing
2. Run linter and formatter before committing
3. Keep changes focused and minimal
4. Update documentation if adding new features
5. Follow the existing code style
6. Don't commit sensitive data (secrets, credentials)
7. Don't remove or modify working code unless necessary

### Branch Strategy
1. Create a feature branch from main
2. Make focused commits with clear messages
3. Push changes and open a Pull Request
4. Wait for review and CI checks to pass

### Task Types Well-Suited for Copilot
- Bug fixes in existing code
- Adding new API endpoints following existing patterns
- UI component creation and styling
- Adding validation logic
- Updating documentation
- Adding tests for existing functionality
- Code refactoring for readability
- Adding error handling
- Accessibility improvements

### Tasks Requiring Human Review
- Architecture changes
- Security-critical code (authentication, authorization)
- Database schema changes
- Breaking API changes
- Complex business logic
- Production incident fixes
- Deployment configuration changes

## Security & Best Practices

- Always validate user input
- Use parameterized queries (Mongoose handles this)
- Hash passwords with bcrypt (never store plain text)
- Use JWT for stateless authentication
- Implement rate limiting for APIs
- Keep dependencies up to date
- Use environment variables for secrets
- Implement proper CORS configuration
- Follow LGPD compliance requirements
- Log errors but not sensitive data

## Monitoring & Observability

Application Insights is configured for:
- Request tracking
- Performance metrics
- Error logging
- Custom telemetry per company

## License

Proprietary - **Ávila Inc** - All rights reserved.

This is a private commercial project. Unauthorized copying, distribution, or use is prohibited.
