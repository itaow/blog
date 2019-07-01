const conn = require('../db/db')
const marked = require('marked')
module.exports = {
    // 首页
    index: (req, res) => {
        //使用render之前一定要保证安装和配置了ejs模块
        let data = {}
            // 每页显示的条数
        const pagesize = 6
        const nowpage = Number(req.query.page) || 1

        if (req.session.username) {
            data = {
                name: 'index',
                user: req.session.username,
                islogin: req.session.islogin
            }
        } else {
            data = {
                name: 'index',
                islogin: false
            }
        }
        const sql = `select * from blog_articles ORDER BY id DESC limit ${pagesize*(nowpage-1)},${pagesize};select count(*) as count from blog_articles`
        conn.query(sql, (err, result) => {
            if (err) return res.send({ message: 'sql fail', status: 500 })
            if (result.length == 0) return res.send({ message: '暂无数据', status: 501 })
                // let html = marked(result[])
                // data.infos.count = result[1][0].count
            const totalpage = Math.ceil(result[1][0].count / pagesize)
            data.infos = result[0];
            data.totalpage = totalpage;
            data.nowpage = nowpage;
            res.render('index.ejs', data)
        })

    }

}