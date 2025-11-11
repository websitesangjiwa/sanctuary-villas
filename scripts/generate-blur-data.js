const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const imagesDir = path.join(__dirname, '..', 'public', 'images');
const outputFile = path.join(__dirname, '..', 'lib', 'data', 'blur-data.json');

async function generateBlurDataURL(imagePath) {
  try {
    const buffer = await sharp(imagePath)
      .resize(10, 10, { fit: 'inside' })
      .blur()
      .toBuffer();

    const base64 = buffer.toString('base64');
    return `data:image/jpeg;base64,${base64}`;
  } catch (error) {
    console.error(`Error processing ${imagePath}:`, error.message);
    return null;
  }
}

async function generateBlurData() {
  console.log('🎨 Generating blur placeholders...\n');

  const blurData = {};

  // Get all webp images
  const files = fs.readdirSync(imagesDir)
    .filter(file => file.endsWith('.webp'));

  console.log(`Found ${files.length} WebP images\n`);

  for (const file of files) {
    const imagePath = path.join(imagesDir, file);
    const imageKey = `/images/${file}`;

    console.log(`Processing: ${file}`);
    const blurDataURL = await generateBlurDataURL(imagePath);

    if (blurDataURL) {
      blurData[imageKey] = blurDataURL;
      console.log(`✓ Generated blur data (${blurDataURL.length} bytes)\n`);
    } else {
      console.log(`✗ Failed\n`);
    }
  }

  // Write to JSON file
  fs.writeFileSync(outputFile, JSON.stringify(blurData, null, 2));

  console.log(`\n✅ Blur data saved to ${outputFile}`);
  console.log(`📊 Generated ${Object.keys(blurData).length} blur placeholders`);
}

generateBlurData().catch(console.error);
