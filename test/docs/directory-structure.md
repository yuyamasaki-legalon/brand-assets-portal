# Directory Structure

Complete directory structure and organization of the aegis-lab project.

## Overview

```
aegis-lab/
├── src/                    # Source code
├── docs/                   # Documentation
├── scripts/                # Development scripts
├── tools/                  # External tool integrations
├── public/                 # Static assets
├── dist/                   # Build output (auto-generated)
├── node_modules/           # Dependencies (pnpm managed)
└── [config files]          # Configuration files
```

## Detailed Structure

### Source Code (`src/`)

```
src/
├── main.tsx                # Application entry point
├── App.tsx                 # Root component with routing
├── pages/                  # Page components
│   ├── Home.tsx            # Home page
│   ├── routes.tsx          # Page route definitions
│   ├── sandbox/            # Experimental sandbox pages
│   │   ├── SandboxHome.tsx     # Sandbox index page
│   │   ├── routes.tsx          # Sandbox route definitions
│   │   └── [page-name]/        # Individual sandbox pages
│   │       ├── index.tsx       # Page component
│   │       └── *.module.css    # Page styles (optional)
│   └── template/           # Reusable page templates
│       ├── TemplateHome.tsx    # Template index page
│       ├── routes.tsx          # Template route definitions
│       └── [template-name]/    # Individual templates
│
├── components/             # Shared UI components
│   ├── FloatingSourceCodeViewer.tsx  # Source code viewer
│   └── ...                 # Other shared components
│
├── hooks/                  # Custom React hooks
│   ├── useLocale.ts        # Locale access hook
│   ├── useTranslation.ts   # Translation hook (i18n)
│   └── index.ts            # Exports
│
├── contexts/               # React Context providers
│   ├── LocaleContext.tsx   # Locale state context
│   └── index.ts            # Exports
│
└── types/                  # TypeScript type definitions
    └── ...                 # Global type definitions
```

#### Key Files

**`src/main.tsx`**
- Application entry point
- Mounts React app to DOM
- Sets up global providers

**`src/App.tsx`**
- Root component
- Routing configuration
- Global providers (if any)

**`src/pages/routes.tsx`**
- Route definitions for pages
- Exported and consumed by parent routers

**`src/pages/sandbox/`**
- Experimental prototype pages
- Created via `pnpm sandbox:create`
- Isolated from production code
- ⚠️ **NOT for reference** - Varying code quality, experimental patterns
- **Do not use as code examples** - May not follow best practices

**`src/pages/template/`**
- Reusable page templates
- Production-quality code examples
- **Use these as reference** for patterns and best practices
- Search `CATALOG.md`, then scaffold sandbox pages with `pnpm sandbox:create` and adapt from the matched template
- Contains co-located `CONCEPT.md` files for domain knowledge (see below)

**`src/pages/template/{service}/CONCEPT.md`**
- Service concept (vision, target users, core entities, terminology)
- Feature concepts are placed at `{service}/{feature}/CONCEPT.md`
- Concept templates are in `_concept-templates/`
- See `.claude/rules/concept-hierarchy.md` for details

### Documentation (`docs/`)

```
docs/
├── onboarding-guide.md     # Setup guide
├── sandbox-guide.md        # Sandbox page creation guide
├── commands.md             # Development commands reference
├── directory-structure.md  # This file
├── development-rules.md    # Development rules and constraints
├── aegis-integration-guide.md  # Aegis design system guide
├── typescript-guide.md     # TypeScript configuration and patterns
├── workflow-guide.md       # Development workflow
├── troubleshooting.md      # Common issues and solutions
├── tech-stack.md           # Technology stack details
└── rules/                  # Design and component rules
    ├── ui/                 # UI design guidelines
    │   ├── 01_principles.md    # Design principles
    │   ├── 02_foundations.md   # Foundations (colors, typography, spacing)
    │   └── 03_layouts.md       # Layout patterns
    └── component/          # Component-specific rules
        ├── Button.md
        ├── PageLayout.md
        └── ...             # Other component rules
```

