const { beforeEach, afterEach } = require('mocha')
const { assert, expect, should} = require('chai')
const GoogleHomePage = require('../../pages/google/googleHomePage')

describe('Google tests', async function() {
    beforeEach(async function() {
        await GoogleHomePage.open()
    })

    it('Открывает главную страницу google и ищет "Selenium webdriver"', async function() {
        await GoogleHomePage.enterSearch("Selenium webdriver")
        GoogleHomePage.waitForLogo()
        let title = await GoogleHomePage.getPageTitle()
        expect(title).to.equal("Selenium webdriver - Поиск Google")
    })

    afterEach(async function() {
        await GoogleHomePage.closeBrowser()
    })
})