import express from 'express';
import puppeteer from 'puppeteer';


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
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.setUserAgent(
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36"
        )


        await page.goto('https://twitter.com/' + userId);

        await page.locator('script[data-testid="UserProfileSchema-test"]').wait();

        const userProfileJson = await page.evaluate(() => {
            const scriptTag = document.querySelector('script[data-testid="UserProfileSchema-test"]');
            return JSON.parse(scriptTag.textContent);
        });

        const name = userProfileJson.author.givenName;
        const img = userProfileJson.author.image.thumbnailUrl;

        await browser.close();

        res.status(200).json({name, img});

    } catch (error) {
        res.status(500).json({ error: error.message });
    }


});

app.listen(port, () => {
    console.log(`Le serveur fonctionne sur le port ${port}`);
});
