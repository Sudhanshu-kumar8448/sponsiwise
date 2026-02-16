# Node.js Setup for Sponsiwise

## Problem

Node.js v25 causes `ERR_INVALID_PACKAGE_CONFIG` with NestJS and Next.js. Both backend and frontend fail to start.

## Solution

Use **Node.js 20 LTS**. Node 20 has been installed via Homebrew.

## How to Run

### Option 1: Set PATH for this terminal session

```bash
export PATH="/opt/homebrew/opt/node@20/bin:$PATH"
```

Then run as usual:

```bash
# Backend
cd sponsiwise_backend && npm run start:dev

# Frontend (in another terminal)
cd sponsiwise-frontend && npm run dev
```

### Option 2: Make Node 20 default (add to ~/.zshrc)

```bash
echo 'export PATH="/opt/homebrew/opt/node@20/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

### Option 3: Source the helper script

```bash
source use-node20.sh
cd sponsiwise_backend && npm run start:dev
```

## Verify Node Version

```bash
node -v   # Should show v20.x.x
```

## After Switching Node

If you had previously installed dependencies with Node 25, reinstall:

```bash
cd sponsiwise_backend && rm -rf node_modules && npm install
cd sponsiwise-frontend && rm -rf node_modules && npm install
```

For the backend, also regenerate Prisma:

```bash
cd sponsiwise_backend && npx prisma generate
```
