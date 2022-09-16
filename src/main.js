// For more information, see https://crawlee.dev/
import { PuppeteerCrawler, ProxyConfiguration } from 'crawlee';
import { router } from './routes.js';
import express from 'express';

const app = express();
const hostname = 'puppeteer-crawler.vercel.app';
// const hostname = 'localhost';
const port = 3000;

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!')
})
  
app.post('/crawl', async (req, res) => {
  console.log(req.body.startUrl);
  const startUrls = [req.body.startUrl];

    const crawler = new PuppeteerCrawler({
        // proxyConfiguration: new ProxyConfiguration({ proxyUrls: ['...'] }),
        requestHandler: router,
    });

    await crawler.run(startUrls);
    res.sendStatus(200);
});

app.listen(port, hostname, () => {
    console.log(`Server running at https://${hostname}:${port}/`)
})
