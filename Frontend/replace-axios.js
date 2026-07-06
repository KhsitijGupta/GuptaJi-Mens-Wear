const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "src");
const files = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === ".git") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
    } else if (/\.(js|jsx)$/.test(entry.name)) {
      files.push(full);
    }
  }
}

walk(root);

const importRegex = /^\s*import\s+axios\s+from\s+['\"]axios['\"];/m;
const changed = [];

for (const file of files) {
  if (file.endsWith("utils" + path.sep + "api.js")) continue;
  const text = fs.readFileSync(file, "utf8");
  if (!importRegex.test(text)) continue;

  const newText = text.replace(importRegex, "import api from '@/utils/api';");
  const finalText = newText
    .split("\n")
    .map((line) => {
      const trimmed = line.trim();
      if (
        trimmed.startsWith("//") ||
        trimmed.startsWith("/*") ||
        trimmed.startsWith("*")
      ) {
        return line;
      }
      return line.replace(/axios\./g, "api.").replace(/axios\(/g, "api(");
    })
    .join("\n");

  if (finalText !== text) {
    fs.writeFileSync(file, finalText, "utf8");
    changed.push(path.relative(__dirname, file));
  }
}

console.log("Updated files:", changed.length);
for (const f of changed) console.log(f);
