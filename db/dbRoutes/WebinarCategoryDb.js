const pool = require("../index")

let webinarCategoryDb = {}

webinarCategoryDb.getAllCategories = () => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM webinarCategory ORDER BY categoryId DESC", (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}

webinarCategoryDb.getCategory = (categoryId) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM webinarCategory WHERE categoryId = ?", [categoryId], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}

webinarCategoryDb.postCategory = (category) => {
    return new Promise((resolve, reject) => {
        pool.query(`INSERT INTO webinarCategory (category) 
            VALUES (?)`,
            [category], (err, results) => {
                if (err) {
                    return reject(err)
                }
                return resolve(results)
            })
    })
}

webinarCategoryDb.updateCategory = (categoryId, categoryObject) => {
    const { category } = categoryObject
    return new Promise((resolve, reject) => {
        pool.query(`UPDATE webinarCategory SET category = if(? is null, category,?) WHERE categoryId=? `,
            [category, category, categoryId], (err, results) => {
                if (err) {
                    return reject(err)
                }
                return resolve(results)
            })
    })
}






module.exports = webinarCategoryDb