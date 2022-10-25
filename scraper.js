const $ = require('cheerio');
const puppeteer = require('puppeteer');
const moment = require("moment")
const db = require("./db/dbRoutes/WebinarDb")



function getData(pageNumber) {
    puppeteer
        .launch()
        .then(function (browser) {
            // console.log(browser)
            return browser.newPage();
        })
        .then(function (page) {
            const url = `https://eseminar.tv/webinars?page=${pageNumber}&per_page=15&refresh=true`;
            return page.goto(url).then(function () {
                return page.content();
            });
        })
        .then(async function (html) {
            const allWebinars = $(".webinarCard", html)
            const images = $(".webinarCard-cover img", html)
            const links = $(".webinarCard-cover a", html)
            const prices = $(".webinarCard .price", html)
            const names = $(".webinarCard-title h3", html)

            for (var i = 0; i < allWebinars.length; i++) {
                const newWebinar = {};
                newWebinar.featuredImage = $(images[i]).attr('data-src')
                newWebinar.link = `https://eseminar.tv${$(links[i]).attr('href')}`
                const tempPrice = $(prices[i]).first().contents().filter(function () {
                    return this.type === 'text';
                }).text().trim()
                newWebinar.price = tempPrice === "Free" ? "0" : tempPrice
                newWebinar.name = $(names[i]).text()
                newWebinar.category = null
                newWebinar.insertDate = moment().format()
                newWebinar.description = $(names[i]).text()
                newWebinar.duration = '60'
                newWebinar.type = '1'
                newWebinar.time = moment().format()
                newWebinar.tier = '1'
                newWebinar.isAccepted = 1

                await db.postWebinar(newWebinar)

            }

        })
        .catch(function (err) {
            console.log(err)
            //handle error
        });

}
module.exports = getData
