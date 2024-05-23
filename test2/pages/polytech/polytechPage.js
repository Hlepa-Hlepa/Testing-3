const {By, Key, until} = require('selenium-webdriver')
const BasePage = require('../basePage')

class PolytechPage extends BasePage {
    async open() {
        await this.goToUrl("https://mospolytech.ru")
    }

    get redirectButtonLocator() {
        return By.xpath('//a[@title="Расписание"]')
    }

    get preloaderLocator() {
        return By.xpath('//div[@id="preloader"]')
    }

    get scheduleSiteLocator() {
        return By.xpath('//a[@href="https://rasp.dmami.ru/"]')
    }

    get scheduleSearchLocator() {
        return By.xpath('//input[@class="groups"]')
    }

    get groupLinkLocator() {
        return By.xpath('//div[@id="221-321"]')
    }

    get currentWeekDayLocator() {
        return By.xpath('//div[contains(@class, "schedule-day_today")]/div[contains(@class, "schedule-day__title")]')
    }

    async waitSeachField() {
        await this.waitUntil(until.elementIsVisible(this.preloaderLocator))
    }
}

module.exports = new PolytechPage()