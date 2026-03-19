const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const OUTPUT = "smart-repo.md";

const IGNORE = ["node_modules", ".next", ".git"];

let result = `# 🧠 SMART PROJECT ANALYSIS\n\n`;

function walk(dir) {
  let files = fs.readdirSync(dir);

  files.forEach(file => {
    const fullPath = path.join(dir, file);

    if (IGNORE.some(i => fullPath.includes(i))) return;

    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      walk(fullPath);
    } else {
      analyzeFile(fullPath);
    }
  });
}

function analyzeFile(filePath) {
  const ext = path.extname(filePath);
  if (![".ts", ".tsx", ".js"].includes(ext)) return;

  const content = fs.readFileSync(filePath, "utf-8");

  const imports = [...content.matchAll(/import\s+.*?from\s+['"](.*?)['"]/g)]
    .map(m => m[1]);

  const usesSupabase = content.includes("supabase");
  const isComponent = content.includes("export default function");
  const isHook = filePath.includes("hooks");

  result += `## 📄 ${filePath.replace(ROOT, "")}\n\n`;

  if (imports.length) {
    result += `🔗 **Imports:**\n`;
    imports.forEach(i => result += `- ${i}\n`);
  }

  if (usesSupabase) {
    result += `🗄 **Uses Supabase**\n`;
  }

  if (isComponent) {
    result += `🧩 **React Component**\n`;
  }

  if (isHook) {
    result += `🪝 **Custom Hook**\n`;
  }

  result += `\n---\n\n`;
}

walk(ROOT);

fs.writeFileSync(OUTPUT, result);

console.log("✅ تم إنشاء الملف:", OUTPUT);