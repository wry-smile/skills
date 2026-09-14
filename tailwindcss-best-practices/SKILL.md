---
name: tailwindcss-best-practices
description: >
  Cross-framework best practices for Tailwind CSS projects, with guidance
  focused on Tailwind CSS 4.x. Use when creating, modifying, reviewing, or
  debugging Tailwind code in Angular, React, Vue, Svelte, and other frameworks.
---

# Tailwind CSS Best Practices

Use this skill whenever creating, modifying, reviewing, or debugging Tailwind CSS.
The guidance focuses on Tailwind CSS 4.x. First inspect the project version and
follow its installed version when the project uses a different major version;
do not apply v4-only syntax to older projects.

The goal is to generate Tailwind code that is:

- idiomatic for Tailwind CSS 4
- statically detectable
- maintainable
- themeable
- accessible
- framework-friendly
- editor-friendly
- compatible with Tailwind CSS IntelliSense

## 1. Inspect the project first

Before making project-wide Tailwind changes, inspect when available:

- `package.json`
- global CSS entrypoint
- framework/build configuration (for example `angular.json`, `vite.config.*`,
  `next.config.*`, or `svelte.config.*`)
- PostCSS configuration
- `.vscode/settings.json`
- existing theme variables
- existing Tailwind configuration
- existing `cn`, `clsx`, `cva`, or equivalent helpers
- existing component-library conventions

Do not introduce configuration that already exists.

Do not migrate unrelated code while solving a local task.

## 2. Assume Tailwind CSS 4

Unless the repository proves otherwise, use Tailwind CSS 4 conventions.

Prefer:

```css
@import "tailwindcss";
```

Do not introduce Tailwind CSS 3 entry directives into a v4 project:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Prefer CSS-first configuration.

```css
@theme {
  --color-primary: oklch(0.6 0.18 250);
}
```

## 3. Important modifier

For new Tailwind CSS 4 code, prefer the trailing important modifier.

Preferred:

```html
<div class="size-full!"></div>
<div class="bg-primary!"></div>
<div class="md:w-full!"></div>
<div class="hover:bg-primary!"></div>
```

Do not generate the legacy prefix form by default:

```html
<div class="!size-full"></div>
```

Use `!` only when normal cascade or specificity cannot reasonably solve the problem.

See `references/core-rules.md`.

## 4. CSS variable shorthand

Prefer Tailwind CSS 4 custom-property shorthand for simple CSS variables.

Preferred:

```html
<div class="text-(--app-muted)"></div>
<div class="bg-(--app-surface)"></div>
<div class="border-(--app-border)"></div>
<div class="w-(--sidebar-width)"></div>
```

Instead of:

```html
<div class="text-[var(--app-muted)]"></div>
<div class="w-[var(--sidebar-width)]"></div>
```

Use explicit arbitrary syntax when a real expression is required:

```html
<div class="w-[calc(var(--sidebar-width)+1rem)]"></div>
```

Important distinction:

- if a semantic Tailwind token already exists, prefer `text-muted`
- if only a CSS variable exists, prefer `text-(--app-muted)`
- for complex expressions, use arbitrary values

See `references/theme-and-variables.md`.

## 5. Never dynamically construct Tailwind class names

Bad:

```ts
const className = `bg-${color}-500`
```

Bad Angular template binding:

```html
<div [class]="'bg-' + color + '-500'"></div>
```

Good:

```ts
const variants = {
  success: 'bg-green-500 text-white',
  warning: 'bg-amber-500 text-black',
  error: 'bg-red-500 text-white',
} as const
```

For truly dynamic values, use CSS custom properties plus static Tailwind utilities.

See `references/dynamic-classes.md`.

## 6. VS Code IntelliSense is part of the developer experience

When the project uses VS Code, inspect and preserve `.vscode/settings.json`.

Common Tailwind-aware helpers should be registered when used:

```json
{
  "tailwindCSS.classFunctions": ["cn", "clsx", "cva"]
}
```

