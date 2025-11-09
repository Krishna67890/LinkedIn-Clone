const fs = require('fs');
const path = require('path');

console.log('🔍 Checking frontend build requirements...');

// Check if essential files exist (relative to frontend folder)
const essentialFiles = [
  'package.json',
  'vite.config.js',
  'src/main.jsx',
  'src/App.jsx',
  'index.html'
];

essentialFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} exists`);
  } else {
    console.log(`❌ ${file} missing`);
  }
});

// Check dist folder after build
if (fs.existsSync('dist')) {
  console.log('✅ dist folder exists');
  const distFiles = fs.readdirSync('dist');
  console.log('📁 dist contents:', distFiles);
} else {
  console.log('❌ dist folder missing - build failed');
}