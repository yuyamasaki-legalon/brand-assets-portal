# Technology Stack

Detailed information about the technologies used in aegis-lab.

---

## Frontend

### React (19.2.0)

**UI Library**

React is the foundation for building the user interface.

**Key Features**:
- Component-based architecture
- Virtual DOM for efficient updates
- Hooks for state and side effects
- Strong ecosystem and community

**Why React 19**:
- Latest stable version
- Performance improvements
- Enhanced concurrent features
- Better TypeScript support

### TypeScript (5.9.3)

**Type-Safe JavaScript**

TypeScript adds static typing to JavaScript for safer, more maintainable code.

**Key Features**:
- Static type checking
- IntelliSense and autocomplete
- Catches errors at compile time
- Enhanced refactoring support

**Configuration**: Strict mode enabled for maximum type safety.

See [TypeScript Guide](/docs/typescript-guide.md) for details.

### Vite (7.2.2)

**Build Tool and Dev Server**

Vite provides fast development and optimized production builds.

**Key Features**:
- Lightning-fast Hot Module Replacement (HMR)
- Instant server start
- Optimized production builds
- Native ES modules support

**Why Vite**:
- Fastest dev server experience
- Better developer experience than webpack
- Simple configuration
- Built-in TypeScript support

### React Router DOM (7.9.6)

**Client-Side Routing**

React Router handles navigation and routing in the SPA.

**Key Features**:
- Declarative routing
- Nested routes
- Dynamic route parameters
- Distributed route definitions

**Usage**: Routes are distributed across `src/pages/*/routes.tsx` files.

---

## Design System

### Aegis (@legalforce/aegis-react 2.47.1)

**Component Library**

Official LegalForce design system providing consistent, accessible UI components.

**Includes**:
- Button, Form, Table, Layout components
- Consistent styling and behavior
- WCAG AA accessibility compliance
- Responsive design

See [Aegis Integration Guide](/docs/aegis-integration-guide.md) for details.

### Aegis Icons (@legalforce/aegis-icons 2.12.0)

**Icon Set**

Comprehensive icon library for the design system.

**Features**:
- Consistent visual style
- Optimized SVG icons
- Tree-shakable (only import what you use)

### Aegis Design Tokens (@legalforce/aegis-tokens 2.13.2)

**Design Variables**

CSS variables for colors, spacing, typography, and more.

**Categories**:
- Colors (background, text, border)
- Spacing (padding, margin, gap)
- Typography (font size, weight, line height)
- Shadows, border radius, etc.

### Aegis Illustrations (@legalforce/aegis-illustrations 2.1.5)

**Illustration Assets**

Branded illustrations for empty states, errors, and onboarding.

### Aegis Logos (@legalforce/aegis-logos 2.3.0)

**Logo Assets**

Official LegalForce product logos.

---

## Development Tools

### Biome (2.3.8)

**Linter and Formatter**

Biome is a fast, unified tool for linting and formatting code. It replaces ESLint and Prettier.

**Features**:
- Extremely fast (written in Rust)
- Zero configuration needed
- Linter + Formatter in one tool
- Compatible with ESLint/Prettier rules

**Commands**:
- `pnpm lint` - Check code quality (no writes)
- `pnpm format` - Apply lint + format fixes

### Stylelint (16.0.2)

**CSS Linter**

Stylelint checks CSS files for errors and enforces conventions.

**Features**:
- Catches CSS errors
- Enforces best practices
- Customizable rules

**Command**: `pnpm lint:style`

---

## Desktop App

### Tauri 2.0

**ネイティブデスクトップアプリ**

Tauri を使い、同じ React フロントエンドをネイティブデスクトップアプリとして配布できます。

**Features**:
- 軽量なネイティブウィンドウ（Rust + WebView）
- Web ビルド（Cloudflare Workers）と共存
- macOS / Windows / Linux 対応

**Commands**:
- `pnpm tauri:dev` - 開発モード
- `pnpm tauri:build` - プロダクションビルド

**前提**: Rust ツールチェーンが必要です。

See [Tauri Guide](/docs/tauri-guide.md) for details.

---

## Data Visualization

### Recharts (3.5.1)

**Chart Library**

React-based charting library for data visualization.

**Features**:
- Declarative API
- Responsive charts
- Composable components
- Built on D3.js

**When to use**: Analytics dashboards, metrics, data reporting.

---

## Deployment

### Cloudflare Workers