Common class attributes may be made explicit when they are not already
recognized:

```json
{
  "tailwindCSS.classAttributes": ["class", "className"]
}
```

Add framework-specific attributes such as `ngClass` only when the project uses
them and the extension needs explicit recognition.

For Tailwind CSS 4 monorepos or ambiguous source trees, explicitly map CSS entrypoints:

```json
{
  "tailwindCSS.experimental.configFile": {
    "modules/web-test/src/styles.css": "modules/web-test/src/**"
  }
}
```

Framework-specific class contexts may require a targeted regex or helper
registration; only add configuration for patterns actually used by the project.

See `references/vscode-intellisense.md`.

## 7. Framework integration

Keep framework-specific syntax idiomatic to the project while preserving
Tailwind's static class detection. Prefer complete static class strings for
variants, CSS variables for truly runtime values, and existing class-merging
helpers where present. See `references/framework-integrations.md` for patterns
across Angular, React, Vue, Svelte, JSX-style frameworks, and third-party UI
libraries.

## 8. Theme architecture

Separate three concepts:

1. primitive design tokens
2. semantic Tailwind tokens
3. runtime/application CSS variables

Use `@theme` when a value should participate in Tailwind utilities.

Use normal CSS variables when the value is runtime state or application configuration.

See `references/theme-and-variables.md`.

## 9. Component abstraction order

Prefer this order:

```text
Tailwind utilities
        ↓
Reusable component
        ↓
Finite component variants
        ↓
Custom utility
        ↓
Custom CSS
```

Do not move repeated markup into `@apply` by default.

See `references/components.md`.

## 10. Core layout rules

Prefer:

- `flex`
- `grid`
- `gap-*`
- `size-*`
- `min-w-0`
- `shrink-0`
- responsive variants
- container queries

before:

- absolute positioning
- negative margins
- transform-based layout
- arbitrary pixel offsets

## 11. Arbitrary values

Before using an arbitrary length, check whether a built-in utility expresses
the same value. Tailwind CSS 4 derives numeric spacing utilities from the
spacing scale, so values can include fractions: with the default `--spacing`
of `0.25rem`, `w-2.75` is 11px at a 16px root font size.

Prefer:

```html
<div class="w-2.75"></div>
<div class="size-2.75"></div>
```

over equivalent one-off values:

```html
<div class="w-[11px]"></div>
<div class="size-[11px]"></div>
```

Choose the utility by intent first (`size-*`, `w-full`, a fraction, or a
spacing-scale value). Use arbitrary values for exact values outside the
project's scale, genuine one-off constraints, or expressions that need
`calc()`. Do not round a precise design value to a different size just to make
it a whole number or a multiple of four. Repeated out-of-scale design values
usually deserve a named theme token.

Good:

```html
<div class="max-h-[80vh]"></div>
<div class="grid-cols-[240px_1fr]"></div>
```

Repeated arbitrary values usually indicate a missing token.

## 12. Accessibility

Do not remove visible focus without replacement.

Prefer `focus-visible:*` for keyboard focus styling when appropriate.

Use semantic disabled and ARIA/data states.

## 13. Review order

When improving Tailwind code, prioritize:

1. correctness
2. static class detection
3. layout and overflow
4. conflicting utilities
5. responsive behavior
6. accessibility
7. theme/token consistency
8. component extraction
9. custom utilities
10. cosmetic cleanup

See `references/review-checklist.md`.

## Decision model

```text
Existing Tailwind utility?
        ↓ yes
Use utility

Repeated design value?
        ↓ yes
Create/use design token

Runtime CSS value?
        ↓ yes
CSS variable + Tailwind variable shorthand

One-off special value?
        ↓ yes
Arbitrary value

Repeated UI structure?
        ↓ yes
Extract component

Reusable primitive CSS behavior?
        ↓ yes
@utility

Third-party/unmodifiable markup?
        ↓ yes
Custom CSS / @apply where justified
```

Prefer explicit, boring, statically detectable Tailwind code over clever runtime class generation.
