import puppeteer from 'puppeteer';

export default class Browser {
  constructor(config) {
    this.spaUrl = config.spaUrl;

    const waitUntil = config.waitUntil;

    switch (waitUntil) {
      case '0': {
        this.wait = 'networkidle0';
        break;
      }

      case '1': {
        this.wait = 'networkidle2';
        break;
      }

      case '2': {
        this.wait = 'domcontentloaded';
        break;
      }
    }
  }

  async launch() {
    this.browser = await puppeteer.launch();
    this.ws = this.browser.wsEndpoint();
  }

  async render(url) {
    const start = Date.now();
    const fullUrl = `${this.spaUrl}${url}`;
    const browser = await puppeteer.connect({ browserWSEndpoint: this.ws });
    const page = await browser.newPage();

    try {
      await page.goto(fullUrl, {
        waitUntil: this.wait,
      });

      const time = Date.now() - start;

      console.info(`Rendered ${fullUrl} page in ${time}ms`);

      return page.evaluate(() => document.documentElement.outerHTML);
    } catch (e) {
      console.error(`[classes][Server][render] - ${e}`);

      return e;
    }
  }
}
