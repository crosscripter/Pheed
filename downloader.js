const { log } = console
const axios = require('axios')
const { join, resolve } = require('path')
const { createWriteStream, existsSync, mkdirSync } = require('fs')

const download = async (user, url) => {
    const name = url.split('/').slice(-1)[0].split('?')[0].trim()
    log(`DL: Downloading image ${name}...`)

    const dir = join(__dirname, user)
    log(`DL: Creating directory for user at ${dir}...`)
    if (!existsSync(dir)) mkdirSync(dir)

    log(`DL: GET ${url}...`)
    const path = resolve(dir, name)
    const writer = createWriteStream(path)
    const response = await axios({ url, method: 'GET', responseType: 'stream' })
    response.data.pipe(writer)

    return new Promise((res, rej) => {
        writer.on('finish', res)
        writer.on('error', rej)
    })
}

const downloadAll = async (user, urls) => {
    log(`DL: Downloading ${urls.length} image(s) for ${user}...`)
    await Promise.allSettled(urls.map(async url => await download(user, url)))
    log(`DL: ${urls.length} image(s) downloaded for user ${user}!`)
}

module.exports = { download, downloadAll }