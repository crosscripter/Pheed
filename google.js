const { log } = console
const Scraper = require('images-scraper');

const getImages = async (user, site, count=10) => {
    log(`G: Getting images of ${user} from Google Images...`)
    const google = new Scraper() 
    const results = await google.scrape(`${site ? `site:${site} ` : ''}${user}`, count)
    const images = results.map(r => r?.url).filter(Boolean)
    log(`G: Found ${results.length} image(s) of ${user} from Google Images`, images)
    return count === 1 ? images[0] : images.slice(images.length - count, images.length)
}

const getProfile = async user => await getImages(`@${user} face`, null, 1)
const getBanner = async user => await getImages(`@${user} perfect hd`, null, 1)
module.exports = { getImages, getProfile, getBanner }
