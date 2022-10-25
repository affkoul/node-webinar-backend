const express = require("express")
const router = express.Router()
const moment = require("moment")
const db = require("../db/dbRoutes/WebinarDb")
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const util = require('util')
var nodemailer = require('nodemailer');

// Get all webinars
router.get("/", async (req, res) => {
    try {
        let results = await db.getAllWebinars()
        res.json(results)
    }
    catch (e) {
        console.log(e)
        res.status(500)
    }
})

// Get All Accepted Webinars
router.get("/accepted", async (req, res) => {
    try {
        let results = await db.getAllAcceptedWebinars()

        res.json(results)
    }
    catch (e) {
        console.log(e)
        res.status(500)
    }
})

// Get Webinar by tier
router.get("/tier/:id", async (req, res) => {
    try {
        const { id } = req.params
        let results = await db.getWebinarByTier(id)

        res.json(results)



    }
    catch (e) {
        console.log(e)
        res.status(500)
    }
})

// Get Users of a webinar
router.get("/:id/user", async (req, res) => {
    try {
        console.log("inja")
        const { id } = req.params
        let results = await db.getUsers(id)
        console.log(results)
        // if (results.length > 0) {
        res.json(results)
        // }
        // else {
        //     res.status(400).json({ msg: `No User for id ${id}` })
        // }

    }
    catch (e) {
        console.log(e)
        res.status(500)
    }
})

// Get a Webinar
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params
        let results = await db.getWebinar(id)
        if (results.length > 0) {
            res.json(results[0])
        }
        else {
            res.status(400).json({ msg: `No webinar with id ${id}` })
        }

    }
    catch (e) {
        console.log(e)
        res.status(500)
    }
})

// Add a Webinar
router.post("/", async (req, res) => {
    const { name, price, category, time, featuredImage, description, tier, duration, type, link } = req.body
    const newWebinar = {
        name,
        price,
        category,
        time,
        insertDate: moment().format(),
        featuredImage,
        description,
        tier,
        duration,
        type,
        link
    }


    if (!newWebinar.name) {
        return res.status(400).json({ msg: `No webinar name` })
    }

    try {
        let results = await db.postWebinar(newWebinar)
        console.log("injaaa", results)
        let resultId = await db.getWebinarId(name)
        console.log("res", resultId, resultId[0].webinarId)

        let token = req.headers.authorization.split(" ")[1]
        console.log(token)
        const jwtVerify = util.promisify(require('jsonwebtoken').verify)

        const tokenData = await jwtVerify(token, 'AUTH_SECRET')
        console.log(tokenData)
        if (tokenData.lecturerId && resultId[0].webinarId) {
            console.log(tokenData.lecturerId)
            let results = await db.postLecturer(resultId[0].webinarId, tokenData.lecturerId)
            console.log(results)
        }

        res.json({ msg: "Webinar Added" })
    }
    catch (e) {
        console.log(e)
        res.status(500)
    }

})

// Update Webinar 
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params

        if (req.body.isRequestAccept) {
            console.log(req.body.lecturerEmail)
            const sendingText = `Request to hold your webinar on the topic ${req.body.webinarTitle} has been ${req.body.isAccepted ? 'Accepted' : 'Rejected'}`;

            var transporter = nodemailer.createTransport({
                host: 'smtp.163.com',
                service: '163',
                auth: {
                    user: 'ndolet@163.com',
                    pass: 'UHDDSSXTJBUKLQOO'
                }
            });


            var mailOptions = {
                from: 'ndolet@163.com',
                to: req.body.lecturerEmail,
                subject: 'Ndolet Consulting Corp. Webinar Request Result',
                text: sendingText
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
        }
        let results = await db.updateWebinar(id, req.body)
        console.log(results)
        if (results.affectedRows !== 0) {
            res.json({ msg: `Webinar is updated`, webinar: results })
        }
        else {
            res.status(400).json({ msg: `No webinar with id ${id}` })
        }

    }
    catch (e) {
        console.log(e)
        res.status(500)
    }

})

// Delete a Webinar
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params
        let results = await db.deleteWebinar(id)
        console.log(results)
        if (results.affectedRows !== 0) {
            //   res.json(results)
            res.json({ msg: `Webinar is Deleted`, webinar: results })
        }
        else {
            res.status(400).json({ msg: `No webinar with id ${id}` })
        }

    }
    catch (e) {
        console.log(e)
        res.status(500)
    }
})

// Get Lecturers of a webinar
router.get("/:id/lecturer", async (req, res) => {
    try {
        const { id } = req.params
        let results = await db.getLecturers(id)
        if (results.length > 0) {
            res.json(results)
        }
        else {
            res.status(400).json({ msg: `No lecturer for id ${id}` })
        }

    }
    catch (e) {
        console.log(e)
        res.status(500)
    }
})

// Add Lecturer
router.get("/:id/lecturer/:lecturerId", async (req, res) => {
    try {
        const { id, lecturerId } = req.params
        let results = await db.postLecturer(id, lecturerId)
        if (results.length > 0) {
            res.json(results)
        }
        else {
            res.status(400).json({ msg: `Added lecturer successfully` })
        }

    }
    catch (e) {
        console.log(e)
        res.status(500)
    }
})

// Delete Lecturer 
router.delete("/:id/lecturer/:lecturerId", async (req, res) => {
    try {
        const { id, lecturerId } = req.params
        let results = await db.deleteLecturer(id, lecturerId)
        if (results.affectedRows !== 0) {
            res.json({ msg: `Lecturer is Deleted`, lecturer: results })
        }
        else {
            res.status(400).json({ msg: `Added lecturer successfully` })
        }

    }
    catch (e) {
        console.log(e)
        res.status(500)
    }
})



// Add User
router.get("/:id/user/:userId", async (req, res) => {
    try {
        const { id, userId } = req.params
        let results = await db.postUser(id, userId)
        console.log(results)
        if (results.affectedRows !== 0) {
            res.json(results)
        }
        else {
            res.status(400).json({ msg: `Could not Add User` })
        }

    }
    catch (e) {
        console.log(e)
        res.status(500)
    }
})

// Delete User
router.delete("/:id/user/:userId", async (req, res) => {
    try {
        const { id, userId } = req.params
        let results = await db.deleteUser(id, userId)
        if (results.affectedRows !== 0) {
            res.json({ msg: `User is Deleted`, user: results })
        }
        else {
            res.status(400).json({ msg: `Added User successfully` })
        }

    }
    catch (e) {
        console.log(e)
        res.status(500)
    }
})

module.exports = router