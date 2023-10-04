import express from 'express';
import puppeteer from 'puppeteer';


const app = express();
const port = 3000;

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
        console.error(`Erreur : ${error.message}`);
        res.status(500).json({ error: 'Une erreur s\'est produite lors de la vérification de l\'identifiant Twitter.' });
    }


});

app.listen(port, () => {
    console.log(`Le serveur fonctionne sur le port ${port}`);
});
