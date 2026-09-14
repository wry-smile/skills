import { readFile } from "node:fs/promises";
import { readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const root = fileURLToPath(new URL("..", import.meta.url));
const entries = await readdir(root, { withFileTypes: true });
const skillDirs = entries.filter(
  (entry) => entry.isDirectory() && !entry.name.startsWith(".") && entry.name !== "scripts",
);

if (skillDirs.length === 0) {
  throw new Error("No skill directories found.");
}

for (const dir of skillDirs) {
  const skillPath = join(root, dir.name, "SKILL.md");
  const source = await readFile(skillPath, "utf8");
  if (!source.startsWith("---\n")) throw new Error(`${dir.name}: missing YAML frontmatter`);
  const frontmatter = source.slice(4, source.indexOf("\n---", 4));
  for (const field of ["name:", "description:"]) {
    if (!frontmatter.includes(`\n${field}`) && !frontmatter.startsWith(field)) {
      throw new Error(`${dir.name}: missing ${field}`);
    }
  }
  if (!/^[a-z0-9-]+$/.test(dir.name)) throw new Error(`${dir.name}: invalid directory name`);
  console.log(`✓ ${dir.name}`);
}
