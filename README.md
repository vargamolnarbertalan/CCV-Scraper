# Welcome to CCV Scraper by B3RC1!

This application allows you to get the CCV for any Twitch or YouTube channel. The output is a fullscreen webpage, which can be accessed from any device. Monitor the number of your viewers at all times while in production! 

> Only available as a dockerized Linux app at the moment.

## Installation

```
docker pull b3rc1/ccv-scraper:latest
```

OR

Clone or download this repository as a zip. Inside the cloned/unpacked folder run the following commands:
```
docker build -t b3rc1/ccv-scraper:latest .
```
and
```
docker run --name ccv-scraper -p 12024:12024 --restart always b3rc1/ccv-scraper:latest
```

## Usage

There's no GUI, the only way to control the application is to pass channel names and platforms as parameters in the GET URL.

## Available paths

- **ip:port/twitch/{twitch_channelname}** ---> Renders the CCV for a single Twitch channel. Updates every 90 seconds.
- **ip:port/yt/{yt_channelname}** ---> Renders the CCV for a single YouTube channel. Updates every 90 seconds.
- **ip:port/twitch/{twitch\_channelname}/yt/{yt\_channelname}** ---> Renders the CCV for one Twitch and one YouTube channel.  Updates every 90 seconds.
- **ip:port/twitch/{twitch\_channelname}/yt/{yt\_channelname}/tiktok/{tiktok\_channelname}** ---> Renders the CCV for one Twitch, one YouTube, and one TikTok channel.  Updates every 120 seconds.
- **ip:port/e1tv_all** ---> Renders the CCV for esport1tv, esport2tv, esport3tv, esport4tv Twitch and esport1gg, esport1tv YouTube channels. Updates every 2 minutes.

### *Please note*
*Loading CCVs can take up to several seconds, wait patiently. If a channel is offline, displaying the offline message will take longer than displaying a live number due to the nature of this app.*