const pool = require("../index")

let userDb = {}

userDb.getAllUsers = () => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM user ORDER BY userId DESC", (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}

userDb.getUser = (userId) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM user WHERE userId = ?", [userId], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}

userDb.postUser = (user) => {
    return new Promise((resolve, reject) => {
        const { name, email, phoneNumber, username, password, insertDate } = user
        pool.query(`INSERT INTO user (name, email,phoneNumber,username,password,insertDate) 
            VALUES (?,?,?,?,?,?)`,
            [name, email, phoneNumber, username, password, insertDate], (err, results) => {
                if (err) {
                    return reject(err)
                }
                return resolve(results)
            })
    })
}

userDb.updateUser = (userId, user) => {
    const { name, email, phoneNumber, username, password, insertDate } = user
    return new Promise((resolve, reject) => {
        pool.query(`UPDATE user SET name = if(? is null, name,?) ,email = if(? is null, email,?),phoneNumber = if(? is null, phoneNumber,?),username = if(? is null, username,?),password = if(? is null, password,?),insertDate = if(? is null, insertDate,?) WHERE userId=? `,
            [name, name, email, email, phoneNumber, phoneNumber, username, username, password, password, insertDate, insertDate, userId], (err, results) => {
                if (err) {
                    return reject(err)
                }
                return resolve(results)
            })
    })
}

userDb.deleteUser = (userId) => {
    return new Promise((resolve, reject) => {
        pool.query(`DELETE FROM user WHERE userId=? `,
            [userId], (err, results) => {
                if (err) {
                    return reject(err)
                }
                return resolve(results)
            })
    })

}

userDb.getWebinars = (userId) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM webinar , purchasedWebinar WHERE userId = ? and webinar.webinarId = purchasedWebinar.webinarId ORDER BY webinar.webinarId DESC", [userId], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}

userDb.findUser = (username) => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * FROM user WHERE username=? `,
            [username], (err, results) => {
                if (err) {
                    return reject(err)
                }
                return resolve(results)
            })
    })

}


userDb.getCheckUserWebinar = (userId, webinarId) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM purchasedWebinar WHERE webinarId = ? and userId = ?", [webinarId, userId], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })

}


module.exports = userDb