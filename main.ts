import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoDir = path.dirname(fileURLToPath(import.meta.url));
const text = fs.readFileSync(path.join(repoDir, "entry.txt"), "utf-8");

function problem(value: string): string | null {
  const letters = Array.from(value);
  if (letters.length === 0) return "empty entry";
  if (letters.length > 100) return "entry is longer than 100 characters";
  if (value.includes("\n") || value.includes("\r")) {
    return "entry must fit on one line";
  }
  if (value !== value.trim()) {
    return "entry must not start or end with whitespace";
  }
  for (const letter of letters) {
    const code = letter.codePointAt(0) as number;
    const hidden =
      code < 0x20 ||
      code === 0x7f ||
      code === 0x00ad ||
      (code >= 0x200b && code <= 0x200f) ||
      (code >= 0x202a && code <= 0x202e) ||
      code === 0x2060 ||
      code === 0xfeff;
    if (hidden) return "entry has a hidden or control character";
  }
  return null;
}

const fault = problem(text);
if (fault !== null) {
  console.error(fault);
  process.exit(1);
}

const target = process.env.MAKEFUN_OUTPUT_DIR ?? path.join(repoDir, "out");
fs.mkdirSync(target, { recursive: true });
fs.writeFileSync(path.join(target, "entry.txt"), text, "utf-8");
process.stdout.write(text);
