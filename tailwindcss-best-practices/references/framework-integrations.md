# Framework Integrations

Tailwind's utility generation rules are shared across frameworks. Framework
syntax changes how classes are bound, but it does not make runtime-generated
utility names detectable. Follow the host framework's conventions and inspect
the existing project before adding helpers or editor configuration.

## Shared patterns

- Keep complete utility names in source code.
- Use finite maps for finite visual variants.
- Bind runtime dimensions and colors through CSS custom properties.
- Prefer the project's established class-composition and conflict-merging
  helpers when present.
- Keep component internals owned by the component; let parents control
  placement and available space.
- Keep Tailwind source detection and editor support aligned with the actual
  source files and class-string patterns in the project.

## React and JSX

Use `className` and ordinary conditional composition, with full utility names
present in source:

```tsx
const statusClasses = {
  success: 'bg-green-600 text-white',
  warning: 'bg-amber-300 text-black',
  error: 'bg-red-600 text-white',
} as const

<div className={statusClasses[status]} />
```

Avoid constructing utility fragments inside template strings:

```tsx
<div className={`bg-${color}-600`} />
```

For runtime style values, keep the utility static and set a custom property:

```tsx
<div
  style={{ '--panel-width': `${width}px` } as React.CSSProperties}
  className="w-(--panel-width)"
/>
```

Use the project's existing `cn`, `clsx`, `cva`, or Tailwind-aware merge helper.
Do not add a dependency only to combine a few class strings.

## Vue

Use Vue's normal class bindings with full utility names in the template or
script:

```vue
<div
  :class="[
    'rounded-md border p-4',
    active ? 'border-primary bg-surface' : 'border-muted'
  ]"
></div>
```

For a finite set of variants, map values to complete class strings. For truly
runtime dimensions or colors, bind CSS custom properties rather than building
arbitrary utility names:

```vue
<div :style="{ '--panel-width': `${width}px` }" class="w-(--panel-width)"></div>
```

## Svelte

Use `class` directives for simple boolean states when that is the clearest
idiom, and keep class names complete and statically visible:

```svelte
<div class="rounded-md border p-4" class:border-primary={selected}>
</div>
```

For multiple related variants, use a finite map or the project's established
class helper. Bind runtime values through CSS custom properties instead of
creating utility strings at runtime.

## Angular

For a small number of boolean states, prefer direct class bindings:

```html
<div
  class="rounded-md border p-4"
  [class.border-primary]="selected()"
  [class.bg-surface]="selected()"
></div>
```

For multiple related variants, map values to complete static strings. Use
`[ngClass]` when it makes the template clearer; prefer `[class.foo]` for one or
two booleans. Signals and template expressions do not change static detection
rules.

Static host metadata is also a valid place for classes:

```ts
@Component({
  host: { class: 'flex size-full min-h-0 flex-col' },
})
export class ShellComponent {}
```

If IntelliSense misses host metadata, use a narrow, tested regex. Treat
Angular Material as a component boundary: use its theming APIs for Material
internals and Tailwind for surrounding layout. Avoid selectors coupled to
unstable internal DOM when a supported API exists.

## Third-party component libraries

Treat a library's supported styling and theming API as the primary boundary.
Use Tailwind for surrounding layout and application-owned components. Reach
into library internals only when the library exposes no suitable API and the
selector can be kept stable and narrowly scoped.
