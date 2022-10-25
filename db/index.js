const mysql = require("mysql")

const pool = mysql.createPool({
    connectionLimit: 10,
    password: "password",
    user: "user",
    database: "database",
    host: "host.host.host.host",

})

module.exports = pool