# GitHub Copilot Instructions for ArcSat

## Project Overview

ArcSat is a comprehensive enterprise management system (Sistema de Gestão Empresarial) that revolutionizes how Brazilian companies manage their processes. The system features intelligent dashboards, advanced automation, team management, financial control, and mobile access, all with LGPD compliance.

## Technology Stack

### Backend
- **Runtime**: Node.js 18+ with ES Modules (`"type": "module"`)
- **Framework**: Express.js 4.x
- **Database**: MongoDB Atlas with Mongoose ORM
- **Authentication**: JWT (jsonwebtoken) + bcryptjs for password hashing
- **Validation**: validator library
- **Monitoring**: Azure Application Insights
- **Language**: JavaScript with ES6+ features

### Frontend
- **Framework**: Next.js 16.0 with App Router
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 4.x
- **UI Components**: @geist-ui/core, @phosphor-icons/react
- **React Version**: React 19.2.0 with React Compiler optimization
- **Build Tool**: Next.js native tooling

### DevOps & Cloud
- **Hosting Frontend**: Azure Static Web Apps
- **Hosting Backend**: Azure App Service
- **DNS/CDN**: Cloudflare
- **CI/CD**: GitHub Actions
- **Monitoring**: Azure Application Insights

## Project Structure

```
/
├── frontend/arcsat-landing/     # Landing page (Next.js 16 + Tailwind)
├── src/                         # Backend API (Node.js + Express)
│   ├── models/                  # MongoDB models
│   ├── routes/                  # API routes
│   ├── middleware/              # Authentication & middlewares
│   ├── config/                  # Configurations (monitoring)
│   ├── utils/                   # Utilities (multi-tenant)
│   └── server.js                # Main server file
├── docs/                        # Documentation (Docsify)
└── .github/workflows/           # CI/CD (GitHub Actions)
```

## Coding Conventions

### Backend (Node.js)

1. **Module System**: Always use ES6 imports/exports
   ```javascript
   import express from "express";
   export default User;
   ```

2. **Async/Await**: Use async/await over promises
   ```javascript
   export const protect = async (req, res, next) => {
     try {
       const user = await User.findById(decoded.id);
       // ...
     } catch (err) {
       // Handle error
     }
   };
   ```

3. **Error Responses**: Use consistent JSON error format
   ```javascript
   res.status(400).json({
     status: "error",
     message: "Descrição do erro"
   });
   ```

4. **Success Responses**: Use consistent JSON success format
   ```javascript
   res.json({
     status: "success",
     data: { ... }
   });
   ```

5. **Portuguese**: Use Portuguese for messages, comments, and user-facing text
   ```javascript
   // Comments in Portuguese
   message: "Nome é obrigatório"
   ```

6. **Middleware Pattern**: Export named functions for middleware
   ```javascript
   export const protect = async (req, res, next) => { ... };
   export const restrictTo = (...roles) => { ... };
   ```

### Frontend (Next.js + TypeScript)

1. **TypeScript**: All frontend code must use TypeScript
2. **Components**: Use functional components with hooks
3. **Styling**: Prefer Tailwind CSS classes over custom CSS
4. **App Router**: Use Next.js App Router patterns (app directory)
5. **Imports**: Use absolute imports when configured

### Database (MongoDB/Mongoose)

1. **Models**: Use Mongoose schemas with validation
   ```javascript
   const userSchema = new mongoose.Schema({
     name: {
       type: String,
       required: [true, "Nome é obrigatório"],
       trim: true
     }
   });
   ```

2. **Validation**: Use built-in validators or validator library
   ```javascript
   validate: [validator.isEmail, "Email inválido"]
   ```

3. **Indexes**: Add indexes for frequently queried fields
   ```javascript
   email: {
     type: String,
     unique: true,
     lowercase: true
   }
   ```

4. **Middleware**: Use Mongoose middleware for hooks
   ```javascript
   userSchema.pre("save", async function(next) {
     if (!this.isModified("password")) return next();
     this.password = await bcrypt.hash(this.password, 12);
     next();
   });
   ```

