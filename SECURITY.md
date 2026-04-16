# Security Guidelines

## 🔒 Sensitive Files & Environment Variables

### Never Commit These Files:
- `.env` files (Backend & Frontend)
- API keys and secrets
- Database credentials
- Private keys or certificates
- Archive files (`.zip`, `.tar.gz`)

### File Protection

#### Backend (.env)
```env
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/db
JWT_SECRET=your-secret-key
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

**Location:** `inventory_backend/Inventory_Backend/.env` (Git ignored ✓)

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

**Location:** `inventory_frontend/Inventory_Frontend/.env.local` (Git ignored ✓)

---

## 📋 Setup Instructions for New Developers

### Backend Setup:
1. Navigate to `inventory_backend/Inventory_Backend/`
2. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
3. Fill in your actual credentials:
   - Get `MONGO_URI` from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Generate `JWT_SECRET`: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
   - Get Cloudinary credentials from [Cloudinary Dashboard](https://cloudinary.com/console)

### Frontend Setup:
1. Navigate to `inventory_frontend/Inventory_Frontend/`
2. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
3. Update `NEXT_PUBLIC_API_URL` if needed

---

## ✅ .gitignore Configuration

Both projects have comprehensive `.gitignore` files that exclude:
- `.env` files (sensitive data)
- `node_modules/` (generated files)
- Log files (`*.log`)
- IDE files (`.vscode/`, `.idea/`)
- Archive files (`*.zip`, etc.)
- OS files (`.DS_Store`, `Thumbs.db`)

---

## 🚨 If Secrets Were Exposed

If sensitive data was accidentally committed:
1. **Immediately rotate** all exposed credentials
2. **Remove from git history**:
   ```bash
   git filter-branch --tree-filter 'rm -f .env' HEAD
   git push --force
   ```
3. **Regenerate** all secrets and API keys
4. **Notify** relevant services (MongoDB, Cloudinary, etc.)

---

## 📝 Best Practices

- ✅ Always use `.env.example` files as templates
- ✅ Never share `.env` files in chat or tickets
- ✅ Rotate secrets regularly
- ✅ Use different credentials for dev/staging/production
- ✅ Keep `.gitignore` updated
- ✅ Review commits before pushing to ensure no secrets are exposed

---

## 🔑 Required Services

Before running the application, ensure you have:

1. **MongoDB Atlas** - Database
   - Create cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Create database user
   - Whitelist your IP address in Network Access

2. **Cloudinary** - File Storage
   - Sign up at [cloudinary.com](https://cloudinary.com)
   - Get API credentials from dashboard

3. **Node.js** - Runtime
   - v18+ recommended

---

**Last Updated:** April 15, 2026  
**Status:** ✅ Secure
