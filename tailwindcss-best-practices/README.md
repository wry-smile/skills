# Tailwind CSS Best Practices Skill

A reusable, cross-framework Agent Skill for Tailwind CSS projects. Its
recommendations focus on Tailwind CSS 4; check the project's installed version
before applying version-specific syntax.

## Structure

```text
tailwindcss-best-practices/
├── SKILL.md
├── README.md
├── references/
│   ├── components.md
│   ├── core-rules.md
│   ├── dynamic-classes.md
│   ├── framework-integrations.md
│   ├── review-checklist.md
│   ├── theme-and-variables.md
│   └── vscode-intellisense.md
└── examples/
    ├── styles.css
    ├── theme.css
    └── vscode-settings.json
```

## Usage

Place this directory in the skill directory used by your Agent/Codex environment.

The Agent should start from `SKILL.md` and open the relevant files under `references/` as needed.

## Focus

This skill emphasizes:

- Tailwind CSS 4 CSS-first configuration
- trailing important modifier syntax
- CSS custom-property shorthand
- static class detection
- runtime CSS variables
- VS Code Tailwind CSS IntelliSense
- framework integration patterns for Angular, React, Vue, Svelte, and UI libraries
- semantic theme tokens
- maintainable component abstractions
- code review rules

Version-specific recommendations in `SKILL.md` and the references target
Tailwind CSS 4.x. For older projects, preserve the installed major version's
syntax and configuration conventions.
