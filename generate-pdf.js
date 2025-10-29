import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
  console.log('🚀 Launching browser...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  console.log('📄 Creating page...');
  const page = await browser.newPage();

  const htmlPath = path.join(__dirname, 'app-flow.html');
  const pdfPath = path.join(__dirname, 'app-flow.pdf');

  console.log(`📖 Loading HTML from: ${htmlPath}`);
  await page.goto(`file://${htmlPath}`, {
    waitUntil: 'networkidle0',
    timeout: 30000
  });

  // Wait for Mermaid to render
  console.log('⏳ Waiting for Mermaid diagram to render...');
  await new Promise(resolve => setTimeout(resolve, 3000));

  console.log('🖨️  Generating PDF...');
  await page.pdf({
    path: pdfPath,
    format: 'A3',
    landscape: true,
    margin: {
      top: '20px',
      right: '20px',
      bottom: '20px',
      left: '20px'
    },
    printBackground: true,
    preferCSSPageSize: false
  });

  console.log(`✅ PDF saved to: ${pdfPath}`);

  await browser.close();
  console.log('🎉 Done!');
})();