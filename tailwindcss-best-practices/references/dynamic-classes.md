# Dynamic Tailwind Classes

## Core rule

Tailwind scans source code as text.

Never dynamically construct part of a Tailwind utility name.

Bad:

```ts
const className = `bg-${color}-500`
```

Bad:

```ts
const className = `grid-cols-${columns}`
```

Bad Angular template binding:

```html
<div [class]="'bg-' + color + '-500'"></div>
```

Bad React:

```tsx
<div className={`text-${size}`} />
```

---

## Complete class maps

Prefer complete class strings.

```ts
const colorClasses = {
  success: 'bg-green-500 text-white',
  warning: 'bg-amber-500 text-black',
  error: 'bg-red-500 text-white',
} as const
```

This keeps all Tailwind utilities statically detectable.

---

## Runtime values

If the value itself is truly dynamic, use CSS variables.

Bad:

```ts
const widthClass = `w-[${width}px]`
```

Preferred Angular:

```html
<div
  [style.--width.px]="width"
  class="w-(--width)"
></div>
```

Preferred React:

```tsx
<div
  style={{ '--width': `${width}px` } as React.CSSProperties}
  className="w-(--width)"
/>
```

Preferred Vue:

```vue
<div
  :style="{ '--width': `${width}px` }"
  class="w-(--width)"
/>
```

---

## Finite component variants

Prefer finite APIs.

```ts
type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger'
```

Map variants to complete utility strings.

Avoid APIs that eventually build class names from arbitrary values:

```ts
color: string
size: string
radius: string
```

---

## Safelisting

Do not use safelisting to compensate for poor dynamic-class architecture.

Reserve explicit source inclusion/safelisting for genuine boundaries such as:

- external content
- CMS markup
- generated markup outside normal source scanning
- known third-party integration cases

If the classes are controlled by application state, prefer finite class maps.
