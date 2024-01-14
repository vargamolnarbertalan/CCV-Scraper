// IMPORT LIBRARIES AND INITIALIZE GLOBAL VARIABLES & CONSTANTS
const express = require('express')
const puppeteer = require('puppeteer')
const bodyParser = require('body-parser')

const PORT = 12024

// MAIN FUNCTION CALL

;
(async() => {
    try {
        const text = await main();
    } catch (e) {
        console.log(e)
    }
})()

// FUNCTION DECLARATION
async function main() {
    const app = express()
    app.set('view engine', 'ejs')
    app.set('views', 'views')
    app.use(express.static('public'))
    app.use(express.static(__dirname + '/public'))
    app.use(bodyParser.urlencoded({
        extended: false
    }))
    app.use(bodyParser.json())
    app.set('trust proxy', true)

    // GET REQUESTS

    app.get('/:channel', (req, res) => {
        const channel = req.params.channel
            //console.log(channel)
        scraper(channel).then(el => {
            const ejsdata = {
                channel: channel,
                viewers: el.msg
            }
            console.log(ejsdata)
            res.render('default', { ejsdata })
        })
    })

    // POST REQUESTS

    app.post('/refresh', (req, res) => {
        const channel = req.body.channel
            //onsole.log(channel)
        scraper(channel).then(el => {
            res.send(el.msg).status(200)
        })
    })

    // RUN

    app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`))

}



/////////////////////////////////////////////////////

async function scraper(channel) {
    return new Promise(async(resolve, reject) => {
        const authToken = ""

        console.log('checking view count on ' + channel)
        const browser = await puppeteer.launch({
            headless: 'new', // 'new', false
            defaultViewport: null,
            args: ['--start-maximized'],
            executablePath: __dirname + '/Chrome/Application/chrome.exe' // Windows
                // executablePath: '/usr/bin/google-chrome-stable' // Linux
        });
        const cookies = [{
            'name': 'auth-token',
            'value': authToken
        }]

        const context = await browser.createIncognitoBrowserContext()
        const page = await context.newPage()

        await page.goto('https://twitch.tv/' + channel)
        await page.evaluate(() => {
            localStorage.setItem('mature', 'true')
            localStorage.setItem('video-muted', '{"default":false}')
            localStorage.setItem('volume', '0.5')
            localStorage.setItem('video-quality', '{"default":"160p30"}')
        })

        await page.setViewport({ width: 1280, height: 720 })

        await page.setCookie(...cookies)
        await page.reload({
            waitUntil: ["networkidle2", "domcontentloaded"]
        })

        await page.waitForSelector('[data-a-target="animated-channel-viewers-count"]')
        var viewers = await page.$eval('[data-a-target="animated-channel-viewers-count"]', el => el.textContent)
        await browser.close()
        console.log('viewers on ' + channel + ': ' + viewers)
        return resolve({
            msg: viewers,
            status: 200
        })
    })
}

function getVersionNumber() {
    return '0.1.0'
}