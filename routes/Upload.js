const express = require("express")
const router = express.Router()
const fs = require('fs')
const { v4: uuidv4 } = require('uuid')

router.post('/image', async (req, res) => {
    try {
        const data = req.body.image
        const extension = data.substring(
            'data:image/'.length,
            data.indexOf(';base64,'),
        )
        const base64Data = data.substring(
            data.indexOf(';base64,') + ';base64,'.length,
        )
        const fileName = `${uuidv4()}.${extension}`
        await fs.promises.writeFile(
            `${process.env.IMAGE_STORE_LOCATION}/${fileName}`,
            base64Data,
            'base64',
        )
        return res.send(`${process.env.IMAGE_ACCESS_LOCATION}/${fileName}`)
    }
    catch (e) {
        console.log(e)
        res.status(500)
    }
})

router.post('/file', async (req, res, next) => {
    try {
        const data = req.body.file
        const extension = data.substring(
            'data:application/'.length,
            data.indexOf(';base64,'),
        )
        const base64Data = data.substring(
            data.indexOf(';base64,') + ';base64,'.length,
        )
        const fileName = `${uuidv4()}.${extension}`
        await fs.promises.writeFile(
            `${process.env.FILE_STORE_LOCATION}/${fileName}`,
            base64Data,
            'base64',
        )
        return res.send(`${process.env.FILE_ACCESS_LOCATION}/${fileName}`)
    } catch (err) {
        return next(err)
    }
})

router.post('/video', async (req, res, next) => {
    try {

        const data = req.body.video
        // const extension = data.substring(
        //   'data:video/'.length,
        //   data.indexOf(';base64,'),
        // )
        const base64Data = data.substring(
            data.indexOf(';base64,') + ';base64,'.length,
        )
        const fileName = `${uuidv4()}.mov`
        await fs.promises.writeFile(
            `${process.env.VIDEO_STORE_LOCATION}/${fileName}`,
            base64Data,
            'base64',
        )
        return res.send(`${process.env.VIDEO_ACCESS_LOCATION}/${fileName}`)
    } catch (err) {
        return next(err)
    }
})


module.exports = router