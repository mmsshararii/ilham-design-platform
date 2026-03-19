const fs = require('fs');
const path = require('path');

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  if (content.includes('&lt;') || content.includes('&gt;')) {
    content = content
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>');

    fs.writeFileSync(filePath, content);
    console.log('✔ Fixed:', filePath);
  }
}

function walk(dir) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      walk(fullPath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      fixFile(fullPath);
    }
  });
}

walk('./features');
walk('./app');

console.log('🔥 DONE');