import express from "express";
import Cache from "./Cache.js";
import Browser from "./Browser.js";

const port = process.env.PORT || 5000;

export default class Server {
    constructor() {
        this.useCache = process.env.USE_CACHE === 'true';
        if(this.useCache) this.cache = new Cache();
        this.browser = new Browser();
    }
    async start() {
        this.app = express();
        this.listener = this.app.listen(port, () => {
            console.log(`Server listening on port: ${port}`);
        })
        await this.browser.launch();
    }
    listen() {
        this.app.get('*', async (req, res) => {
            const url = req.url;
            if(this.cache && this.cache.has(url)) {
                res.send(this.cache.get(url))
                console.info(`${url} served from cache.`)
            } else {
                const html = await this.browser.render(req.url);
                res.send(html);
                console.info(`${url} served from renderer.`)
                if(this.cache) this.cache.set(url, html);
            }
        })
    }
    stop() {
        this.listener.close();
    }
}
