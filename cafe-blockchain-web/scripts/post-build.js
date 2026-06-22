const fs = require('fs');
const path = require('path');

function getFolderSize(dirPath) {
  let size = 0;
  try {
    const files = fs.readdirSync(dirPath);
    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const stats = fs.statSync(filePath);
      if (stats.isDirectory()) {
        size += getFolderSize(filePath);
      } else {
        size += stats.size;
      }
    }
  } catch (err) {
    console.error(`Error reading directory ${dirPath}:`, err);
  }
  return size;
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = 2;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function run() {
  console.log('Calculating web build size...');
  // Đường dẫn đến thư mục build output của Angular
  const distPath = path.join(__dirname, '../dist');
  
  if (!fs.existsSync(distPath)) {
    console.log('Dist folder not found. Skipping build size calculation.');
    return;
  }

  // Đo dung lượng toàn bộ thư mục dist
  const totalSizeRaw = getFolderSize(distPath);
  const formattedSize = formatBytes(totalSizeRaw);
  console.log(`Calculated build size: ${formattedSize}`);

  const metadata = {
    size: formattedSize,
    builtAt: new Date().toISOString()
  };

  // Đường dẫn lưu file build-size.json trong browser/assets của Angular output
  const outputDirs = [
    path.join(__dirname, '../dist/cafe-blockchain-web/browser/assets'),
    path.join(__dirname, '../dist/cafe-blockchain-web/assets'),
    path.join(__dirname, '../public/assets') // Ghi thêm vào public/assets để dự phòng và hỗ trợ dev server
  ];

  outputDirs.forEach(dir => {
    try {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      const filePath = path.join(dir, 'build-size.json');
      fs.writeFileSync(filePath, JSON.stringify(metadata, null, 2));
      console.log(`Successfully wrote build size metadata to: ${filePath}`);
    } catch (err) {
      console.warn(`Could not write build size to ${dir}:`, err.message);
    }
  });
}

run();
