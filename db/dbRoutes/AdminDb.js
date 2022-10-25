const pool = require("../index")

let adminDb = {}

adminDb.getAllAdmins = () => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM admin ORDER BY adminId DESC", (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}

adminDb.getAdmin = (adminId) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM admin WHERE adminId = ?", [adminId], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}

adminDb.postAdmin = (admin) => {
    return new Promise((resolve, reject) => {
        const { name, email, phoneNumber, username, password, insertDate } = admin
        pool.query(`INSERT INTO admin (name, email,phoneNumber,username,password,insertDate) 
            VALUES (?,?,?,?,?,?)`,
            [name, email, phoneNumber, username, password, insertDate], (err, results) => {
                if (err) {
                    return reject(err)
                }
                return resolve(results)
            })
    })
}

adminDb.updateAdmin = (adminId, admin) => {
    const { name, email, phoneNumber, username, password, insertDate } = admin
    return new Promise((resolve, reject) => {
        pool.query(`UPDATE admin SET name = if(? is null, name,?) ,email = if(? is null, email,?),phoneNumber = if(? is null, phoneNumber,?),username = if(? is null, username,?),password = if(? is null, password,?),insertDate = if(? is null, insertDate,?) WHERE adminId=? `,
            [name, name, email, email, phoneNumber, phoneNumber, username, username, password, password, insertDate, insertDate, adminId], (err, results) => {
                if (err) {
                    return reject(err)
                }
                return resolve(results)
            })
    })
}

adminDb.deleteAdmin = (adminId) => {
    return new Promise((resolve, reject) => {
        pool.query(`DELETE FROM admin WHERE adminId=? `,
            [adminId], (err, results) => {
                if (err) {
                    return reject(err)
                }
                return resolve(results)
            })
    })

}

adminDb.findAdmin = (username) => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * FROM admin WHERE username=? `,
            [username], (err, results) => {
                if (err) {
                    console.log('error occured')
                    return reject(err)
                }
                console.log('No error')
                console.log(results.length)
                return resolve(results)
            })
    })

}

module.exports = adminDb