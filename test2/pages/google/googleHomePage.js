const {By, Key, until} = require('selenium-webdriver')
const BasePage = require('../basePage')

class GoogleHomePage extends BasePage {
    get searchField() {return By.name('q')}
    get logo() {return By.className('logo')}

    async open() {
        await this.goToUrl("https://www.google.ru")
    }

    async enterSearch(searchText) {
        await this.enterText(this.searchField, searchText)
        await this.enterText(this.searchField, Key.ENTER)
    }

    async waitForLogo() {
        await this.waitUntil(until.elementLocated(this.logo))
    }
}

module.exports = new GoogleHomePage()