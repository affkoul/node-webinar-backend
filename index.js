require('dotenv').config()
const express = require("express")
const https = require("https")
const fs = require("fs")
var path = require('path')
const bp = require('body-parser')

const logger = require("./middleware/Logger")
var cors = require('cors')
const getData = require('./scraper')

const bcrypt = require('bcrypt')
const db = require("./db/dbRoutes/AdminDb")
const moment = require("moment")

const app = express()
const PORT = 10000

app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))
// app.use(express.json({ limit: '500mb', extended: true }))
// app.use(express.urlencoded({ limit: '500mb', extended: false }))
// Body Parser Middleware
// app.use(express.json())

// Forms Middleware
// app.use(express.urlencoded({ extended: true }))
var dir = path.join(__dirname, 'public');

app.use(express.static(dir));

app.use(cors())

// Logger Middleware
app.use(logger)

// Body Parser Middleware
// app.use(express.json())

// Forms Middleware
// app.use(express.urlencoded({ extended: true }))

require("./routes/Admin")(app);

// Webinar
app.use('/api/webinar', require("./routes/Webinar"))
// User
app.use('/api/user', require("./routes/User"))
// Lecturer
app.use('/api/lecturer', require("./routes/Lecturer"))
// Admin
// app.use('/api/admin', require("./routes/Admin"))
// Upload
app.use('/api/upload', require("./routes/Upload"))
// Webinar Category
app.use('/api/webinarCategory', require("./routes/WebinarCategory"))

// set static folder
//app.use(express.static(path.join(__dirname, 'public')))

app.get("/webscrap", (req, res) => {
    try {
        for (var i = 1; i < 6; i++) {
            getData(i);
        }

        res.send("Data Is Scrapped")

    }
    catch (err) {
        console.log(err)
    }

})

app.get("/", (req, res) => {

    res.send("Welcome to Webinar Server")

})


// app.listen(PORT, () => {
//     console.log("Server started on port", PORT)
// })
https.createServer({
    key: fs.readFileSync(
        "",
        "utf8"
    ),
    cert: fs.readFileSync(
        "",
        "utf8"
    ),
},
    app
).listen(PORT, () => {
    console.log("Express JS HTTPS Server started on port " + PORT)
})