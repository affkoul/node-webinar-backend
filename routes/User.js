const express = require("express")
const router = express.Router()
const moment = require("moment")
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const db = require("../db/dbRoutes/UserDb")
const util = require('util')



// Get all users
router.get("/", async (req, res) => {
    try {
        let results = await db.getAllUsers()
        res.json(results)
    }
    catch (e) {
        console.log(e)
        res.status(500)
    }
})

// Get User Info
router.get("/me", async (req, res) => {
    try {

        //  console.log(req)
        let token = req.headers.authorization.split(" ")[1]
        console.log(token)
        const jwtVerify = util.promisify(require('jsonwebtoken').verify)

        const tokenData = await jwtVerify(token, 'AUTH_SECRET')
        console.log(tokenData)
        console.log(tokenData.userId)
        let results = await db.getUser(tokenData.userId)
        if (results.length > 0) {
            res.json(results[0])
        }
        else {
            res.status(400).json({ msg: `No User with id ${tokenData.userId}` })
        }

    }
    catch (e) {
        console.log(e)
        res.status(500)
    }
})


// Get a user
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params
        let results = await db.getUser(id)
        if (results.length > 0) {
            res.json(results[0])
        }
        else {
            res.status(400).json({ msg: `No User with id ${id}` })
        }

    }
    catch (e) {
        console.log(e)
        res.status(500)
    }
})

// Add a user
router.post("/", async (req, res) => {
    const { name, email, phoneNumber, username, password } = req.body
    const saltRounds = parseInt(10, 10)
    const salt = await bcrypt.genSalt(saltRounds)
    const hash = await bcrypt.hash(password, salt)
    const newUser = {
        name,
        email,
        phoneNumber,
        username,
        password: hash,
        insertDate: moment().format()
    }


    if (!newUser.name) {
        return res.status(400).json({ msg: `No User name` })
    }

    try {
        let results = await db.postUser(newUser)
        res.json({ msg: "User Added" })
    }
    catch (e) {
        console.log(e)
        res.status(500)
    }

})

// Update User 
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params
        let results = await db.updateUser(id, req.body)
        console.log(results)
        if (results.affectedRows !== 0) {
            res.json({ msg: `User is updated`, user: results })
        }
        else {
            res.status(400).json({ msg: `No User with id ${id}` })
        }

    }
    catch (e) {
        console.log(e)
        res.status(500)
    }

})

// Delete a User
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params
        let results = await db.deleteUser(id)
        console.log(results)
        if (results.affectedRows !== 0) {
            //   res.json(results)
            res.json({ msg: `User is Deleted`, user: results })
        }
        else {
            res.status(400).json({ msg: `No User with id ${id}` })
        }

    }
    catch (e) {
        console.log(e)
        res.status(500)
    }
})

// Get Webinars of a user
router.get("/:id/webinar", async (req, res) => {
    try {
        const { id } = req.params
        let results = await db.getWebinars(id)
        if (results.length > 0) {
            res.json(results)
        }
        else {
            res.status(400).json({ msg: `No webinar for id ${id}` })
        }

    }
    catch (e) {
        console.log(e)
        res.status(500)
    }
})

// Check if user owns webinar or not
router.get("/:id/webinar/:webinarId", async (req, res) => {
    try {
        const { id, webinarId } = req.params
        let results = await db.getCheckUserWebinar(id, webinarId)
        console.log(results)
        if (results.length > 0) {
            res.json({ status: "OWNED", msg: `User Own Webinar` })
        }
        else {
            res.json({ status: "NOTOWNED", msg: `User Dont Own Webinar` })
        }

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
        const result = await db.findUser(username)
        const user = result[0]
        if (!user) {
            res.status(400).send({ message: "There is no user" })
            return
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        console.log(isPasswordCorrect)
        if (isPasswordCorrect) {
            const token = jwt.sign({
                userId: user.userId,

            }, 'AUTH_SECRET')

            res.send({ token })
        }
        else {
            res.status(400).send({ message: "The password is incorrect" })
        }

    }
    catch (e) {
        console.log(e)
        res.status(500)
    }

})



module.exports = router