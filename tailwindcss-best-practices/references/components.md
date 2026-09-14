# Tailwind Component Patterns

## Abstraction order

Prefer:

```text
Utilities
    ↓
Reusable component
    ↓
Finite variants
    ↓
@utility
    ↓
Custom CSS
```

---

## Extract components before extracting CSS

If the same UI structure is repeated, prefer a component abstraction.

Avoid moving whole UI components into `@apply` classes by default.

Bad architectural direction:

```css
.btn-primary {
  @apply inline-flex items-center rounded-md px-4 py-2;
}
```

when the project can define a real Button component that also owns:

- accessibility
- loading state
- icons
- variants
- disabled behavior

---

## Use `@utility` for utility-level behavior

Good:

```css
@utility scrollbar-none {
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
}
```

Bad:

```css
@utility user-management-card {
  ...
}
```

A user-management card is a component, not a utility.

---

## Finite component variants

Prefer finite public APIs.

```ts
type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger'
```

Avoid exposing low-level Tailwind implementation details:

```ts
padding = input<string>()
background = input<string>()
textColor = input<string>()
```

Prefer semantic APIs:

```ts
variant = input<ButtonVariant>('primary')
size = input<ButtonSize>('md')
```

---

## Class merging

When a reusable component accepts consumer-provided classes, use the repository's established Tailwind-aware class merging utility if one exists.

Do not introduce a new dependency solely to normalize a small class string.

Do not assume plain concatenation resolves conflicting Tailwind utilities.

---

## Deep arbitrary selectors

Use arbitrary selectors deliberately:

```html
<div class="[&>svg]:size-4"></div>
```

Avoid coupling to deep internal DOM structure:

```text
[&>div>div:nth-child(2)>span>svg]:...
```

If selectors become deeply structural, reconsider the component boundary.

---

## `@apply`

Use `@apply` sparingly.

Good use cases:

- third-party markup that cannot be modified
- legacy HTML
- integration boundaries
- small framework-specific CSS overrides

Do not make `@apply` the default authoring style for Tailwind applications.
