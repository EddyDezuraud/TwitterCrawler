import express from 'express';
import chromium  from 'chrome-aws-lambda'

const app = express();
const port = 3000;

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    // res.header('Access-Control-Allow-Origin', 'https://www.xpostpreview.com/');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.get('/checkTwitterId/:userId', async (req, res) => {
    const userId = req.params.userId;
    let browser = null;
    const executablePath = await edgeChromium.executablePath || LOCAL_CHROME_EXECUTABLE

    try {
        // const browser = await puppeteer.launch();

        browser = await chromium.puppeteer.launch({
            args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
        })

        const page = await browser.newPage();

        await page.goto('https://twitter.com/' + userId);

        await page.locator('script[data-testid="UserProfileSchema-test"]').wait();

        const userProfileJson = await page.evaluate(() => {
            const scriptTag = document.querySelector('script[data-testid="UserProfileSchema-test"]');
            return JSON.parse(scriptTag.textContent);
        });

        const name = userProfileJson.author.givenName;
        const img = userProfileJson.author.image.thumbnailUrl;

        res.status(200).json({ name, img });

    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        await browser.close();
    }


});

app.listen(port, () => {
    console.log(`Le serveur fonctionne sur le port ${port}`);
});
