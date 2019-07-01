const express = require('express')
const router = express.Router()
const ctl = require('../controller/article_controll')
    //显示添加文章的静态页面
router.get('/article/add', ctl.add)
    // 保存文章到数据库中
router.post('/article/add', ctl.addDo)
    // 编辑数据显示页面
router.get('/article/edit/:id', ctl.edit)
    //保存编辑的数据
router.post('/article/edit', ctl.editDo)
    // 文章列表
router.get('/article/list/:userid', ctl.list)
    // 文章详情页面
router.get('/article/info/:id', ctl.showArticleInfo)
    // 删除文章
router.get('/article/del/:id', ctl.del)
module.exports = router