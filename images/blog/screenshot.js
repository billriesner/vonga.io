const puppeteer = require('puppeteer');
const path = require('path');

async function screenshot(htmlFile, outputFile, width, height) {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.setViewport({ width, height });
    await page.goto(`file://${path.resolve(__dirname, htmlFile)}`);
    await page.screenshot({ path: outputFile });
    await browser.close();
    console.log(`Created: ${outputFile}`);
}

(async () => {
    await screenshot('hero-generator.html', 'app-fatigue-hero.png', 1200, 630);
    await screenshot('cost-comparison-generator.html', 'app-vs-nfc-cost.png', 1000, 500);
    await screenshot('funnel-generator.html', 'app-decay-funnel.png', 1000, 600);
    await screenshot('timeline-generator.html', 'pilot-timeline.png', 1200, 500);
    console.log('All screenshots created!');
})();
