# VS Code Tailwind CSS IntelliSense

Tailwind development experience is part of project quality.

When working in a VS Code project, inspect:

```text
.vscode/settings.json
```

Do not overwrite unrelated editor settings.

---

## Recommended baseline

```json
{
  "files.associations": {
    "*.css": "tailwindcss"
  },

  "editor.quickSuggestions": {
    "strings": "on"
  },

  "tailwindCSS.classFunctions": [
    "cn",
    "clsx",
    "cva"
  ],

  "tailwindCSS.classAttributes": [
    "class",
    "className",
    "ngClass"
  ]
}
```

---

## classFunctions

Use `tailwindCSS.classFunctions` for functions whose arguments contain complete Tailwind class strings.

Recommended common helpers when present in the project:

```json
{
  "tailwindCSS.classFunctions": [
    "cn",
    "clsx",
    "cva"
  ]
}
```

This improves IntelliSense in:

```ts
cn('flex items-center gap-2')
```

```ts
clsx('flex', active && 'bg-primary')
```

```ts
cva('inline-flex items-center', {
  variants: {}
})
```

Do not register arbitrary application functions unless they actually represent Tailwind class-string contexts.

---

## classAttributes

Common attributes can be made explicit:

```json
{
  "tailwindCSS.classAttributes": [
    "class",
    "className"
  ]
}
```

Include only attributes used by the project. `className` is common in JSX;
framework-specific attributes such as Angular's `ngClass` belong only in
projects that use them and need explicit recognition.

This documents repository conventions even when the extension already supports some of these by default.

---

## Tailwind CSS 4 entrypoints

For monorepos, multi-application repositories, or ambiguous source trees, explicitly associate a CSS entrypoint with the source tree.

Example:

```json
{
  "tailwindCSS.experimental.configFile": {
    "modules/web-test/src/styles.css": "modules/web-test/src/**"
  }
}
```

Multiple applications:

```json
{
  "tailwindCSS.experimental.configFile": {
    "apps/admin/src/styles.css": "apps/admin/src/**",
    "apps/portal/src/styles.css": "apps/portal/src/**",
    "packages/ui/src/styles.css": "packages/ui/src/**"
  }
}
```

Single application:

```json
{
  "tailwindCSS.experimental.configFile": "src/styles.css"
}
```

Do not add explicit mapping when automatic detection already works reliably unless the repository prefers explicit configuration.

## Canonical class suggestions

The official Tailwind CSS IntelliSense extension's
`tailwindCSS.lint.suggestCanonicalClasses` rule asks Tailwind CSS 4 core to
canonicalize each class individually, using the detected design system and the
extension's configured `rootFontSize`. Treat a suggestion as a useful
normalization signal when the project configuration makes the generated CSS
equivalent. For example, `h-[50px]` can become `h-12.5` when the active
`--spacing` and `rem` context make them equivalent.

Do not infer equivalence from arithmetic alone or assume default spacing/root
font settings. Keep an arbitrary value when no exact canonical form exists.
This diagnostic currently checks classes one at a time; it does not suggest
class-list combinations such as `w-4 h-4` → `size-4`. Keep the project's
existing lint setting unless the user explicitly asks to change policy:

```json
{
  "tailwindCSS.lint.suggestCanonicalClasses": "warning"
}
```

---

## Angular host metadata

Angular frequently defines static host classes in component metadata:

```ts
@Component({
  host: {
    class: 'flex size-full flex-col overflow-hidden',
  },
})
export class ExampleComponent {}
```

If IntelliSense does not recognize this context, configure a targeted regex:

```json
{
  "tailwindCSS.experimental.classRegex": [
    [
      "host\\s*:\\s*\\{[\\s\\S]*?class\\s*:\\s*['\"`]([^'\"`]*)['\"`]",
      "([^\\s]+)"
    ]
  ]
}
```

Keep custom regexes narrow and documented.

Prefer `classFunctions` when the problem can be solved by `classFunctions`.

Treat `experimental.classRegex` as a last-mile integration mechanism.

---

## Suggested Angular monorepo configuration

```json
{
  "files.associations": {
    "*.css": "tailwindcss"
  },

  "editor.quickSuggestions": {
    "strings": "on"
  },

  "tailwindCSS.classFunctions": [
    "cn",
    "clsx",
    "cva"
  ],

  "tailwindCSS.classAttributes": [
    "class",
    "className",
    "ngClass"
  ],

  "tailwindCSS.experimental.configFile": {
    "modules/web-test/src/styles.css": "modules/web-test/src/**"
  },

  "tailwindCSS.experimental.classRegex": [
    [
      "host\\s*:\\s*\\{[\\s\\S]*?class\\s*:\\s*['\"`]([^'\"`]*)['\"`]",
      "([^\\s]+)"
    ]
  ]
}
```

---

## Troubleshooting

When completion or linting does not work:

1. Verify Tailwind CSS exists in workspace dependencies.
2. Verify the v4 CSS entrypoint imports Tailwind.
3. Verify `.css` is associated with the Tailwind CSS language mode when needed.
4. Check `tailwindCSS.experimental.configFile`.
5. Check monorepo source mapping.
6. Open `Tailwind CSS: Show Output`.
7. Verify custom class helper functions are registered.
8. Verify Angular host/template contexts.
9. Keep custom regexes minimal.
