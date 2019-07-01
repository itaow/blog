const mysql = require('mysql')
const dbconfig = require('./db.config')
const conn = {
        query: (sql, params, callback) => {
            // 链接数据
            const myconn = mysql.createConnection(dbconfig)
            myconn.connect((err) => {
                    if (err) return err.stack
                    console.log("mysql连接成功", myconn.threadId)
                })
                // 操作数据库
            myconn.query(sql, params, (err, result, fields) => {
                if (err) return console.log('sql fail', err.stack)
                callback && callback(err, result, fields)
                myconn.end((err) => {
                    if (err) return console.log('关闭数据库失败', err.stack)
                })
            })

        }
    }
    // 连接数据库

module.exports = conn