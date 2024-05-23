const { before, after, afterEach } = require('mocha')
const { assert, expect, should} = require('chai')
const page = require('../../pages/todoApp/todoAppPage')
const getNowDateAndTime = require('../../../helpers/currentDateTime')

describe('Todo Sample Tests', async function() {
    before(async function() {
        await page.open()
    })

    it('Открывает страницу TODO листа и проверяет заголовок', async function() {
        let title = await page.getPageTitle()
        expect(title).to.equal("Sample page - lambdatest.com")
    })

    it('Помечает все имеющиеся на данный момент таски', async function() {
        for (let i = 1; i <= page.total; i++) {
            let inputLocator = await page.getInputLocatorByID(i)
            let inputSpanLocator = await page.getInputSpanLocatorByID(i)
            let remainingLocator = page.RemainingElemLocator

            let currentRemaining = await page.getTextOfElement(remainingLocator)
            let expectedRemaining = `${page.remaining} of ${page.total} remaining`
            expect(currentRemaining).to.equal(expectedRemaining)
            
            let itemClass = await page.getClassOfElement(inputSpanLocator)
            expect(itemClass).to.equal("done-false")

            await page.checkElem(inputLocator)

            itemClass = await page.getClassOfElement(inputSpanLocator)
            expect(itemClass).to.equal("done-true")
            
            await driver.sleep(500)
        }
    })

    it('Добавляет новый элемент и проверяет его работоспособность', async function() {
        let text = "New Item"
        let remainingLocator = page.RemainingElemLocator
        
        await page.addNewItem(text)
        let inputLocator = await page.getInputLocatorByID(6)
        let inputSpanLocator = await page.getInputSpanLocatorByID(6)
        await driver.sleep(500)
        
        let currentRemaining = await page.getTextOfElement(remainingLocator)
        let expectedRemaining = `${page.remaining} of ${page.total} remaining`
        expect(currentRemaining).to.equal(expectedRemaining)
        
        let itemText = await page.getTextOfElement(inputSpanLocator)
        expect(itemText).to.equal(text)

        let itemClass = await page.getClassOfElement(inputSpanLocator)
        expect(itemClass).to.equal("done-false")
        
        await page.checkElem(inputLocator)
        itemClass = await page.getClassOfElement(inputSpanLocator)
        expect(itemClass).to.equal("done-true")
        expect(page.remaining).to.equal(0)
        await driver.sleep(500)
    })

    afterEach(async function() {
        if (this.currentTest.state == 'failed') {
            let dateTime = getNowDateAndTime()
            let imageFileName = `${this.currentTest.title}_${dateTime}.jpg`
            await page.saveScreenshot(imageFileName)
        }
    })

    after(async function() {
        await page.closeBrowser()
    })
})