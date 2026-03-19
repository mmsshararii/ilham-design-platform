const fs = require("fs");
const path = require("path");

const rootDir = process.cwd();
const outputFile = "repo.md";

const ignore = ["node_modules", ".git", ".next", "dist", "build"];

function readDirRecursive(dir) {
  let structure = "";
  let filesContent = "";

  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const relativePath = path.relative(rootDir, fullPath);

    if (ignore.some((i) => fullPath.includes(i))) continue;

    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      structure += `📁 ${relativePath}\n`;
      const { structure: subStruct, filesContent: subFiles } =
        readDirRecursive(fullPath);

      structure += subStruct;
      filesContent += subFiles;
    } else {
      structure += `📄 ${relativePath}\n`;

      let content = "";
      try {
        content = fs.readFileSync(fullPath, "utf-8");
      } catch {
        content = "[BINARY FILE]";
      }

      const ext = path.extname(fullPath).replace(".", "") || "txt";

      filesContent += `\n---\n`;
      filesContent += `## FILE: ${relativePath}\n`;
      filesContent += `\`\`\`${ext}\n${content}\n\`\`\`\n`;
    }
  }

  return { structure, filesContent };
}

const { structure, filesContent } = readDirRecursive(rootDir);

const output =
`# PROJECT SNAPSHOT

## 📁 STRUCTURE
${structure}

---

## 📄 FILES
${filesContent}
`;

fs.writeFileSync(outputFile, output);

console.log("✅ تم إنشاء repo.md بنجاح");