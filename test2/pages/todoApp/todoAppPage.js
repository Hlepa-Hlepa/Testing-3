const {By, Key, until} = require('selenium-webdriver')
const BasePage = require('../basePage')

class TodoAppPage extends BasePage {
    constructor() {
        super()
        this.total = 5
        this.remaining = this.total
    }
    
    get RemainingElemLocator() {
        return By.xpath("//span[@class='ng-binding']")
    }

    async open() {
        await this.goToUrl("https://lambdatest.github.io/sample-todo-app/")
    }

    async getInputLocatorByID(id) {
        if (id >= 1 && id <= this.total) {
            return By.name(`li${id}`)
        }
        return By.xpath('//empty')
    }

    async checkElem(locator) {
        let item = await this.findElement(locator)
        
        await item.click()
        
        let isEnabled = await item.isEnabled()
        if (!!isEnabled === true) {
            this.remaining--
        } else {
            this.remaining++
        }
    }

    async getInputSpanLocatorByID(id) {
        if (id >= 1 && id <= this.total) {
            return By.xpath(`//input[@name="li${id}"]/following-sibling::span`)
        }
        return By.xpath('//empty')
    }

    async addNewItem(text) {
        await this.enterText(By.id('sampletodotext'), text)
        await this.click(By.id('addbutton'))
        this.total++
        this.remaining++
    }
}

module.exports = new TodoAppPage()