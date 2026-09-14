# Theme and CSS Variables

## CSS-first theme configuration

Prefer Tailwind CSS 4 CSS-first configuration.

```css
@theme {
  --color-primary: oklch(0.58 0.18 250);
  --color-danger: oklch(0.58 0.22 25);
}
```

Do not introduce JavaScript configuration solely for theme values unless the project already requires it.

---

## CSS variable shorthand

For simple CSS custom-property values, prefer Tailwind CSS 4 shorthand.

Preferred:

```html
<div class="text-(--app-muted)"></div>
<div class="bg-(--app-surface)"></div>
<div class="border-(--app-border)"></div>
<div class="fill-(--app-icon)"></div>
<div class="stroke-(--app-icon)"></div>
<div class="w-(--sidebar-width)"></div>
```

Avoid verbose equivalents when shorthand is sufficient:

```html
<div class="text-[var(--app-muted)]"></div>
<div class="w-[var(--sidebar-width)]"></div>
```

Use arbitrary expressions when the value is actually an expression:

```html
<div class="w-[calc(var(--sidebar-width)+1rem)]"></div>
```

---

## Semantic token vs raw CSS variable

If a semantic Tailwind token exists, prefer the semantic utility.

Given:

```css
@theme inline {
  --color-muted: var(--app-muted);
}
```

Prefer:

```html
<span class="text-muted"></span>
```

over:

```html
<span class="text-(--app-muted)"></span>
```

Decision rule:

```text
Existing semantic Tailwind token
        ↓
text-muted

No semantic token, but CSS variable exists
        ↓
text-(--app-muted)

Complex expression
        ↓
text-[...]
```

Do not convert semantic design-system usage into raw CSS-variable usage without reason.

---

## Runtime values

For runtime values from JavaScript or framework state, prefer CSS variables plus static Tailwind utilities.

Pattern:

```text
Application runtime value
        ↓
CSS custom property
        ↓
Static Tailwind utility
```

Example:

```html
<div
  style="--panel-width: 320px"
  class="w-(--panel-width)"
></div>
```

This is preferable to constructing arbitrary utility strings at runtime.

---

## Framework runtime values

Bind runtime values using the framework's normal inline-style or custom-property
binding syntax. For example, Angular:

```html
<aside
  [style.--sidebar-width.px]="sidebarWidth()"
  class="w-(--sidebar-width)"
></aside>
```

Avoid constructing Tailwind utility names at runtime in any framework:

```ts
computed(() => `w-[${sidebarWidth()}px]`)
```

---

## Theme tokens vs runtime variables

Use `@theme` when a value should participate in Tailwind utility generation.

```css
@theme {
  --color-brand: oklch(0.62 0.18 250);
}
```

Then:

```html
<div class="bg-brand"></div>
```

Use normal CSS variables for runtime application state:

```css
:root {
  --sidebar-width: 280px;
}
```

Then:

```html
<aside class="w-(--sidebar-width)"></aside>
```

---

## Semantic application tokens

Prefer semantic names in application code:

```text
primary
primary-foreground
secondary
secondary-foreground
background
foreground
surface
surface-container
surface-container-high
muted
muted-foreground
border
outline
danger
warning
success
info
```

Avoid application-facing token names such as:

```text
blue-button
gray-card
dark-gray
red-error
```

unless the color itself is the semantic meaning.

---

## Runtime theme architecture

Recommended pattern:

```css
:root {
  --app-primary: oklch(0.55 0.18 250);

  --app-background: oklch(0.985 0 0);
  --app-foreground: oklch(0.2 0 0);

  --app-surface: oklch(1 0 0);
  --app-surface-container: oklch(0.97 0 0);

  --app-muted: oklch(0.55 0 0);
  --app-border: oklch(0.9 0 0);
}

[data-theme="dark"] {
  --app-background: oklch(0.16 0 0);
  --app-foreground: oklch(0.95 0 0);

  --app-surface: oklch(0.2 0 0);
  --app-surface-container: oklch(0.24 0 0);

  --app-muted: oklch(0.7 0 0);
  --app-border: oklch(0.32 0 0);
}

@theme inline {
  --color-primary: var(--app-primary);

  --color-background: var(--app-background);
  --color-foreground: var(--app-foreground);

  --color-surface: var(--app-surface);
  --color-surface-container: var(--app-surface-container);

  --color-muted: var(--app-muted);
  --color-border: var(--app-border);
}
```

Application components can remain semantic:

```html
<div class="bg-surface text-foreground"></div>
```

---

## Naming

Runtime/application variables should generally use an application namespace:

```text
--app-primary
--app-surface
--app-muted
--app-sidebar-width
```

Tailwind theme variables should follow Tailwind namespaces:

```text
--color-*
--spacing-*
--radius-*
--font-*
--breakpoint-*
```

Do not put unrelated runtime variables into `@theme`.
