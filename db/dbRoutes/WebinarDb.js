const pool = require("../index")

let webinarDb = {}

webinarDb.getAllWebinars = () => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM webinar LEFT JOIN (SELECT webinarId as id1 , username , email from webinarLecturer,lecturer WHERE webinarLecturer.lecturerId = lecturer.lecturerId) AS joinedTable ON webinar.webinarId = joinedTable.id1 ORDER BY webinar.webinarId DESC", (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}


webinarDb.getAllAcceptedWebinars = () => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM webinar WHERE webinar.isAccepted=? ORDER BY webinarId DESC", 1, (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}

webinarDb.getWebinarByTier = (tier) => {
    console.log("tier is", tier)
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM webinar WHERE webinar.tier=? ORDER BY webinarId DESC", tier, (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}




webinarDb.getWebinar = (webinarId) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM webinar WHERE webinarId = ?", [webinarId], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}

webinarDb.getWebinarId = (name) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT webinarId FROM webinar WHERE webinar.name = ?", name, (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}


webinarDb.postWebinar = (webinar) => {
    return new Promise((resolve, reject) => {
        const { name, price, category, time, insertDate, featuredImage, description, tier, duration, type, link, isAccepted } = webinar
        const valueIsAccepted = isAccepted ? 1 : 0
        // pool.query(`SET GLOBAL FOREIGN_KEY_CHECKS=0`, (err, results) => {
        //     if (err) {
        //         return reject(err)
        //     }
        //     return resolve(results)
        // })
        pool.query(`INSERT INTO webinar (name, price,category,time,insertDate,featuredImage,description,tier,duration,type,link,isAccepted) 
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
            [name, price, category, time, insertDate, featuredImage, description, tier, duration, type, link, valueIsAccepted], (err, results) => {
                if (err) {
                    return reject(err)
                }
                return resolve(results)
            })
    })
}

webinarDb.updateWebinar = (webinarId, webinar) => {
    return new Promise((resolve, reject) => {
        const { name, price, category, time, insertDate, featuredImage, description, tier, duration, type, link, isAccepted, video, file } = webinar
        pool.query(`UPDATE webinar SET name = if(? is null, name,?) ,price = if(? is null, price,?),category = if(? is null, category,?),time = if(? is null, time,?),insertDate = if(? is null, insertDate,?),featuredImage = if(? is null, featuredImage,?),description = if(? is null, description,?),tier = if(? is null, tier,?) ,duration = if(? is null, duration,?),type = if(? is null, type,?),link = if(? is null, link,?) ,isAccepted = if(? is null, isAccepted,?),video = if(? is null, video,?),file = if(? is null, file,?) WHERE webinarId=? `,
            [name, name, price, price, category, category, time, time, insertDate, insertDate, featuredImage, featuredImage, description, description, tier, tier, duration, duration, type, type, link, link, isAccepted, isAccepted, video, video, file, file, webinarId], (err, results) => {
                if (err) {
                    return reject(err)
                }
                return resolve(results)
            })
    })
}

webinarDb.deleteWebinar = (webinarId) => {
    return new Promise((resolve, reject) => {
        pool.query(`DELETE FROM webinar WHERE webinarId=? `,
            [webinarId], (err, results) => {
                if (err) {
                    return reject(err)
                }
                return resolve(results)
            })
    })

}

webinarDb.getLecturers = (webinarId) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM lecturer,webinarLecturer WHERE webinarId = ? and lecturer.lecturerId = webinarLecturer.lecturerId ORDER BY lecturerId DESC", webinarId, (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}

webinarDb.postLecturer = (webinarId, lecturerId) => {
    return new Promise((resolve, reject) => {
        pool.query("INSERT INTO webinarLecturer VALUES (?,?) ", [webinarId, lecturerId], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}

webinarDb.deleteLecturer = (webinarId, lecturerId) => {
    return new Promise((resolve, reject) => {
        pool.query("DELETE FROM webinarLecturer WHERE webinarId = ? and lecturerId = ?", [webinarId, lecturerId], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}


webinarDb.getUsers = (webinarId) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM user,purchasedWebinar WHERE webinarId = ? and user.userId = purchasedWebinar.userId ORDER BY user.userId DESC", webinarId, (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}

webinarDb.postUser = (webinarId, userId) => {
    return new Promise((resolve, reject) => {
        pool.query("INSERT INTO purchasedWebinar VALUES (?,?) ", [webinarId, userId], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}

webinarDb.deleteUser = (webinarId, userId) => {
    return new Promise((resolve, reject) => {
        pool.query("DELETE FROM purchasedWebinar WHERE webinarId = ? and userId = ?", [webinarId, userId], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}



module.exports = webinarDb