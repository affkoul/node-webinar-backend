const express = require("express")
const router = express.Router()
const moment = require("moment")
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const db = require("../db/dbRoutes/WebinarCategoryDb")

// Get all webinarCategories
router.get("/", async (req, res) => {
    try {
        let results = await db.getAllCategories()
        res.json(results)
    }
    catch (e) {
        console.log(e)
        res.status(500)
    }
})

// Get a webinarCategory
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params
        let results = await db.getCategory(id)
        if (results.length > 0) {
            res.json(results[0])
        }
        else {
            res.status(400).json({ msg: `No Category with id ${id}` })
        }

    }
    catch (e) {
        console.log(e)
        res.status(500)
    }
})

// Add a webinarCategory
router.post("/", async (req, res) => {
    const { category } = req.body

    try {
        let results = await db.postCategory(category)
        res.json({ msg: "Category Added" })
    }
    catch (e) {
        console.log(e)
        res.status(500)
    }

})

// Update webinarCategory
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params
        let results = await db.updateCategory(id, req.body)
        console.log(results)
        if (results.affectedRows !== 0) {
            res.json({ msg: `Category is updated`, user: results })
        }
        else {
            res.status(400).json({ msg: `No Category with id ${id}` })
        }

    }
    catch (e) {
        console.log(e)
        res.status(500)
    }

})



module.exports = router