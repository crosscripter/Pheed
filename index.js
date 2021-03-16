const { log } = console
const express = require('express')
const { getImages, getProfile, getBanner } = require('./google')

require('dotenv').config()
const { PORT } = process.env

const app = express()

app.get('/', (_, res) => res.send('<h1>Pheed Server</h1>'))
app.use(express.static('public'))

app.get('/images/:user/:site?/:count?', async ({ params: { user, site, count } }, res) => {
    res.send(await getImages(user, site, count))
})

app.get(`/profile/:user`, async({ params: { user }}, res) => res.send(await getProfile(user)))
app.get(`/banner/:user`, async({ params: { user }}, res) => res.send(await getBanner(user)))
app.get(`/:user/:site?`, async(req, res) => res.sendFile(`${__dirname}/public/index.html`))
app.listen(PORT, () => log(`Pheed up and running on port ${PORT}`))