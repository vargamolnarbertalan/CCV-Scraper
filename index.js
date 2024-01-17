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

    app.get('/twitch/:channel', (req, res) => {
        const channel = req.params.channel
        if (channel != 'favicon.ico') {
            const ejsdata = {
                channel: channel
            }
            res.render('default', { ejsdata })
        }
    })

    app.get('/yt/:channel', (req, res) => {
        const channel = req.params.channel
        if (channel != 'favicon.ico') {
            const ejsdata = {
                channel: channel
            }
            res.render('default_yt', { ejsdata })
        }
    })

    app.get('/twitch/:channel/yt/:channel2', (req, res) => {
        const channels = [req.params.channel, req.params.channel2]
        const ejsdata = {
            channels: channels
        }
        res.render('yt_twitch', { ejsdata })
    })

    app.get('/e1tv_all', (req, res) => {
        const channels = ['esport1tv', 'esport2tv', 'esport3tv', 'esport4tv', 'esport1gg', 'esport1tv']
        const ejsdata = {
            channels: channels
        }
        res.render('e1tv_all', { ejsdata })
    })

    // POST REQUESTS

    app.post('/refresh_twitch', (req, res) => {
        const channel = req.body.channel
            //onsole.log(channel)
        scraper(channel).then(el => {
            res.send(el.msg).status(200)
        })
    })

    app.post('/refresh_yt', (req, res) => {
        const channel = req.body.channel
            //onsole.log(channel)
        yTscraper(channel).then(el => {
            res.send(el.msg).status(200)
        })
    })

    app.post('/refresh_duo', (req, res) => {
        const channels = [req.body.channel0, req.body.channel1]
        console.log(channels)
        scraper(channels[0]).then(el0 => {
            var data = []
            data.push(el0.msg)
            yTscraper(channels[1]).then(el1 => {
                data.push(el1.msg)
                res.send(data).status(200)
            })
        })

    })

    app.post('/refresh_all', (req, res) => {
        const channels = [req.body.channel0, req.body.channel1, req.body.channel2, req.body.channel3, req.body.channel4, req.body.channel5]
        console.log(channels)
        scraper(channels[0]).then(el0 => {
            var data = []
            data.push(el0.msg)
            scraper(channels[1]).then(el1 => {
                data.push(el1.msg)
                scraper(channels[2]).then(el2 => {
                    data.push(el2.msg)
                    scraper(channels[3]).then(el3 => {
                        data.push(el3.msg)
                        yTscraper(channels[4]).then(el4 => {
                            data.push(el4.msg)
                            yTscraper(channels[5]).then(el5 => {
                                data.push(el5.msg)
                                res.send(data).status(200)
                            })
                        })
                    })
                })
            })
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
            args: ['--start-maximized', '--no-sandbox'],
            // executablePath: __dirname + '/Chrome/Application/chrome.exe' // Windows
            executablePath: '/usr/bin/google-chrome-stable' // Linux
        });
        const cookies = [{
            'name': 'auth-token',
            'value': authToken
        }]

        var [page] = await browser.pages()
        await page.goto('https://twitch.tv/' + channel)
        await page.evaluate(() => {
            localStorage.setItem('mature', 'true')
            localStorage.setItem('video-muted', '{"default":false}')
            localStorage.setItem('volume', '0.5')
            localStorage.setItem('video-quality', '{"default":"160p30"}')
        })

        await page.setViewport({ width: 1280, height: 720 })


        await page.setCookie(...cookies)
            // await page.reload({waitUntil: ["networkidle2", "domcontentloaded"]})
        await page.setDefaultTimeout(5000)
        try {
            await page.waitForSelector('[data-a-target="animated-channel-viewers-count"]')
            var viewers = await page.$eval('[data-a-target="animated-channel-viewers-count"]', el => el.textContent)
            await browser.close()
            console.log('viewers on ' + channel + ': ' + viewers)
            return resolve({
                msg: viewers,
                status: 200
            })
        } catch (e) {
            await browser.close()
            console.log('viewers on ' + channel + ': ' + 'offline')
            return resolve({
                msg: 'offline',
                status: 200
            })
        }

    })
}

async function yTscraper(channel) {
    return new Promise(async(resolve, reject) => {
        const authToken = ""

        console.log('checking view count on ' + channel + ' YT')
        const browser = await puppeteer.launch({
            headless: 'new', // 'new', false
            defaultViewport: null,
            args: ['--start-maximized', '--no-sandbox'],
            //executablePath: __dirname + '/Chrome/Application/chrome.exe' // Windows
            executablePath: '/usr/bin/google-chrome-stable' // Linux
        })

        var [page] = await browser.pages()
        await page.goto('https://www.youtube.com/@' + channel + '/streams')

        await page.setViewport({ width: 1280, height: 720 })
        await page.waitForSelector('form:nth-child(3) > div > div > button')
        await page.click('form:nth-child(3) > div > div > button')

        await page.setDefaultTimeout(10000)
        try {
            await page.waitForSelector('[overlay-style="LIVE"]')
            await page.click('[overlay-style="LIVE"]')
        } catch (e) {
            await browser.close()
            console.log('viewers on ' + channel + ': ' + 'offline')
            return resolve({
                msg: 'offline',
                status: 200
            })
        }
        await page.waitForSelector("#count > ytd-video-view-count-renderer > span.view-count.style-scope.ytd-video-view-count-renderer")
        var viewers = await page.$eval("#count > ytd-video-view-count-renderer > span.view-count.style-scope.ytd-video-view-count-renderer", el => el.textContent)
        viewers = viewers.replace(/[^0-9]/g, '')
        await browser.close()
        console.log('viewers on ' + channel + ' YT: ' + viewers)
        return resolve({
            msg: viewers,
            status: 200
        })

    })
}