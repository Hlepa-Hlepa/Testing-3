const { before, after, afterEach } = require('mocha')
const { assert, expect, should} = require('chai')
const page = require('../../pages/polytech/polytechPage')
const getNowDateAndTime = require('../../../helpers/currentDateTime')

function getCurrentWeekDay() {
    let date = new Date()
    let options = { weekday: "long" };
    return new Intl.DateTimeFormat("ru-RU", options).format(date)
}

describe('Тест расписания политеха', async function() {
    before(async function() {
        await page.open()
    })

    it('Нажимает на кнопку расписаний', async function() {
        await page.click(page.redirectButtonLocator)
        await page.sleep(1000)
    })

    it('Переходит на сайт расписаний', async function() {
        await page.click(page.scheduleSiteLocator)
    })

    it('Вводит номер группы в поле', async function() {
        await page.SwitchToNextTab()
        await page.sleep(5000)
        await page.enterText(page.scheduleSearchLocator, "221-321")
        await page.sleep(3000)
    })

    it('Нажимает на ссылку группы 221-321', async function() {
        page.click(page.groupLinkLocator)
        await page.sleep(3000)
    })


    it('Сравнивает выделенный день недели с сегодняшним', async function() {
        try {
            let weekDayOnPage = await page.getTextOfElement(page.currentWeekDayLocator)
            let systemWeekDay = getCurrentWeekDay()
            expect(weekDayOnPage.toUpperCase()).to.equal(systemWeekDay.toUpperCase())
        } catch {
            console.log("На странице нет выделенного дня недели")
            assert.fail()
        }
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