const { Builder, Browser, By, until } = require('selenium-webdriver');
const fs = require('fs');
const SLEEP_TIME12 = 120000;
const SLEEP_TIME5 = 20000;
const SLEEP_TIME7 = 40000;

const withErrorHandling = (fn, handler) => {
    return async () => {
        try {
            await fn();
        } catch (error) {
            console.error(error);
            await handler();
        }
    };
};

class BasePage {
    constructor() {
        this.driver = new Builder().forBrowser(Browser.CHROME).build();
        this.driver.manage().setTimeouts({ implicit: 5000 });
    }

    async goToUrl(url) {
        await this.driver.get(url);
    }

    async enterText(locator, text) {
        await this.driver.findElement(locator).sendKeys(text);
    }

    async getText(locator) {
        return await this.driver.findElement(locator).getText();
    }

    async click(locator) {
        if (await this.isDriverActive()) {
            await this.driver.findElement(locator).click();
        } else {
            throw new Error('Driver is not active');
        }
    }
    
    async isDriverActive() {
        try {
            await this.driver.getTitle();
            return true;
        } catch (error) {
            return false;
        }
    }
    async isElementPresent(locator) {
        try {
            await this.driver.wait(until.elementIsVisible(this.driver.findElement(locator)), 10000);
            return true;
        } catch (error) {
            return false;
        }
    }

    async clickElement(locator) {
        await this.driver.wait(until.elementIsVisible(this.driver.findElement(locator)), 10000);
        await this.driver.findElement(locator).click();
    }

    async getTextFromElement(locator) {
        await this.driver.wait(until.elementIsVisible(this.driver.findElement(locator)), 10000);
        return await this.driver.findElement(locator).getText();
    }

    async getTextFromMultipleElements(locator) {
        const elements = await this.driver.findElements(locator);
        const texts = [];
        for (const element of elements) {
            texts.push(await element.getText());
        }
        return texts;
    }

    async saveScreenshot(fileName) {
        await this.driver.takeScreenshot().then((img) => {
            fs.writeFileSync(fileName, img, 'base64');
        });
    }

    async closeBrowser(delay = 0) {
        if (delay) await this.driver.sleep(delay);
        await this.driver.quit();
    }
}

class AmazonPage extends BasePage {
    constructor() {
        super();
        this.URL = 'https://www.amazon.com/';
        this.xpathBestSellers = "//*[@id='nav-xshop']/a[contains(text(), 'Best Sellers')]";
        this.xpathProductTitles = "//div[@class='p13n-sc-truncated']";
        this.xpathProductPrices = "//span[@class='p13n-sc-price']";
    }

    async openPage() {
        await this.goToUrl(this.URL);
    }

    async clickBestSellers() {
        await this.clickElement(By.xpath(this.xpathBestSellers));
    }

    async logElements() {
        const productTitles = await this.driver.findElements(By.xpath(this.xpathProductTitles));
        const productPrices = await this.driver.findElements(By.xpath(this.xpathProductPrices));
        const elements = await Promise.all(productTitles.slice(0, 5).map(async (el, i) => [await el.getText(), await productPrices[i].getText()]));
        for (let [title, price] of elements) {
            console.log(title, price);
        }
        return elements;
    }
}

describe("Amazon test", function () {
    this.timeout(100000);
    const amazonPage = new AmazonPage();
    let firstElem;

    before(async () => {
        await amazonPage.openPage();
    });

    after(async () => {
        await amazonPage.closeBrowser();
    });

    afterEach(async function () {
        if (this.currentTest.state === "failed") {
            const dateTime = new Date().toLocaleDateString();
            await amazonPage.saveScreenshot(dateTime);
        }
    });

    it(
        "open best sellers page",
        withErrorHandling(
            async () => {
                await amazonPage.clickBestSellers();
                await amazonPage.driver.sleep(SLEEP_TIME12);
            },
            async () => await amazonPage.saveScreenshot("error.png"),
        )
    );

    it(
        "log titles and prices",
        withErrorHandling(
            async () => {
                firstElem = await amazonPage.logElements();
                await amazonPage.driver.sleep(SLEEP_TIME7);
            },
            async () => await amazonPage.saveScreenshot("error.png"),
        )
    );
});
