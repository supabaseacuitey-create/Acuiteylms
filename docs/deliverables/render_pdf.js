const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const htmlPath = path.resolve(__dirname, 'report.html');
const pdfPath = path.resolve(__dirname, 'Acuitey-LMS-Initial-System-Design.pdf');

console.log('HTML exists:', fs.existsSync(htmlPath), 'Size:', fs.statSync(htmlPath).size);

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const fileUrl = 'file:///' + htmlPath.replace(/\\/g, '/');

const args = [
  '--headless',
  '--disable-gpu',
  '--no-sandbox',
  '--no-pdf-header-footer',
  '--run-all-compositor-stages-before-draw',
  `--print-to-pdf="${pdfPath}"`,
  `"${fileUrl}"`
];

const fullCmd = `"${chromePath}" ${args.join(' ')}`;
console.log('Executing command...');
try {
  const result = execSync(fullCmd, { encoding: 'utf-8', stdio: 'inherit' });
  console.log('Command executed successfully.');
} catch (err) {
  console.error('Error executing Chrome:', err.message);
}

if (fs.existsSync(pdfPath)) {
  console.log('SUCCESS: PDF Generated!');
  console.log('PDF Path:', pdfPath);
  console.log('PDF Size:', fs.statSync(pdfPath).size, 'bytes');
} else {
  console.log('PDF not found at expected path.');
}
