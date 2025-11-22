# Hobo

> The Hobo spider can reach speeds of up to 40 inches per second, making it one of the fastest spiders in the world. Like its namesake, Hobo helps you build web applications at lightning speed.

Hobo is a modern, production-ready starter template for building full-stack TypeScript applications. It combines the best tools and practices to help you ship faster without sacrificing quality.

## Features

- 🏗️ **Turborepo Monorepo** - Efficient builds and organized code structure
- ⚡ **Next.js 16** - Latest React 19 features with App Router
- 🔒 **Built-in Authentication** - Better Auth with email/password and OAuth support
- 🔗 **Type-Safe APIs** - End-to-end type safety with tRPC
- 🎨 **Tailwind CSS v4** - Utility-first styling with shadcn/ui components
- 📦 **pnpm Workspaces** - Fast, efficient package management
- 🚀 **Bun Runtime** - Blazing fast API server execution
- 🧩 **Modular Architecture** - Shared packages for auth, database, and UI

## Quick Start

The fastest way to get started is using `create-hobo`:

```bash
npx create-hobo@latest my-app
cd my-app
pnpm install
pnpm dev
```

Choose from three templates:

- **minimal** - Single Next.js app with essential features
- **api-only** - Standalone tRPC API server
- **full-stack** - Complete monorepo with web app and API

## Prerequisites

- Node.js 18+
- pnpm 8+
- PostgreSQL (for full-stack template)

## Manual Setup

1. Clone the repository:

```bash
git clone https://github.com/yourusername/hobo.git
cd hobo
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:

```bash
cp .env.example .env
# Edit .env with your database credentials
```

4. Initialize the database:

```bash
pnpm --filter=@repo/database db:push
```

5. Start development servers:

```bash
pnpm dev
```

Your apps will be running at:

- Web: http://localhost:3000
- API: http://localhost:3001

## Project Structure

```
apps/
├── web/          # Next.js frontend application
└── api/          # tRPC API server

packages/
├── @repo/auth/           # Shared authentication logic
├── @repo/database/       # Database client and schemas
├── @repo/ui/             # Shared UI components
├── @repo/sdk/            # Type-safe client generation
├── @repo/middleware/     # HTTP middleware utilities
├── @repo/eslint-config/
├── @repo/typescript-config/
└── @repo/create-hobo/    # CLI for scaffolding new projects
```

## Available Scripts

From the root directory:

```bash
pnpm dev          # Start all apps in development mode
pnpm build        # Build all apps and packages
pnpm lint         # Lint all packages
pnpm format       # Format code with Prettier
```

For specific apps:

```bash
pnpm --filter=web dev      # Start only the web app
pnpm --filter=api dev      # Start only the API server
```

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS v4, shadcn/ui
- **Backend**: tRPC, Better Auth, Bun runtime
- **Database**: PostgreSQL, Prisma
- **DevOps**: Turborepo, pnpm workspaces, ESLint, Prettier
- **Authentication**: Email/password, OAuth providers (GitHub, Google)

## Authentication

Hobo includes a complete authentication system:

- Email/password authentication
- OAuth providers (configure in `.env`)
- Session management
- Protected routes
- Type-safe auth hooks

## Database

Uses PostgreSQL with Prisma:

```bash
# Generate Prisma client from schema changes
pnpm --filter=@repo/database db:generate

# Apply migrations to database
pnpm --filter=@repo/database db:migrate

# Push schema changes directly (development)
pnpm --filter=@repo/database db:push

# Open Prisma Studio for database management
pnpm --filter=@repo/database db:studio
```

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## License

MIT