**Serverless Execution Environment**

Cloudflare Workers run code at the edge for fast, global performance.

**Features**:
- Global edge network
- Low latency
- Automatic scaling
- No cold starts

### Wrangler (4.47.0)

**Cloudflare Workers CLI**

Command-line tool for deploying to Cloudflare Workers.

**Commands**:
- `pnpm deploy` - Build + Deploy
- `pnpm cf:deploy` - Deploy only

### @cloudflare/vite-plugin (1.22.1)

**Vite Integration**

Vite plugin for seamless Cloudflare Workers deployment.

**Features**:
- Integrates Vite build with Wrangler
- Single command deployment
- Development mode support

---

## AI/LLM Tools

### Aegis MCP Server (@legalforce/aegis-mcp-server 1.0.1)

**Model Context Protocol Server**

MCP server providing Aegis component information to Claude Code.

**Features**:
- Component prop documentation
- Usage examples
- Design token reference
- Icon and illustration browsing

**Configuration**: `.mcp.json`

**Tools**:
- `mcp__aegis__list_components`
- `mcp__aegis__get_component_detail`
- `mcp__aegis__list_icons`
- `mcp__aegis__list_tokens`
- And more

See [Aegis Integration Guide](/docs/aegis-integration-guide.md#mcp-tools).

---

## Package Manager

### pnpm (10.24.0)

**Fast, Disk-Efficient Package Manager**

pnpm is used instead of npm or yarn for managing dependencies.

**Advantages**:
- Faster installs
- Efficient disk usage (content-addressable storage)
- Strict dependency resolution
- Monorepo support

**Managed via**: Corepack (ensures correct version automatically)

**Commands**:
- `pnpm install` - Install dependencies
- `pnpm add <package>` - Add dependency
- `pnpm update` - Update dependencies

---

## Version Summary

| Technology | Version | Category |
|-----------|---------|----------|
| React | 19.2.0 | Frontend |
| TypeScript | 5.9.3 | Frontend |
| Vite | 7.2.2 | Build Tool |
| React Router DOM | 7.12.0 | Routing |
| @legalforce/aegis-react | 2.47.1 | Design System |
| @legalforce/aegis-icons | 2.12.0 | Design System |
| @legalforce/aegis-tokens | 2.13.2 | Design System |
| Biome | 2.3.8 | Dev Tools |
| Stylelint | 16.0.2 | Dev Tools |
| Recharts | 3.5.1 | Data Viz |
| Wrangler | 4.61.1 | Deployment |
| pnpm | 10.28.0 | Package Manager |

---

## Configuration Files

| File | Purpose |
|------|---------|
| `package.json` | Dependencies and scripts |
| `tsconfig.json` | TypeScript configuration |
| `vite.config.ts` | Vite build configuration |
| `biome.json` | Biome linter/formatter config |
| `.stylelintrc.cjs` | Stylelint configuration |
| `wrangler.jsonc` | Cloudflare Workers config |
| `.mcp.json` | MCP tools configuration |

---

## Why These Technologies?

### React + TypeScript + Vite

**Modern, type-safe, fast development**:
- React: Industry-standard UI library
- TypeScript: Catches errors early, better DX
- Vite: Fastest dev server, instant feedback

### Aegis Design System

**Consistency and accessibility**:
- Unified design across LegalForce products
- WCAG AA compliance out of the box
- Reduces custom component development

### Biome

**Fast, unified tooling**:
- Replaces ESLint + Prettier
- 10-100x faster than alternatives
- Zero configuration needed

### Cloudflare Workers

**Global edge deployment**:
- Low latency worldwide
- Automatic scaling
- Cost-effective serverless

### pnpm

**Efficient package management**:
- Faster than npm/yarn
- Saves disk space
- More reliable dependency resolution

---

## Technology Resources

### Official Documentation

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/)
- [React Router](https://reactrouter.com/)
- [Biome](https://biomejs.dev/)
- [Stylelint](https://stylelint.io/)
- [Recharts](https://recharts.org/)
- [Cloudflare Workers](https://developers.cloudflare.com/workers/)
- [pnpm](https://pnpm.io/)

### Internal Resources

- Aegis Design System (internal documentation)
- Aegis MCP Server

---

For more information, see:
- [Onboarding Guide](/docs/onboarding-guide.md)
- [TypeScript Guide](/docs/typescript-guide.md)
- [Aegis Integration Guide](/docs/aegis-integration-guide.md)
