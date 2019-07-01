const conn = require('../db/db')
const moment = require('moment')
const bcrypt = require('bcrypt')
const multiparty = require('multiparty')


module.exports = {
    //登陆
    login: (req, res) => {
        res.render('./user/login.ejs', { name: 'login', islogin: false })
    },
    loginDo: (req, res) => {
        // res.render('./user/login.ejs', { name: 'login' })
        // 获取表单数据
        let data = req.body
        if (data.username.trim().length < 5 || data.password.trim().length < 5) {
            return res.send({ status: 500, message: '用户名和密码不能为空', res: '' })
        }
        // 通过 用户名查询数据并验证密码
        let sql = 'select * from blog_users where username=?'
        conn.query(sql, data.username, (err, result) => {
            if (err) return res.send({ status: 501, message: 'sql faile', res: err.stack })
            if (result.length == 0) return res.send({ status: 502, message: '用户名不正确', res: '' })
            bcrypt.compare(data.password, result[0].password, function(err, hashpass) {
                if (err) returnres.send({ status: 502, message: '密码不正确', res: '' })
                    // 用户名和密码通过验证，记录用户登陆状态
                req.session.username = result[0]
                req.session.islogin = true
                return res.send({ message: "登陆成功", status: 200 })
            });
        })
    },
    logOut: (req, res) => { // 退出登陆
        req.session.destroy(function() {
            //302跳转
            res.redirect('/')
        })
    },
    //注册
    register: (req, res) => {
        //使用render之前一定要保证安装和配置了ejs模块
        res.render('./user/register.ejs', { name: 'register', islogin: false })
    },
    registerDo: (req, res) => {
        // 获取表单数据，存入数据库
        const data = req.body
        let pwd = '';
        // 判断用户提交的数据是否完整
        if (data.username.trim().length <= 0 || data.password.trim().length <= 0 || data.nickname.trim().length <= 0) {
            return res.send({ message: "填写的数据不完整", status: 501, res: data })
        }

        // 密码的加密的幂次
        const saltRound = 10
            // 自动生成加密密码
            // bcrypt.hash('提交的表单密码','加密的幂次',回调函数(err,hashpass))
        bcrypt.hash(data.password, saltRound, (err, hashpass) => {
            if (err) return res.send({ message: '密码加密失败', status: 506 })
            data.password = hashpass
                // 查询用户名是否重复
            let sql = 'select count(*) as count from blog_users where username=?'
            conn.query(sql, data.username, (err, result) => {
                if (err) return res.send({ message: 'sql fail', status: 502 })
                if (result[0].count != 0) return res.send({ message: '请更换用户名', status: 503, count: result })
                    // 执行注册逻辑
                data.ctime = moment().format('YYYY-MM-DD HH:mm:ss')
                data.isdel = 0
                let sql = 'insert into blog_users set ?'
                conn.query(sql, data, (err, result) => {
                    if (err) return res.send({ message: 'sql fail', status: 504 })
                    if (result.affectedRows != 1) return res.send({ message: "注册失败", status: 505, res: data })
                    return res.send({ message: "注册成功", status: 200 })
                })
            })
        })


    },
    upload: (req, res) => {
        res.render('./../views/article/upload.ejs', { name: '文件上传', islogin: false })
    },
    uploadDo: (req, res) => {
        var form = new multiparty.Form()
        form.parse(req, function(err, fields, files) {});

        if (req.body) {
            return res.send("成功：")
        }
        return res.send("失败")
    }

}