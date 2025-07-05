# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Hobo is a Turborepo-based monorepo for building full-stack web applications with:
- Next.js 15 (App Router) + React 19 frontend
- tRPC API server running on Bun
- PostgreSQL database with Prisma ORM
- Better Auth for authentication
- Type-safe end-to-end development

## Common Commands

### Development
```bash
# Start all services (web on :3000, API on :3001)
pnpm dev

# Start specific app
pnpm --filter=web dev      # Frontend only
pnpm --filter=api dev      # API only
```

### Build & Production
```bash
# Build all packages
pnpm build

# Build specific app
pnpm --filter=web build
pnpm --filter=api build

# Start production server (web only)
pnpm --filter=web start
```

### Code Quality
```bash
# Lint all packages
pnpm lint

# Format code
pnpm format
```

### Database
```bash
# Generate Prisma client
pnpm --filter=@repo/database db:generate

# Run migrations
pnpm --filter=@repo/database db:push

# Open Prisma Studio
pnpm --filter=@repo/database db:studio
```

### Testing
```bash
# API tests
pnpm --filter=api test-dev    # Development mode
pnpm --filter=api test-start  # Production build
```

## Architecture

### Monorepo Structure
```
apps/
├── web/          # Next.js 15 frontend (port 3000)
│   └── src/
│       ├── app/  # App Router pages
│       └── components/
└── api/          # tRPC server (port 3001)
    └── src/
        └── index.ts  # Main server & router

packages/
├── @repo/auth/      # Better Auth configuration
├── @repo/database/  # Prisma client & schemas
├── @repo/ui/        # Shared UI components
├── @repo/eslint-config/
└── @repo/typescript-config/
```

### Authentication Flow
1. **Client**: Uses `@repo/auth/client` with `authClient` for browser-side auth
2. **Server**: `@repo/auth/server` provides `authHandler` and `getSession`
3. **API Integration**: tRPC procedures handle auth through Better Auth
4. **Frontend Integration**: `AuthProvider` wraps the app, `useAuth()` hook provides session

### Key Design Decisions

**Type-Safe API Communication**
- tRPC provides end-to-end type safety between frontend and backend
- API types are exported as `AppRouter` from `apps/api/src/index.ts`
- Frontend imports types for full IntelliSense support

**Authentication Architecture**
- Better Auth handles user management, sessions, and OAuth providers
- Database models follow Better Auth's schema (User, Account, Session, VerificationToken)
- Auth endpoints exposed via tRPC procedures (signIn, signUp, signOut, getSession)
- Frontend auth state managed by AuthProvider with real-time session updates

**Database Schema Organization**
- Prisma schemas split by domain (e.g., `auth.schema.prisma`)
- Models use lowercase table names with `@@map` directive
- Relationships use cascade deletes for data integrity

**Environment Configuration**
```env
DATABASE_URL="postgresql://user:password@localhost:5432/hobo_db"
NEXT_PUBLIC_AUTH_URL="http://localhost:3001"
COOKIE_DOMAIN="localhost"
# OAuth providers (optional)
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""
```

### Development Patterns

**Component Structure**
- Uses shadcn/ui components with New York theme
- Theme support via next-themes (dark/light/system)
- Components follow composition pattern

**API Route Handling**
- tRPC handles `/trpc/*` routes
- Better Auth handles `/api/auth/*` routes
- Middleware in API server routes requests appropriately

**Frontend Data Fetching**
- Server Components for initial data
- tRPC hooks for client-side queries/mutations
- Auth state accessed via `useAuth()` hook

**Type Imports**
- Use `.js` extensions for local imports in packages
- Workspace protocol (`workspace:*`) for internal dependencies
- Type exports alongside implementations