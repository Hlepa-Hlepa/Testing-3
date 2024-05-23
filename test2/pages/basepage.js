const {Builder, Browser, until} = require('selenium-webdriver')

class BasePage {
    async goToUrl(url) {
        global.driver = new Builder().forBrowser(Browser.FIREFOX).build();
        driver.manage().setTimeouts({implicit: 5000}); // Если за 5 сек элемент не будет найден, то тест упадет
        await driver.get(url);
    }

    async findElement(locator) {
        return await driver.findElement(locator)
    }

    async getClassOfElement(locator) {
        return await driver.findElement(locator).getAttribute('class')
    }

    async getTextOfElement(locator) {
        return await driver.findElement(locator).getText()
    }

    async enterText(locator, textToEnter) {
        await driver.findElement(locator).sendKeys(textToEnter);
    }

    async click(locator) {
        await driver.findElement(locator).click();
    }

    async closeBrowser() {
        await driver.sleep(1000);
        await driver.quit()
    }

    async getPageTitle() {
        return await driver.getTitle()
    }

    async isElementOnPage(locator) {
        return await driver.findElement(locator).isEmpty()
    }

    async saveScreenshot(fileName) {
        driver.takeScreenshot().then(function(image) {
            require('fs').writeFileSync("./images/task2/" + fileName, image, 'base64')
        })
    }

    async waitUntil(condituion) {
        await driver.wait(condituion)
    }

    async SwitchToNextTab() {
        let originalTab = await driver.getWindowHandle();
        const windows = await driver.getAllWindowHandles();
        
        windows.forEach(async handle => {
            if (handle !== originalTab) {
                await driver.switchTo().window(handle);
            }
        });
    }

    async sleep(milliseconds) {
        await driver.sleep(milliseconds)
    }
}

module.exports = BasePage