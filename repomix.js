const fs = require("fs");
const path = require("path");

const rootDir = process.cwd();
const outputFile = "repomix-output.xml";

const ignore = ["node_modules", ".git", ".next", "dist", "build"];

function readDirRecursive(dir) {
  let result = "";

  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const relativePath = path.relative(rootDir, fullPath);

    if (ignore.some((i) => fullPath.includes(i))) continue;

    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      result += `<folder path="${relativePath}">\n`;
      result += readDirRecursive(fullPath);
      result += `</folder>\n`;
    } else {
      let content = "";

      try {
        content = fs.readFileSync(fullPath, "utf-8")
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;");
      } catch {
        content = "[BINARY FILE]";
      }

      result += `<file path="${relativePath}">\n`;
      result += `<![CDATA[\n${content}\n]]>\n`;
      result += `</file>\n`;
    }
  }

  return result;
}

const xml =
  `<?xml version="1.0" encoding="UTF-8"?>\n<project>\n` +
  readDirRecursive(rootDir) +
  `</project>`;

fs.writeFileSync(outputFile, xml);

console.log("✅ تم إنشاء repomix-output.xml");