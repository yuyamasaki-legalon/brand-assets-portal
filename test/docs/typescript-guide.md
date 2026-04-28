# TypeScript Configuration and Patterns

Guide to TypeScript configuration and common patterns in aegis-lab.

## TypeScript Configuration

### Strict Mode

This project uses TypeScript strict mode for maximum type safety.

**`tsconfig.json`**:
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true
  }
}
```

### What Strict Mode Enables

| Flag | Enforces |
|------|----------|
| `noImplicitAny` | No implicit `any` types |
| `strictNullChecks` | `null` and `undefined` must be handled explicitly |
| `strictFunctionTypes` | Strict function parameter checking |
| `strictBindCallApply` | Type-safe `bind`, `call`, `apply` |
| `strictPropertyInitialization` | Class properties must be initialized |
| `noImplicitThis` | `this` must have explicit type |
| `alwaysStrict` | Emit "use strict" in output |

---

## Common Type Patterns

### Defining Component Props

```tsx
// Basic props
interface MyComponentProps {
  title: string;
  count?: number;  // Optional
  onSubmit: (value: string) => void;
}

function MyComponent({ title, count = 0, onSubmit }: MyComponentProps) {
  return <div>{title}: {count}</div>;
}
```

### Props with Children

```tsx
import { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

function Container({ children, className }: ContainerProps) {
  return <div className={className}>{children}</div>;
}
```

### Event Handlers

```tsx
import { FormEvent, MouseEvent, ChangeEvent } from 'react';

interface FormProps {
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

function MyForm({ onSubmit }: FormProps) {
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    console.log('Clicked:', event.currentTarget);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    console.log('Changed:', event.target.value);
  };

  return (
    <form onSubmit={onSubmit}>
      <input onChange={handleChange} />
      <button onClick={handleClick}>Submit</button>
    </form>
  );
}
```

---

## Handling Null and Undefined

### Optional Chaining

```tsx
// Instead of:
const name = user && user.profile && user.profile.name;

// Use:
const name = user?.profile?.name;
```

### Nullish Coalescing

```tsx
// Instead of:
const count = value !== null && value !== undefined ? value : 0;

// Use:
const count = value ?? 0;
```

### Type Guards

```tsx
function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function processValue(value: unknown) {
  if (isString(value)) {
    // TypeScript knows value is string here
    console.log(value.toUpperCase());
  }
}
```

### Non-null Assertion (Use Sparingly)

```tsx
// When you're certain a value is not null
const element = document.getElementById('my-id')!;

// ⚠️ Use only when you're absolutely sure
// Better to use type guards when possible
```

---

## Working with External Data

### Runtime Validation with Zod

For data from external sources (APIs, user input), use runtime validation.

```tsx
import { z } from 'zod';

// Define schema
const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  age: z.number().optional(),
});

// Infer TypeScript type from schema
type User = z.infer<typeof UserSchema>;

// Parse and validate
async function fetchUser(id: number): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  const data = await response.json();

  // Runtime validation
  const user = UserSchema.parse(data);  // Throws if invalid
  return user;
}

// Or use safeParse for non-throwing validation
const result = UserSchema.safeParse(data);
if (result.success) {
  const user = result.data;  // Type-safe user
} else {
  console.error(result.error);
}
```

---

## Generic Types

### Generic Functions

```tsx
function identity<T>(value: T): T {
  return value;
}

const num = identity(42);        // Type: number
const str = identity("hello");   // Type: string
```

### Generic Components

```tsx
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => ReactNode;
}

function List<T>({ items, renderItem }: ListProps<T>) {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>{renderItem(item)}</li>
      ))}
    </ul>
  );
}

// Usage
<List
  items={[1, 2, 3]}
  renderItem={(num) => <span>{num}</span>}
/>
```

---

## Union and Intersection Types

### Union Types

```tsx
type Status = 'pending' | 'success' | 'error';

interface Task {
  status: Status;
  message?: string;
}

function handleStatus(status: Status) {
  switch (status) {
    case 'pending':
      return 'Loading...';
    case 'success':
      return 'Done!';
    case 'error':
      return 'Failed!';
  }
}
```

### Discriminated Unions

```tsx
type Result =
  | { type: 'success'; data: string }
  | { type: 'error'; error: Error };

