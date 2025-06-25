const fs = require('fs');
const path = require('path');

const outputFile = 'arborescence.txt';
const allowedExtensions = ['.js', '.css', '.html', '..env'];
const excludedDirs = ['node_modules', '.git', 'dist', 'build', 'vendor', 'var'];

function walk(dir, prefix = '') {
  const items = fs.readdirSync(dir);

  items.forEach((item, index) => {
    const fullPath = path.join(dir, item);
    const isLast = index === items.length - 1;
    const stats = fs.statSync(fullPath);
    const connector = isLast ? '└── ' : '├── ';
    const newPrefix = prefix + (isLast ? '    ' : '│   ');

    if (stats.isDirectory()) {
      if (!excludedDirs.includes(item)) {
        fs.appendFileSync(outputFile, `${prefix}${connector}${item}/\n`);
        walk(fullPath, newPrefix);
      }
    } else if (allowedExtensions.includes(path.extname(item))) {
      fs.appendFileSync(outputFile, `${prefix}${connector}${item}\n`);
    }
  });
}

// Nettoyer le fichier existant
fs.writeFileSync(outputFile, '');
walk('.');
console.log(`✅ Arborescence enregistrée dans ${outputFile}`);