## Architecture Patterns

### Multi-Tenancy

The system implements multi-tenancy with company-level data isolation:

- All models include `company_id` automatically via plugin
- Use `multiTenantPlugin` for schemas requiring company isolation
- Queries automatically filter by `company_id`
- Created/updated by tracking with timestamps

Example:
```javascript
import multiTenantPlugin from './utils/multiTenant.js';
schema.plugin(multiTenantPlugin);
```

### Authentication & Authorization

- JWT-based authentication with Bearer tokens
- Middleware: `protect` (authentication), `restrictTo` (authorization)
- Password hashing with bcryptjs (cost factor 12)
- User roles: `admin`, `manager`, `user`

Example:
```javascript
import { protect, restrictTo } from './middleware/auth.js';
router.get('/admin', protect, restrictTo('admin'), handler);
```

### API Structure

- Versioned routes: `/api/v1/resource`
- RESTful conventions
- Consistent error handling middleware
- CORS enabled for frontend integration

### Webhooks

System supports webhooks with HMAC signatures:
```javascript
await webhook.trigger('contact.created', payload);
```

### Custom Domains

Support for company-specific custom domains with DNS verification.

## Environment Variables

Required variables in `.env`:
```env
# MongoDB
MONGO_URI=mongodb+srv://...

# JWT
JWT_SECRET=your_secret_here

# Email (Porkbun)
EMAIL_HOST=smtp.porkbun.com
EMAIL_PORT=587
EMAIL_USER=nicolas@avila.inc
EMAIL_PASS=***

# URLs
FRONTEND_URL=http://localhost:3000
PORT=5500
NODE_ENV=development
```

## Testing & Linting

- **Testing**: Jest with coverage
- **Linting**: ESLint for backend, ESLint + Next.js config for frontend
- **Formatting**: Prettier for code formatting

Commands:
```bash
npm test          # Run tests with coverage
npm run lint      # Lint backend
npm run format    # Format code
```

## Development Workflow

### Backend
```bash
npm install
cp .env.example .env
npm start          # Production
npm run dev        # Development with nodemon
```

### Frontend
```bash
cd frontend/arcsat-landing
npm install
npm run dev        # Development server at localhost:3000
npm run build      # Production build
```

### Documentation
```bash
npm run docs:serve  # Serve documentation at localhost:3000
```

## Deployment

- **Frontend**: Azure Static Web Apps (automated via GitHub Actions)
- **Backend**: Azure App Service (automated via GitHub Actions on push to main)
- **Monitoring**: Application Insights configured for request tracking, performance metrics, and error logging

## Best Practices

1. **Security**:
   - Never commit secrets or sensitive data
   - Use environment variables for all config
   - Validate all user inputs
   - Hash passwords before storage
   - Use HTTPS in production

2. **Performance**:
   - Use indexes for database queries
   - Implement proper caching strategies
   - Optimize bundle sizes for frontend
   - Use React Compiler optimization

3. **Code Quality**:
   - Write descriptive commit messages
   - Add comments for complex logic
   - Keep functions small and focused
   - Use meaningful variable names in Portuguese or English consistently
   - Follow DRY (Don't Repeat Yourself) principle

4. **Error Handling**:
   - Always use try-catch for async operations
   - Provide meaningful error messages in Portuguese
   - Log errors appropriately
   - Return consistent error response format

5. **Documentation**:
   - Update documentation when adding features
   - Keep README.md current
   - Document API endpoints
   - Add JSDoc comments for complex functions

## Production URLs

- **Landing Page**: https://arcsat.com.br
- **Application**: https://app.arcsat.com.br
- **API**: https://api.arcsat.com.br
- **Documentation**: https://docs.arcsat.com.br
- **Authentication**: https://auth.arcsat.com.br

## Contributing

When contributing to this project:
1. Create a feature branch from main
2. Follow the coding conventions above
3. Write tests for new functionality
4. Run linters and tests before committing
5. Write clear commit messages
6. Open a pull request with detailed description

---

**Developed with ❤️ by Ávila Inc**
