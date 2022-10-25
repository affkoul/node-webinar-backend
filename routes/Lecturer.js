const express = require("express")
const router = express.Router()
const moment = require("moment")
const db = require("../db/dbRoutes/LecturerDb")
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const util = require('util')


// Get all Lecturers
router.get("/", async (req, res) => {
    try {
        let results = await db.getAllLecturers()
        res.json(results)
    }
    catch (e) {
        console.log(e)
        res.status(500)
    }
})

// Get Lecturer Info
router.get("/me", async (req, res) => {
    try {

        //  console.log(req)
        let token = req.headers.authorization.split(" ")[1]
        console.log(token)
        const jwtVerify = util.promisify(require('jsonwebtoken').verify)

        const tokenData = await jwtVerify(token, 'AUTH_SECRET')
        console.log(tokenData)
        console.log(tokenData.lecturerId)
        let results = await db.getLecturer(tokenData.lecturerId)
        if (results.length > 0) {
            res.json(results[0])
        }
        else {
            res.status(400).json({ msg: `No Lecturer with id ${tokenData.lecturerId}` })
        }

    }
    catch (e) {
        console.log(e)
        res.status(500)
    }
})


// Get a Lecturer
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params
        let results = await db.getLecturer(id)
        if (results.length > 0) {
            res.json(results[0])
        }
        else {
            res.status(400).json({ msg: `No Lecturer with id ${id}` })
        }

    }
    catch (e) {
        console.log(e)
        res.status(500)
    }
})



// Add a Lecturer
router.post("/", async (req, res) => {
    const { name, email, phoneNumber, username, password } = req.body
    const saltRounds = parseInt(10, 10)
    const salt = await bcrypt.genSalt(saltRounds)
    const hash = await bcrypt.hash(password, salt)
    const newLecturer = {
        name,
        email,
        phoneNumber,
        username,
        password: hash,
        insertDate: moment().format()
    }

    if (!newLecturer.name) {
        return res.status(400).json({ msg: `No Lecturer name` })
    }

    try {
        let results = await db.postLecturer(newLecturer)
        res.json({ msg: "Lecturer Added" })
    }
    catch (e) {
        console.log(e)
        res.status(500)
    }

})

// Update Lecturer 
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params
        let results = await db.updateLecturer(id, req.body)
        console.log(results)
        if (results.affectedRows !== 0) {
            res.json({ msg: `Lecturer is updated`, lecturer: results })
        }
        else {
            res.status(400).json({ msg: `No Lecturer with id ${id}` })
        }

    }
    catch (e) {
        console.log(e)
        res.status(500)
    }

})

// Delete a Lecturer
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params
        let results = await db.deleteLecturer(id)
        console.log(results)
        if (results.affectedRows !== 0) {
            //   res.json(results)
            res.json({ msg: `Lecturer is Deleted`, lecturer: results })
        }
        else {
            res.status(400).json({ msg: `No Lecturer with id ${id}` })
        }

    }
    catch (e) {
        console.log(e)
        res.status(500)
    }
})

// Get Webinars of a lecturer
router.get("/:id/webinar", async (req, res) => {
    try {
        console.log("miay inja")
        const { id } = req.params
        console.log("miay inja", id)
        let results = await db.getWebinars(id)
        console.log(results)

        res.json(results)


    }
    catch (e) {
        console.log(e)
        res.status(500)
    }
})

// Login
router.post("/login", async (req, res) => {
    const { username, password } = req.body
    console.log(username, password)

    try {
        const result = await db.findLecturer(username)
        const lecturer = result[0]
        if (!lecturer) {
            res.status(400).send({ message: "There is no speaker" })
            return
        }


        const isPasswordCorrect = await bcrypt.compare(password, lecturer.password)
        console.log(isPasswordCorrect)
        if (isPasswordCorrect) {
            const token = jwt.sign({
                lecturerId: lecturer.lecturerId,

            }, 'AUTH_SECRET')

            res.send({ token })
        }
        else {
            res.status(400).send({ message: "The password is incorrect." })
        }

    }
    catch (e) {
        console.log(e)
        res.status(500)
    }

})



module.exports = router