const { log } = console
const { parse, stringify } = JSON
const { existsSync, readFileSync, writeFileSync } = require('fs')

let cache = { }
const path = './cache'
const encoding = 'utf8'

const load = () => {
    if (!existsSync(path)) 
        writeFileSync(path, stringify(cache), encoding)

    cache = parse(readFileSync(path, encoding))
    log(`CH: Loading cache at ${path}...`, Object.keys(cache))
    return cache
}

const save = (data) => {
    let json = stringify(data)
    log(`CH: Saving cache to ${path}...`)
    writeFileSync(path, json, encoding)
    return cache = load()
}

const getCache = key => {
    cache = load()
    log(`CH: Getting key ${key} from cache at ${path}...`, cache[key]?.length)
    return cache[key]
}

const setCache = (key, value) => {
    log(`CH: Setting key ${key} to value ${value?.length} in cache at ${path}...`, key, value.length)
    cache[key] = value
    cache = save(cache)
    return cache[key]
}

module.exports = { getCache, setCache }