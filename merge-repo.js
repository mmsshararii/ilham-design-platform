const fs = require("fs");

const smartFile = "smart-repo.md";
const repoFile = "repo.md";
const outputFile = "final-repo.md";

try {
  const smartContent = fs.readFileSync(smartFile, "utf-8");
  const repoContent = fs.readFileSync(repoFile, "utf-8");

  const finalContent = `# 🧠 PROJECT INTELLIGENCE FILE

---

# 📊 ARCHITECTURE (الفهم)

${smartContent}

---

# 💻 SOURCE CODE (الكود)

${repoContent}
`;

  fs.writeFileSync(outputFile, finalContent);

  console.log("✅ تم إنشاء final-repo.md تلقائيًا");
} catch (err) {
  console.error("❌ خطأ:", err.message);
}