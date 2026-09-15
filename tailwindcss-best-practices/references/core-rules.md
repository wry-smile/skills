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
a multiple of four. If the same out-of-scale value recurs across independent
components, confirm that it represents shared project-wide semantics before
proposing a named theme token.

Good:

```html
<div class="max-h-[80vh]"></div>
<div class="grid-cols-[240px_1fr]"></div>
```

Repeated arbitrary values can indicate a missing token, but repetition by
itself is not enough to create a global token. Check that the values express the
same semantic decision and are reused across the project; otherwise keep them
as local component styles or justified one-off utilities.

If this appears repeatedly:

```text
rounded-[10px]
rounded-[10px]
rounded-[10px]
```

consider a design token only when it represents a shared project-level
decision, not merely because the value repeats within one page.

Rule:

> one-off constraint → arbitrary value is acceptable  
> confirmed shared project-level design decision → use or propose a token

### Font sizes

Prefer the project's semantic type scale and Tailwind's built-in `text-*`
utilities over one-off values such as `text-[39px]`, `text-[0.5625rem]`, or
`text-[0.90625rem]`. Never emit a long decimal `rem` arbitrary font size.
When no design spec is supplied, use a small, consistent
set of familiar sizes instead of inventing many near-duplicate values. If a
custom size must be chosen from scratch, favor a familiar even-numbered pixel
value (for example, 40px rather than 39px) when it fits the intended hierarchy.
Even values are a generation preference, not a CSS requirement; preserve an
exact supplied design size when fidelity matters.

For example, use `text-4xl` (36px) instead of `text-[39px]` when that scale
step fits. For a deliberately small label, prefer `text-xs` (12px) over
`text-[0.5625rem]` (9px); if 10px is explicitly required, write
`text-[10px]`.

For a genuine one-off, use a concise value such as `text-[10px]`. If the same
custom font size recurs, define a semantic typography token with `@theme`
(`--text-*`) and use the generated class. Avoid long decimal rem values in
arbitrary class names.

### Color opacity modifiers

Use Tailwind's slash opacity modifier with a percentage for simple alpha
values. For example, `bg-[#6a80ff]/[0.12]` should be written as
`bg-[#6a80ff]/12`. The percentage form is shorter and communicates the same
12% alpha. Preserve the exact alpha rather than rounding it; use a decimal or
CSS-variable form only when the value is not clearly expressible as a simple
percentage.

### Rem lengths and spacing utilities

When an arbitrary `rem` length matches Tailwind v4's active spacing scale,
write the equivalent numeric utility. With the default `--spacing: 0.25rem`,
`w-[1.8125rem]` is equivalent to `w-7.25`; use the same conversion for other
spacing-based dimensions such as `h-*`, `p-*`, and `gap-*` when applicable.
Preserve supplied or already-chosen dimensions exactly through the equivalent
scale utility. When choosing from scratch, prefer familiar even-pixel sizes
instead of inventing fractional dimensions; for example, choose `w-7` (28px)
or `w-7.5` (30px) based on the layout.

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
