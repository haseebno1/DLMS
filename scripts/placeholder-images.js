import { createCanvas } from 'canvas';
import fs from 'fs';
import path from 'path';

// This script generates placeholder images for testing purposes
// Run with: node scripts/placeholder-images.js
// Requires the 'canvas' package: npm install canvas

// Folder to store generated images
const OUTPUT_DIR = path.join(process.cwd(), 'sample-images');

// Ensure the output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  console.log(`Created directory: ${OUTPUT_DIR}`);
}

// Generate a placeholder person image with text
function generatePersonImage(filename, label, bgColor = '#3b82f6', textColor = '#ffffff') {
  // Create a canvas (3:4 aspect ratio for ID photo)
  const width = 300;
  const height = 400;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Draw background
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);

  // Draw a simple silhouette
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  
  // Head
  ctx.beginPath();
  ctx.arc(width/2, height/3, width/4, 0, Math.PI * 2);
  ctx.fill();
  
  // Body
  ctx.beginPath();
  ctx.moveTo(width/3, height/2);
  ctx.lineTo(width*2/3, height/2);
  ctx.lineTo(width*2/3, height*0.85);
  ctx.lineTo(width/3, height*0.85);
  ctx.closePath();
  ctx.fill();

  // Add text
  ctx.fillStyle = textColor;
  ctx.font = 'bold 32px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'bottom';
  ctx.fillText(label, width/2, height - 50);
  
  // Add info text
  ctx.font = '16px Arial';
  ctx.fillText('Placeholder Image', width/2, height - 20);

  // Save the image
  const buffer = canvas.toBuffer('image/jpeg');
  fs.writeFileSync(path.join(OUTPUT_DIR, filename), buffer);
  console.log(`Generated: ${filename}`);
}

// Generate a placeholder signature image
function generateSignatureImage(filename, name, bgColor = '#ffffff', lineColor = '#000000') {
  // Create a canvas (4:1 aspect ratio for signature)
  const width = 400;
  const height = 100;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Draw white background
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);

  // Draw signature-like line
  ctx.strokeStyle = lineColor;
  ctx.lineWidth = 2;
  ctx.beginPath();
  
  let x = 50;
  const baseY = height / 2;
  const points = 20;
  const step = (width - 100) / points;
  
  ctx.moveTo(x, baseY);
  
  // Create a wavy line for the signature
  for (let i = 0; i < points; i++) {
    const y = baseY + (Math.random() - 0.5) * 30;
    x += step;
    ctx.lineTo(x, y);
  }
  
  ctx.stroke();

  // Add name under signature
  ctx.fillStyle = '#666666';
  ctx.font = '14px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText(name, width/2, height - 20);

  // Save the image as PNG with transparency
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(OUTPUT_DIR, filename), buffer);
  console.log(`Generated: ${filename}`);
}

// Generate all placeholder images
async function generateAll() {
  console.log('Generating placeholder images...');

  // Generate person photos
  generatePersonImage('male1.jpg', 'Male 1', '#4f46e5');
  generatePersonImage('male2.jpg', 'Male 2', '#0ea5e9');
  generatePersonImage('male3.jpg', 'Male 3', '#8b5cf6');
  generatePersonImage('female1.jpg', 'Female 1', '#ec4899');
  generatePersonImage('female2.jpg', 'Female 2', '#f43f5e');
  
  // Generate signatures
  generateSignatureImage('signature1.png', 'Muhammad Ahmed');
  generateSignatureImage('signature2.png', 'Fatima Khan');
  generateSignatureImage('signature3.png', 'Ali Hassan');
  generateSignatureImage('signature4.png', 'Ayesha Malik');
  generateSignatureImage('signature5.png', 'Usman Ali');
  
  console.log(`All images have been generated in: ${OUTPUT_DIR}`);
  console.log('You can now run the seed script to upload these images to Supabase.');
}

// Run the main function
generateAll().catch(console.error); 