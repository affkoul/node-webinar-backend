const moment = require("moment")

const Logger = (req, res, next) => {
    console.log(`${req.protocol}://${req.get("host")}${req.originalUrl} : moment ${moment().format()}`)
    next()
}
module.exports = Logger