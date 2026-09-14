# Tailwind CSS 4 Review Checklist

## Version

- [ ] Tailwind version is understood before refactoring.
- [ ] Tailwind CSS 4 conventions are used where appropriate.
- [ ] Tailwind CSS 3-only configuration was not introduced accidentally.

## Syntax

- [ ] Important utilities use trailing `!` in new v4 code.
- [ ] No unnecessary important modifiers.
- [ ] No duplicate or conflicting utilities.

## CSS variables

- [ ] Simple CSS variables use `property-(--variable)` shorthand.
- [ ] `text-[var(--x)]` is not used when `text-(--x)` is clearer.
- [ ] Semantic Tailwind tokens are preferred when they already exist.
- [ ] Runtime values use CSS variables rather than runtime class construction.
- [ ] Theme tokens and runtime variables have clear ownership.
- [ ] An equivalent spacing-scale utility was considered before using an arbitrary length.
- [ ] Exact design dimensions were not rounded just to match a preferred increment.
- [ ] Typography uses the project's semantic type scale where possible.
- [ ] Repeated custom font sizes use semantic theme tokens instead of scattered arbitrary values.
- [ ] Odd or unusually precise font sizes are intentional, not incidental generated values.
- [ ] Custom font sizes chosen without a design spec favor familiar even-pixel values when suitable.

## Static detection

- [ ] No `bg-${color}-500`.
- [ ] No `grid-cols-${count}`.
- [ ] No `w-[${width}px]`.
- [ ] Complete Tailwind class strings exist statically in source.
- [ ] Component variant APIs are finite.

## VS Code

- [ ] Tailwind CSS IntelliSense is configured appropriately.
- [ ] `cn`, `clsx`, and `cva` are registered when used.
- [ ] Framework-specific class attributes and bindings are recognized when needed.
- [ ] Framework-specific component metadata contexts are recognized when used.
- [ ] Tailwind v4 CSS entrypoints are mapped correctly in monorepos.
- [ ] Experimental regex configuration is minimal and targeted.

## Layout

- [ ] Uses flex/grid before positional hacks.
- [ ] Uses `gap-*` for sibling spacing where appropriate.
- [ ] Uses `size-*` when width and height match.
- [ ] Flexible content uses `min-w-0` where necessary.
- [ ] Fixed icons/avatars/actions use `shrink-0` intentionally.
- [ ] Overflow is solved structurally rather than blindly hidden.

## Responsive

- [ ] Mobile-first.
- [ ] No duplicated breakpoint values.
- [ ] Responsive variants are only added when behavior changes.
- [ ] Container queries are considered for reusable components.

## Accessibility

- [ ] Keyboard focus remains visible.
- [ ] Disabled state is semantic.
- [ ] ARIA/data state matches visual state.
- [ ] Motion respects reduced-motion preferences.

## Maintainability

- [ ] Arbitrary values are justified.
- [ ] Repeated design values are promoted to tokens.
- [ ] No deep arbitrary selectors without justification.
- [ ] Repeated UI structure is extracted as a component where appropriate.
- [ ] `@apply` is not used as a replacement for component architecture.
