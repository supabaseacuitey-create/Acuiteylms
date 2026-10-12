const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const htmlPath = path.resolve(__dirname, 'index.html');
const pdfPath = path.resolve(__dirname, '..', 'deliverables', 'Acuitey-LMS-Initial-System-Design-Editorial.pdf');
const previewsDir = path.resolve(__dirname, 'previews');
const diagramsDir = path.resolve(__dirname, 'diagrams');

if (!fs.existsSync(previewsDir)) {
  fs.mkdirSync(previewsDir, { recursive: true });
}

console.log('Rendering Editorial PDF...');
const fileUrl = 'file:///' + htmlPath.replace(/\\/g, '/');

const pdfArgs = [
  '--headless',
  '--disable-gpu',
  '--no-sandbox',
  '--no-pdf-header-footer',
  '--run-all-compositor-stages-before-draw',
  `--print-to-pdf="${pdfPath}"`,
  `"${fileUrl}"`
];

try {
  execSync(`"${chromePath}" ${pdfArgs.join(' ')}`, { stdio: 'inherit' });
  console.log('PDF rendered successfully:', pdfPath, 'Size:', fs.statSync(pdfPath).size);
} catch (err) {
  console.error('Error rendering PDF:', err.message);
}

// Now render preview PNGs for all 9 pages
console.log('Rendering Preview PNGs for all 9 pages...');

const diagramFiles = [
  '01-system-architecture.html',
  '02-student-experience.html',
  '03-faculty-routing.html',
  '04-moodle-extension-architecture.html',
  '05-role-security.html',
  '06-payment-enrolment.html',
  '07-zoom-lti.html',
  '08-deployment-architecture.html',
  '09-implementation-roadmap.html'
];

for (let i = 0; i < diagramFiles.length; i++) {
  const dFile = diagramFiles[i];
  const dPath = path.join(diagramsDir, dFile);
  const pageNum = String(i + 1).padStart(2, '0');
  const pngPath = path.join(previewsDir, `page-${pageNum}.png`);
  const dUrl = 'file:///' + dPath.replace(/\\/g, '/');

  const imgArgs = [
    '--headless',
    '--disable-gpu',
    '--no-sandbox',
    '--hide-scrollbars',
    '--window-size=1400,900',
    `--screenshot="${pngPath}"`,
    `"${dUrl}"`
  ];

  try {
    execSync(`"${chromePath}" ${imgArgs.join(' ')}`, { stdio: 'ignore' });
    console.log(`Rendered preview page-${pageNum}.png (${fs.statSync(pngPath).size} bytes)`);
  } catch (err) {
    console.error(`Error rendering preview for page ${pageNum}:`, err.message);
  }
}

console.log('All renderings complete!');
