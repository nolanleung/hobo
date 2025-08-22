# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Hobo is a modern full-stack TypeScript starter template using a Turborepo monorepo structure with Next.js 15, tRPC, Better Auth, and Drizzle ORM.

## Essential Commands

### Development
```bash
pnpm dev          # Start all apps (web on :3000, API on :3001)
pnpm build        # Build all packages and apps
pnpm lint         # Run ESLint across the monorepo
pnpm format       # Format code with Prettier
```

### Database Operations
```bash
pnpm --filter=@repo/database db:generate  # Generate migration files from schema changes
pnpm --filter=@repo/database db:migrate   # Apply migrations to database
pnpm --filter=@repo/database db:push      # Push schema directly (dev only)
pnpm --filter=@repo/database db:studio    # Open Drizzle Studio GUI
```

### Running Individual Apps
```bash
pnpm --filter=web dev      # Start only the Next.js web app
pnpm --filter=api dev      # Start only the tRPC API server
```

## Architecture

### Monorepo Structure
- **apps/web**: Next.js 15 frontend with App Router, React 19, Tailwind CSS v4
- **apps/api**: tRPC API server running on Hono framework with Bun runtime
- **packages/auth**: Better Auth integration with email/password and OAuth
- **packages/database**: Drizzle ORM with PostgreSQL, includes user/session/todo schemas
- **packages/ui**: Shared shadcn/ui components with Tailwind CSS
- **packages/sdk**: TypeScript AST manipulation for type-safe client generation
- **packages/middleware**: HTTP middleware utilities
- **packages/create-hobo**: CLI tool for project scaffolding

### Key Architectural Patterns

1. **Type-Safe API Communication**: The tRPC router in `apps/api/src/index.ts` defines the API surface. The SDK package transforms these server-side definitions into client-side hooks automatically.

2. **Authentication Flow**: 
   - Better Auth configured in `packages/auth/src/auth.ts`
   - Drizzle adapter connects auth to PostgreSQL
   - Session management handled automatically
   - Auth context available in tRPC procedures via `ctx.auth`

3. **Database Schema**: 
   - Auth tables (users, sessions, accounts, verification) in `packages/database/src/schema/auth.ts`
   - Business logic tables in `packages/database/src/schema/todos.ts`
   - Use Drizzle's schema-first approach for type safety

4. **Frontend Structure**:
   - App Router with authentication-aware layouts
   - Providers wrapped in `apps/web/app/providers.tsx`
   - tRPC context created in `apps/web/src/lib/trpc.ts`
   - tRPC client configured in `apps/web/src/providers/trpc-provider.tsx`

5. **Shared Configuration**:
   - TypeScript configs extend from `@repo/typescript-config`
   - ESLint configs extend from `@repo/eslint-config`
   - Tailwind config shared via `@repo/ui/tailwind.config.ts`

### Adding New Features

When implementing new features:
1. Define database schema in `packages/database/src/schema/`
2. Create tRPC procedures in `apps/api/src/index.ts`
3. SDK automatically generates client types
4. Use generated hooks in React components
5. Follow existing patterns for consistency

### Environment Variables

Required environment variables:
- `DATABASE_URL`: PostgreSQL connection string
- `WEB_ORIGIN`: Web app URL (for API CORS)
- `NEXT_PUBLIC_AUTH_BASE_URL`: API URL (for web app)
- OAuth provider credentials (optional, for social login)

Development database runs via Docker Compose (see `docker-compose.yml`).