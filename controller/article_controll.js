const conn = require('../db/db')
const moment = require('moment')
const marked = require('marked')
module.exports = {
    add: (req, res) => {
        if (!req.session.islogin) return res.redirect('/')
        res.render('./../views/article/add.ejs', { name: "添加文章", islogin: req.session.islogin, user: req.session.username })
    },
    addDo: (req, res) => {
        if (!req.session.islogin) return res.send({ message: '非法访问', status: 501 })
            // 获取数据 存入数据库
        const body = req.body;
        body.ctime = moment().format("YYYY-MM-DD HH:mm:ss")
        const sql = 'insert into blog_articles set ?'
        conn.query(sql, body, (err, result) => {
            if (err) return res.send({ message: 'sql fail', status: 500 })
            if (!result.affectedRows) return res.send({ message: "数据添加失败", status: 501 })
            res.send({ message: "添加成功", status: 200, insertId: result.insertId })
        })

    },
    edit: (req, res) => {
        if (!req.session.islogin || !req.params.id) return res.redirect('/')
        const id = req.params.id
        const sql = 'select * from blog_articles where id=?'
        conn.query(sql, id, (err, result) => {
            if (err) return res.send({ message: "sql fail", status: 500 })
            if (result.length != 1) return res.send({ message: '数据不存在', status: 501 })
            res.render('./../views/article/edit.ejs', { name: "编辑文章", islogin: req.session.islogin, user: req.session.username, infos: result[0] })
        })
    },
    editDo: (req, res) => {
        if (!req.session.islogin) return res.send({ message: '非法访问', status: 501 })
            //获取数据  存入数据库
        const sql = 'UPDATE blog_articles SET ? WHERE id = ?'
        conn.query(sql, [req.body, req.body.id], (err, result) => {
            if (err) return res.send({
                message: "sql fail",
                status: 500
            })
            if (result.affectedRows != 1) return res.send({
                message: "数据修改不成功",
                status: 501
            })
            return res.send({ message: '数据修改成功', status: 200 })
        })



    },
    list: (req, res) => {
        if (!req.params.userid) return res.redirect('/')
        let data = {}
            // 每页显示的条数
        const pagesize = 6
        const nowpage = Number(req.query.page) || 1
        const userid = req.params.userid
        const sql = `select * from blog_articles where authorId = ? ORDER BY id DESC limit ${pagesize*(nowpage-1)},${pagesize};select count(*) as count from blog_articles where authorId=${userid}`
        conn.query(sql, userid, (err, result) => {
            if (err) return res.send({
                message: "sql fail",
                status: 500
            })
            if (result.length == 0) return res.send({
                message: "数据不存在",
                status: 501
            })
            const totalpage = Math.ceil(result[1][0].count / pagesize)
            data.totalpage = totalpage
            data.nowpage = nowpage
            data.name = '文章列表'
            data.islogin = req.session.islogin
            data.user = req.session.username
            data.infos = result[0]
            console.log(data);
            res.render('./../views/article/list.ejs', data)

        })
    },
    showArticleInfo: (req, res) => {
        if (!req.params.id) return res.redirect('/')
        const id = req.params.id
        sql = 'select * from blog_articles where id=?'
        conn.query(sql, id, (err, result) => {
            if (err) return res.send({
                message: "sql fail",
                status: 500
            })
            if (result.length != 1) return res.send({
                message: "数据不存在",
                status: 501
            })
            const html = marked(result[0].content)
            result[0].content = html

            res.render('./../views/article/info.ejs', { name: "文章详情", islogin: req.session.islogin, user: req.session.username, infos: result[0] })
        })
    },
    del: (req, res) => {
        if (!req.session.islogin) return res.send({ message: '非法访问', status: 501 })
            //获取数据  存入数据库
        const sql = 'delete  from  blog_articles WHERE id = ?'
        conn.query(sql, req.params.id, (err, result) => {
            if (err) return res.send({
                message: "sql fail",
                status: 500
            })
            if (result.affectedRows != 1) return res.send({
                message: "删除不成功",
                status: 501
            })
            return res.send({ message: '数据删除成功', status: 200, url: "/article/list/" + req.session.username.id })
        })
    },

}