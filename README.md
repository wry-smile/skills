# Agent Skills

Reusable agent skills distributed from this repository. Each skill is a
self-contained directory with a `SKILL.md` entry point and any supporting
references or examples.

## Included skills

- [`scada-symbol`](./scada-symbol/SKILL.md) — creates standalone industrial
  SVG symbols for traditional SCADA/HMI interfaces.
- [`tailwindcss-best-practices`](./tailwindcss-best-practices/SKILL.md) —
  cross-framework Tailwind CSS practices, focused on Tailwind CSS 4.

## Install with pnpm

Use the Skills CLI through `pnpm dlx`; the CLI installs skill folders into the
agent's skill directory. From this repository, try a skill locally:

```bash
pnpm dlx skills add . --skill tailwindcss-best-practices --agent codex
```

After this repository is pushed to GitHub, install directly from it:

```bash
pnpm dlx skills add wry-smile/skills --skill tailwindcss-best-practices --agent codex
```

Install both skills by repeating `--skill`, or use `--skill '*'` to install all
skills in the repository:

```bash
pnpm dlx skills add wry-smile/skills \
  --skill scada-symbol \
  --skill tailwindcss-best-practices \
  --agent codex
```

Add `--global` to make the skill available across projects, or omit it to
install into the current project. Use `--list` to inspect skills available
from a source before installing.

## Validate and contribute

Before committing changes, run:

```bash
pnpm validate
```

Keep each skill in its own kebab-case directory and keep its frontmatter
`name` equal to that directory name. Supporting material belongs inside the
skill directory, so it is installed along with `SKILL.md`.

To publish an update, commit and push the changes to this repository. Users can
then install the updated skill from `wry-smile/skills` with the command above.
