import { Dataset, createPuppeteerRouter } from 'crawlee';

export const router = createPuppeteerRouter();

router.addDefaultHandler(async ({ request, page, enqueueLinks, log }) => {
    const title = await page.title();
    const metaTags = await page.$$eval('meta', (e)=>{
        return e.map(e => e.getAttribute('content'));
    });
    const imgTags = await page.$$eval('img', (e)=>{
        return e.map(e => e.getAttribute('src'));
    });
    const pTags = await page.$$eval('p', (e)=>{
        return e.map(e => e.innerText);
    });
    log.info(`${title}`, { url: request.loadedUrl });
    log.info(`${metaTags}`, { url: request.loadedUrl });
    log.info(`${imgTags}`, { url: request.loadedUrl });
    log.info(`enqueueing new URLs`);
    await enqueueLinks({
        globs: ['https://crawlee.dev/**'],
        label: 'detail',
    });
});

router.addHandler('detail', async ({ request, page, log }) => {
    const title = await page.title();
    const metaTags = await page.$$eval('meta', (e)=>{
        return e.map(e => e.getAttribute('content'));
    });
    const imgTags = await page.$$eval('img', (e)=>{
        return e.map(e => e.getAttribute('src'));
    });
    log.info(`${title}`, { url: request.loadedUrl });
    log.info(`${metaTags}`, { url: request.loadedUrl });
    log.info(`${imgTags}`, { url: request.loadedUrl });

    await Dataset.pushData({
        url: request.loadedUrl,
        title,
        metaTags,
        imgTags
    });
});
