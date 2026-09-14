# Tailwind CSS 4 Core Rules

## Important modifier

For new Tailwind CSS 4 code, prefer trailing `!`.

Preferred:

```html
<div class="size-full!"></div>
<div class="flex!"></div>
<div class="text-sm!"></div>
<div class="md:size-full!"></div>
<div class="hover:bg-primary!"></div>
```

Avoid generating the legacy prefix form by default:

```html
<div class="!size-full"></div>
```

Use `!` only when necessary.

Before using it, inspect:

- conflicting Tailwind utilities
- selector specificity
- stylesheet order
- component encapsulation
- third-party styles

Do not solve ordinary layout bugs with important modifiers.

---

## Utility conflicts

Bad:

```html
<div class="flex grid"></div>
<div class="p-2 p-4"></div>
<div class="text-sm text-lg"></div>
```

Keep one effective utility for the same condition.

Variants are separate conditions and are valid:

```html
<div class="grid-cols-1 md:grid-cols-2 xl:grid-cols-4"></div>
```

---

## Prefer Tailwind utilities over recreating utility CSS

Prefer:

```html
<div class="flex items-center justify-center"></div>
```

Avoid:

```css
.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}
```

unless the abstraction has a genuine project-level reason.

---

## Prefer `size-*` when width and height are equal

Prefer:

```html
<div class="size-8"></div>
```

Instead of:

```html
<div class="h-8 w-8"></div>
```

Use separate width and height only when values differ.

---

## Prefer `gap-*`

Prefer:

```html
<div class="flex gap-4"></div>
```

over sibling-margin spacing.

---

## Arbitrary values

Before writing an arbitrary length, check for an equivalent utility on the
Tailwind spacing scale. In v4, numeric spacing utilities are derived from
`--spacing` and support fractional multipliers. With the default
`--spacing: 0.25rem`, `w-2.75` expresses 11px when the root font size is 16px.

Prefer:

```html
<div class="w-2.75"></div>
<div class="size-2.75"></div>
```

instead of equivalent `w-[11px]` or `size-[11px]` arbitrary values.

Arbitrary values remain appropriate for exact values outside the chosen scale,
genuine one-off constraints, or expressions such as `calc()`. Do not round an
exact design value to a different dimension to force it onto a whole number or
a multiple of four. If the same out-of-scale value recurs, consider a named
theme token.

Good:

```html
<div class="max-h-[80vh]"></div>
<div class="grid-cols-[240px_1fr]"></div>
```

Repeated arbitrary values usually indicate a missing token.

If this appears repeatedly:

```text
rounded-[10px]
rounded-[10px]
rounded-[10px]
```

promote it to a design token.

Rule:

> one-off constraint → arbitrary value is acceptable  
> repeated design decision → create a token

---

## Layout

Prefer:

- flex
- grid
- gap
- min/max sizing
- container queries

before:

- absolute positioning
- negative margins
- transforms
- manual pixel offsets

Absolute positioning is appropriate for overlays and intentionally layered UI.

---

## Flex overflow

A common resilient layout:

```html
<div class="flex">
  <aside class="w-64 shrink-0"></aside>

  <main class="min-w-0 flex-1">
    ...
  </main>
</div>
```

For icon/avatar + text:

```html
<div class="flex items-center gap-3">
  <div class="size-8 shrink-0"></div>

  <div class="min-w-0 flex-1">
    <div class="truncate"></div>
  </div>
</div>
```

Do not blindly add `overflow-hidden` to work around incorrect flex sizing.

---

## Responsive design

Use mobile-first classes.

Preferred:

```html
<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4"></div>
```

Only declare values at breakpoints where they change.

Avoid:

```html
<div class="p-4 sm:p-4 md:p-4 lg:p-4"></div>
```

Prefer:

```html
<div class="p-4"></div>
```

---

## Container queries

For reusable components whose layout depends on parent width rather than viewport width, prefer container-query patterns when appropriate.

Especially useful for:

- cards
- dashboards
- split panes
- side panels
- embedded widgets
- low-code designers

---

## Transitions

Prefer targeted transitions:

```text
transition-colors
transition-opacity
transition-transform
transition-shadow
```

Do not automatically use:

```text
transition-all
```

Respect reduced-motion preferences for meaningful motion:

```html
<div class="motion-reduce:transition-none"></div>
```

---

## Focus

Never remove focus visibility without replacing it.

Preferred:

```html
<button
  class="
    focus-visible:outline-none
    focus-visible:ring-2
    focus-visible:ring-primary
  "
>
</button>
```

Use semantic state variants where appropriate:

```text
disabled:
aria-disabled:
aria-expanded:
aria-selected:
data-[state=*]:
```
