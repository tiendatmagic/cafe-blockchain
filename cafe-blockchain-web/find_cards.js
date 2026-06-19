const fs = require('fs');
const path = require('path');

const appDir = path.join(__dirname, 'src', 'app');
const htmlFilesWithCards = [];

function walk(dir) {
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      walk(fullPath);
    } else if (file.endsWith('.html')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const cnMatches = content.match(/class="[^"]*app-card(?!\-interactive)[^"]*"/g) || [];
      const ciMatches = content.match(/class="[^"]*app-card-interactive[^"]*"/g) || [];
      if (cnMatches.length > 0 || ciMatches.length > 0) {
        htmlFilesWithCards.push({
          path: fullPath,
          cn: cnMatches.length,
          ci: ciMatches.length
        });
      }
    }
  });
}

walk(appDir);

console.log(`Total HTML files found: ${htmlFilesWithCards.length}`);
htmlFilesWithCards.sort((a, b) => a.path.localeCompare(b.path)).forEach(item => {
  const relPath = path.relative(appDir, item.path);
  console.log(`- ${relPath} (app-card: ${item.cn}, app-card-interactive: ${item.ci})`);
});
