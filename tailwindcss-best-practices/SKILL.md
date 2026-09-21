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

Inspect and reuse the project's existing theme variables and semantic tokens
before adding any. Treat a new global token as a project-level design-system
change: do not create one just to style a single generated page or make a
one-off value look semantic. For one-off static values, use an existing utility
or a justified arbitrary value; keep runtime-only variables local to the
component that owns them.

Add a new `@theme` token only when the task calls for changing the design
system, the repository has an established token-authoring convention, or the
value is confirmed as a reusable semantic decision across the project. Do not
add unused or speculative CSS variables.

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

## 11. Canonical Tailwind classes

When multiple Tailwind class expressions produce equivalent CSS, prefer the
canonical form recognized by the project's Tailwind version and configuration.
Tailwind CSS 4 canonicalization is configuration-aware: its core compares the
CSS generated by candidates, and IntelliSense supplies its configured `rem`
size. Do not invent conversions from arithmetic alone.

Canonicalization changes across releases. For behavior beyond these
principles, check the official [IntelliSense diagnostic], [Tailwind core
canonicalizer], [canonicalization tests], and [release notes] for the project's
Tailwind version.

Use this order when an exact equivalent is confirmed:

1. an existing semantic utility or project theme token
2. a built-in utility or bare value on the active Tailwind scale
3. a canonical arbitrary-value form
4. the original arbitrary-value form

Before converting a spacing-backed length, inspect the active `--spacing`
theme value and the relevant `rem` context. Do not assume `--spacing` is
`0.25rem`, that the root font size is `16px`, or that a pixel value maps by
dividing it by four. With `--spacing: 0.25rem` and a 16px `rem` basis,
`mt-[11px]` can become `mt-2.75`; otherwise convert it only when the active
configuration makes their generated CSS equivalent. Keep
`mt-[13.37px]` when no exact canonical equivalent exists; never round it to a
nearby scale value. Arbitrary values are valid and should remain when no exact
canonical form is available.

When composing a class list, prefer a built-in shorthand if every input has the
same value, variants, important state, and generated CSS semantics. Examples:

```html
<div class="mt-4 mb-4"></div> <!-- my-4 -->
<div class="w-4 h-4"></div> <!-- size-4 -->
<div class="overflow-x-hidden overflow-y-hidden"></div> <!-- overflow-hidden -->
```

Do not combine utilities across different conditions, such as `md:mt-4 mb-4`.
IntelliSense's canonical-class diagnostic currently canonicalizes each class
individually, so do not expect it to suggest class-list combinations.

Prefer a built-in semantic variant over an arbitrary variant only when Tailwind
confirms they generate the same selector. For example, `[@media_print]:flex`
canonicalizes to `print:flex`. Do not infer selector equivalence by inspection
alone.

For new code, use the current canonical utility when Tailwind defines an exact
replacement for a deprecated alias. Representative replacements include
`overflow-ellipsis` → `text-ellipsis` and `start-*` → `inset-s-*`. Existing
project-defined utilities can change which form is canonical, so inspect them
before rewriting a class.

[IntelliSense diagnostic]: https://github.com/tailwindlabs/tailwindcss-intellisense/blob/main/packages/tailwindcss-language-service/src/diagnostics/canonical-classes.ts
[Tailwind core canonicalizer]: https://github.com/tailwindlabs/tailwindcss/blob/main/packages/tailwindcss/src/canonicalize-candidates.ts
[canonicalization tests]: https://github.com/tailwindlabs/tailwindcss/blob/main/packages/tailwindcss/src/canonicalize-candidates.test.ts
[release notes]: https://github.com/tailwindlabs/tailwindcss/releases

## 12. Arbitrary values

Use arbitrary values for exact values outside the project's scale, genuine
one-off constraints, and expressions that need `calc()`. Do not round a precise
design value to a different size just to make it a whole number or a multiple
of four. If an out-of-scale value recurs across the project with the same
semantic purpose, reuse or propose a token only when the task includes
design-system changes; repetition on one page alone is not a reason to add a
global variable.

For typography, prefer Tailwind's semantic type scale (`text-xs`, `text-sm`,
`text-base`, `text-lg`, `text-xl`, and heading sizes) over one-off values such
as `text-[39px]`, `text-[0.5625rem]`, or `text-[0.90625rem]`. Never emit a
long decimal `rem` arbitrary font size. When no design spec is supplied, use a
consistent set of familiar sizes instead of inventing many near-duplicates.
If a custom size must be chosen from scratch, favor a familiar even-numbered
pixel value (for example, 40px rather than 39px) when it fits the intended
hierarchy. Even values are a generation preference, not a CSS requirement;
preserve an exact supplied design size when fidelity matters.

For example, prefer `text-4xl` (36px) over `text-[39px]` when that scale step
fits. For a deliberately small label, prefer `text-xs` (12px) over
`text-[0.5625rem]` (9px); if 10px is explicitly required, write
`text-[10px]`.

For a genuine one-off, use a concise, readable value (for example
`text-[10px]`). If a custom font size recurs across independent components and
has a shared semantic purpose, reuse an existing token or propose a new one
only when the task includes design-system changes. Do not translate pixels into
long decimal rem values in arbitrary classes.

For color opacity modifiers, prefer the percentage form when the alpha is
directly representable. Convert `bg-[#6a80ff]/[0.12]` to
`bg-[#6a80ff]/12`; do not keep brackets around a simple decimal alpha or round
it to a different opacity. Use an arbitrary opacity modifier only for a value
that cannot be expressed clearly as a percentage, a CSS variable, or an
expression.

Good:

```html
<div class="max-h-[80vh]"></div>
<div class="grid-cols-[240px_1fr]"></div>
```

Repeated arbitrary values can signal a missing token, but repetition within a
single page is not enough reason to add a global variable. Confirm that the
value represents shared project-wide semantics first.

## 13. Accessibility

Do not remove visible focus without replacement.

Prefer `focus-visible:*` for keyboard focus styling when appropriate.

Use semantic disabled and ARIA/data states.

## 14. Review order

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
Existing semantic theme token?
        ↓ yes
Consume its utility or CSS variable

Existing Tailwind utility fits?
        ↓ yes
Use utility

Runtime/application value?
        ↓ yes
Use a component-scoped CSS variable

One-off static value outside the utility scale?
        ↓ yes
Use a justified arbitrary value

New shared theme token explicitly requested or established by project convention?
        ↓ yes
Add/use the project-level token

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
