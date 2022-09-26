import express from 'express';
import Cache from './Cache.js';
import Browser from './Browser.js';

export default class Server {
  constructor(config) {
    this.port = config.port | 5000;
    this.useCache = config.useCache | false;

    if (this.useCache) this.cache = new Cache();

    this.browser = new Browser({
      waitUntil: config.waitUntil,
      spaUrl: config.spaUrl,
    });
  }

  async start() {
    this.app = express();

    this.listener = this.app.listen(this.port, () => {
      console.log(`Server listening on port: ${this.port}`);
    });

    await this.browser.launch();
  }

  listen() {
    this.app.get('*', async (req, res) => {
      const url = req.url;

      if (this.cache && this.cache.has(url)) {
        res.send(this.cache.get(url));

        console.info(`${url} served from cache.`);
      } else {
        const html = await this.browser.render(url);

        res.send(html);

        console.info(`${url} served from renderer.`);

        if (this.cache) this.cache.set(url, html);
      }
    });
  }

  stop() {
    this.listener.close();
  }
}
