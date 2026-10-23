import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(__dirname, '../public');

async function compressPng(filename, quality = 80, maxWidth = 1200, colours = 256) {
  const filepath = path.join(publicDir, filename);
  if (!fs.existsSync(filepath)) {
    console.log(`File not found: ${filename}`);
    return;
  }
  
  const statsBefore = fs.statSync(filepath);
  const sizeBeforeKB = (statsBefore.size / 1024).toFixed(2);
  
  const tempPath = path.join(publicDir, `temp-${filename}`);
  
  try {
    // Read the file, resize and compress it, write to temp path
    await sharp(filepath)
      .resize({ width: maxWidth, withoutEnlargement: true })
      .png({ quality: quality, compressionLevel: 9, effort: 10, palette: true, colours: colours })
      .toFile(tempPath);
      
    // Replace original file with compressed one
    fs.renameSync(tempPath, filepath);
    
    const statsAfter = fs.statSync(filepath);
    const sizeAfterKB = (statsAfter.size / 1024).toFixed(2);
    
    // Also generate webp version for modern browsers
    const webpPath = filepath.replace(/\.png$/, '.webp');
    await sharp(filepath)
      .webp({ quality: 80, effort: 6 })
      .toFile(webpPath);
    const webpSizeKB = (fs.statSync(webpPath).size / 1024).toFixed(2);
    
    console.log(`✓ Compressed ${filename}: ${sizeBeforeKB} KB → ${sizeAfterKB} KB (WebP: ${webpSizeKB} KB)`);
  } catch (error) {
    console.error(`Error compressing ${filename}:`, error);
    if (fs.existsSync(tempPath)) {
      fs.unlinkSync(tempPath);
    }
  }
}

async function run() {
  console.log('Starting static asset compression...');
  await compressPng('world_cup_blog_thumbnail.png', 65, 960, 128);
  await compressPng('og-image.png', 70, 1200, 128);
  await compressPng('twitter-image.png', 70, 1200, 128);
  await compressPng('Untitled design.png', 70, 800, 128);
  console.log('Compression process finished!');
}

run();
