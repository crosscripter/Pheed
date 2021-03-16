const { log } = console
const { getImages } = require('./instagram')
const { downloadAll } = require('./downloader')

const downloadInstagram = async user => {
    log(`Downloading images for ${user} from Instagram...`)
    const urls = await getImages(user)
    log(`Downloading ${urls.length} image(s) found...`)
    await downloadAll(user, urls) 
    log(`${urls.length} Images for ${user} downloaded from Instagram successfully!`)
}

downloadInstagram('eliseschutt')