const { log } = console
const { pages } = require('./config')
const puppeteer = require('puppeteer')
const { getCache, setCache } = require('./cache.js')

require('dotenv').config()
const { IG_USERNAME, IG_PASSWORD } = process.env

const getImages = async user => {
    let found = null
    let cached = getCache(`ig-${user}`)
    if (cached) {
        log(`IG: Data loaded from cache`, cached.length)
        found = cached[0] 
        return cached 
    }
    const browser = await puppeteer.launch({ headless: false })
    log(`IG: Opening page ${pages.instagram.login}...`)
    const page = await browser.newPage()
    await page.goto(pages.instagram.login)
    await page.waitForSelector('[type=submit]', { state: 'visible' })

    log(`IG: Logging in as ${IG_USERNAME}...`)
    await page.type('[name=username]', IG_USERNAME)
    await page.type('[type="password"]', Buffer.from(IG_PASSWORD, 'base64').toString())
    await page.click('[type=submit]')
    await page.waitForSelector('[placeholder=Search]', { state: 'visible' })

    log(`IG: Opening profile for ${user} ${pages.instagram.profile.replace('$user', user)}...`)
    await page.goto(pages.instagram.profile.replace('$user', user))
    await page.waitForSelector('img', { state: 'visible' })

    // Execute code in the DOM
    log(`IG: Scrolling and loading all images for ${user}...`)
    const urls = await page.evaluate(async () => {
        return await new Promise((res, rej) => {
            let urls = []
            let pages = 0 
            let scroll = window.scrollY

            let scroller = setInterval(() => {
                document.querySelector('footer').scrollIntoView()
                pages++

                setTimeout(() => {
                    const pageImages = document.querySelectorAll('.KL4Bh img')
                    const pageUrls = Array.from(pageImages).map(i => i.src)
                    urls.push(...pageUrls)
                    urls = [...new Set(urls)]

                    if (window.scrollY === scroll) {
                        clearInterval(scroller)
                        return setTimeout(() => res(urls), pages * 1000)
                    }

                    scroll = window.scrollY
                 }, 5000)
           }, 3000)        
        })
    })

    log(`IG: Closing browser...`)
    await browser.close()

    log(`IG: Caching results...`)
    setCache(`ig-${user}`, urls)
    return urls
}

module.exports = { getImages }