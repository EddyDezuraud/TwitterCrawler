import express from 'express';
import chromium from 'chrome-aws-lambda';

import getUserProfile from './twitter-api.js';


const app = express();
const port = 3000;

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    // res.header('Access-Control-Allow-Origin', 'https://www.xpostpreview.com/');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});


app.get('/twitterId/:userId', async (req, res) => {
    console.log(req.params.userId)
    try {
        const user = await getUserProfile(req.params.userId);
        console.log(user.profileImageUrlHttps);
        console.log(user.name);
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

})

app.get('/checkTwitterId/:userId', async (req, res) => {
    const userId = req.params.userId;
    let browser = null;

    try {
        browser = await chromium.puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath,
            headless: chromium.headless,
            ignoreHTTPSErrors: true,
        });

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
        if (browser) {
            await browser.close();
        }
    }
});

app.listen(port, () => {
    console.log(`Le serveur fonctionne sur le port ${port}`);
});
