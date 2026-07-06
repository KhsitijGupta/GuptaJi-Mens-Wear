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
  if (file.endsWith(path.join("utils", "api.js"))) continue;
  const text = fs.readFileSync(file, "utf8");
  if (!importRegex.test(text)) continue;

  let updated = false;
  let newText = text.replace(importRegex, "import api from '@/utils/api';");
  if (newText !== text) {
    updated = true;
  }

  if (updated) {
    newText = newText
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
  }

  if (newText !== text) {
    fs.writeFileSync(file, newText, "utf8");
    changed.push(path.relative(__dirname, file));
  }
}

console.log("Updated files:", changed.length);
for (const file of changed) {
  console.log(file);
}