### Scripts (`scripts/`)

```
scripts/
├── create-sandbox-page.ts      # Creates new sandbox pages
├── create-user-sandbox-page.ts # Creates user sandbox environments
└── ...
```

These scripts are executed via `pnpm sandbox:create` and related package scripts.

### Tools (`tools/`)

```
tools/
└── word-addin-connector/   # Word Add-in XML manifests & docs
    ├── README.md
    ├── aegis-lab-addin-prd.xml
    └── aegis-lab-addin-preview.xml
```

Office Add-in manifests for displaying Aegis Lab in Word's task pane.
See [tools/word-addin-connector/README.md](../tools/word-addin-connector/README.md) for details.

### Static Assets (`public/`)

```
public/
└── ...  # Images, favicon, etc.
```

Files in `public/` are:
- Served as-is
- Not processed by Vite
- Accessible from `/` in production

### Build Output (`dist/`)

```
dist/  # Auto-generated, DO NOT EDIT
└── ...  # Production build files
```

**Important**:
- ❌ **NEVER modify manually** - Vite auto-generates
- ❌ **DO NOT commit** - Listed in `.gitignore`
- Created by `pnpm build`
- Served by `pnpm preview`

### Dependencies (`node_modules/`)

```
node_modules/  # Auto-generated, DO NOT EDIT
└── ...  # Installed packages
```

**Important**:
- ❌ **NEVER modify manually** - pnpm manages
- ❌ **DO NOT commit** - Listed in `.gitignore`
- Created by `pnpm install`

### Configuration Files

```
aegis-lab/
├── package.json            # Dependencies and scripts
├── pnpm-lock.yaml          # Lockfile (pnpm managed)
├── tsconfig.json           # TypeScript configuration
├── tsconfig.node.json      # TypeScript config for Node
├── vite.config.ts          # Vite configuration
├── wrangler.jsonc          # Cloudflare Workers config
├── biome.json              # Biome linter/formatter config
├── .stylelintrc.cjs        # Stylelint configuration
├── .mcp.json               # MCP tools configuration
├── .gitignore              # Git ignore rules
├── CLAUDE.md               # AI agent guidelines (detailed)
├── llms.txt                # LLM documentation (index)
└── llms-full.txt           # LLM documentation (full)
```

## Important Directories Summary

### Editable Directories

✅ **You can modify**:
- `src/` - Source code (includes co-located CONCEPT.md files)
- `docs/` - Documentation
- `public/` - Static assets

### Protected Directories

❌ **DO NOT modify manually**:
- `dist/` - Auto-generated by Vite
- `node_modules/` - Auto-generated by pnpm

### Special Directories

🔧 **Managed by tools**:
- `scripts/` - Development automation
- `src/pages/sandbox/` - Created by `pnpm sandbox:create`

## Routing Structure

Routes are defined in a distributed manner:

```
src/App.tsx (main router)
  ├── / (Home)
  ├── /sandbox/* → src/pages/sandbox/routes.tsx
  │   ├── /sandbox (SandboxHome)
  │   └── /sandbox/[page-name] (individual pages)
  └── /template/* → src/pages/template/routes.tsx
      ├── /template (TemplateHome)
      └── /template/[template-name] (individual templates)
```

Each directory can define its own `routes.tsx` for local route management.

## File Naming Conventions

- **Components**: PascalCase (e.g., `MyComponent.tsx`)
- **Utilities**: camelCase (e.g., `myUtil.ts`)
- **Styles**: kebab-case or module suffix (e.g., `my-component.module.css`)
- **Routes**: Always `routes.tsx`
- **Types**: PascalCase (e.g., `MyTypes.ts`)

## Related Documentation

- [Onboarding Guide](/docs/onboarding-guide.md) - Setup guide
- [Sandbox Guide](/docs/sandbox-guide.md) - Creating prototype pages
- [Development Rules](/docs/development-rules.md) - Code organization rules
