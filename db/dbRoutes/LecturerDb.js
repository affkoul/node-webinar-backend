const pool = require("../index")

let lecturerDb = {}

lecturerDb.getAllLecturers = () => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM lecturer ORDER BY lecturerId DESC", (err, results) => {
            if (err) {
                return reject(err)
            }
            console.log(results)
            return resolve(results)

        })
    })
}

lecturerDb.getLecturer = (lecturerId) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM lecturer WHERE lecturerId = ?", [lecturerId], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}

lecturerDb.postLecturer = (lecturer) => {
    return new Promise((resolve, reject) => {
        const { name, email, phoneNumber, username, password, insertDate } = lecturer
        pool.query(`INSERT INTO lecturer (name, email,phoneNumber,username,password,insertDate) 
            VALUES (?,?,?,?,?,?)`,
            [name, email, phoneNumber, username, password, insertDate], (err, results) => {
                if (err) {
                    return reject(err)
                }
                return resolve(results)
            })
    })
}

lecturerDb.updateLecturer = (lecturerId, lecturer) => {
    const { name, email, phoneNumber, username, password, insertDate } = lecturer
    return new Promise((resolve, reject) => {
        pool.query(`UPDATE lecturer SET name = if(? is null, name,?) ,email = if(? is null, email,?),phoneNumber = if(? is null, phoneNumber,?),username = if(? is null, username,?),password = if(? is null, password,?) ,insertDate = if(? is null, insertDate,?) WHERE lecturerId=? `,
            [name, name, email, email, phoneNumber, phoneNumber, username, username, password, password, insertDate, insertDate, lecturerId], (err, results) => {
                if (err) {
                    return reject(err)
                }
                return resolve(results)
            })
    })
}

lecturerDb.deleteLecturer = (lecturerId) => {
    return new Promise((resolve, reject) => {
        pool.query(`DELETE FROM lecturer WHERE lecturerId=? `,
            [lecturerId], (err, results) => {
                if (err) {
                    return reject(err)
                }
                return resolve(results)
            })
    })

}

lecturerDb.getWebinars = (lecturerId) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM webinar , webinarLecturer WHERE lecturerId = ? and webinar.webinarId = webinarLecturer.webinarId ORDER BY webinar.webinarId DESC", [lecturerId], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}



lecturerDb.findLecturer = (username) => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * FROM lecturer WHERE username=? `,
            [username], (err, results) => {
                if (err) {
                    return reject(err)
                }
                return resolve(results)
            })
    })

}



module.exports = lecturerDb