function handleResult(result: Result) {
  if (result.type === 'success') {
    // TypeScript knows result.data is available
    console.log(result.data);
  } else {
    // TypeScript knows result.error is available
    console.error(result.error);
  }
}
```

### Intersection Types

```tsx
type Nameable = { name: string };
type Ageable = { age: number };

type Person = Nameable & Ageable;

const person: Person = {
  name: 'Alice',
  age: 30,
};
```

---

## Utility Types

### Partial

```tsx
interface User {
  id: number;
  name: string;
  email: string;
}

// All properties optional
type PartialUser = Partial<User>;

function updateUser(id: number, updates: Partial<User>) {
  // updates can have any combination of User properties
}
```

### Pick

```tsx
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

// Pick specific properties
type UserPublic = Pick<User, 'id' | 'name' | 'email'>;
```

### Omit

```tsx
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

// Omit specific properties
type UserWithoutPassword = Omit<User, 'password'>;
```

### Record

```tsx
type Role = 'admin' | 'user' | 'guest';

const permissions: Record<Role, string[]> = {
  admin: ['read', 'write', 'delete'],
  user: ['read', 'write'],
  guest: ['read'],
};
```

---

## Type Assertions

### as Keyword

```tsx
// When you know more than TypeScript
const myCanvas = document.getElementById('my-canvas') as HTMLCanvasElement;

// Angle-bracket syntax (not recommended in TSX)
// const myCanvas = <HTMLCanvasElement>document.getElementById('my-canvas');
```

### Satisfies Operator (TypeScript 4.9+)

```tsx
type Color = { r: number; g: number; b: number } | string;

const palette = {
  red: { r: 255, g: 0, b: 0 },
  blue: '#0000ff',
} satisfies Record<string, Color>;

// Type is inferred precisely, not widened to Record<string, Color>
palette.red.r;  // OK
palette.blue.toUpperCase();  // OK
```

---

## Avoiding Common Errors

### 1. Type 'X' is not assignable to type 'Y'

**Problem**:
```tsx
const name: string = user.name;  // Error if name is string | undefined
```

**Solution**:
```tsx
const name: string = user.name ?? 'Unknown';
// or
const name: string | undefined = user.name;
```

### 2. Object is possibly 'null' or 'undefined'

**Problem**:
```tsx
const element = document.getElementById('my-id');
element.textContent = 'Hello';  // Error
```

**Solution**:
```tsx
// Option 1: Null check
const element = document.getElementById('my-id');
if (element) {
  element.textContent = 'Hello';
}

// Option 2: Optional chaining
document.getElementById('my-id')?.setAttribute('title', 'Hello');

// Option 3: Non-null assertion (if you're certain)
const element = document.getElementById('my-id')!;
element.textContent = 'Hello';
```

### 3. Argument of type 'X' is not assignable to parameter of type 'Y'

**Problem**:
```tsx
function greet(name: string) {
  console.log(`Hello, ${name}`);
}

const maybeName: string | null = getName();
greet(maybeName);  // Error
```

**Solution**:
```tsx
const maybeName: string | null = getName();
if (maybeName) {
  greet(maybeName);  // Type narrowed to string
}
// or
greet(maybeName ?? 'Guest');
```

---

## Best Practices

### DO

- ✅ Use strict mode
- ✅ Define explicit types for props
- ✅ Use type guards for runtime checks
- ✅ Validate external data (Zod, etc.)
- ✅ Prefer `unknown` over `any` for uncertain types
- ✅ Use utility types (Partial, Pick, Omit)

### DON'T

- ❌ Use `any` without justification
- ❌ Use `@ts-ignore` to hide errors
- ❌ Skip type checking with `as any`
- ❌ Ignore build errors
- ❌ Assume external data is correctly typed

---

## Type Checking Commands

### Type Check Only

```bash
pnpm type-check
```

Runs TypeScript compiler in check mode (no output).

### Type Check + Build

```bash
pnpm build
```

Type checks and builds the project. **Required before PR**.

---

## Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TypeScript Cheat Sheet](https://www.typescriptlang.org/cheatsheets)
- [React TypeScript Cheat Sheet](https://react-typescript-cheatsheet.netlify.app/)

For more information, see:
- [Development Rules](/docs/development-rules.md)
- [Onboarding Guide](/docs/onboarding-guide.md)
