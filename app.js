const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const fs = require('fs')
const path = require('path')
const session = require('express-session')
var favicon = require('serve-favicon')
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

app.use(session({
    secret: '加密密匙',
    resave: false,
    saveUninitialized: false
}))


//body-parser 必须再router之前注册中间件
app.use(bodyParser.urlencoded({ extended: false }))
    // 使用循环的方式，进行路由的自动注册
fs.readdir(path.join(__dirname, './router/'), (err, filenames) => {
    if (err) return console.log("读取router中的文件失败")
    filenames.forEach(fname => {
        const router = require(path.join(__dirname, './router/', fname))
        app.use(router);
    })
})


// 设置默认采用的模板引擎
app.set('view engine', 'ejs')
    // 设置默认模板所在的目录
app.set('views', './views')
app.use('/node_modules', express.static('./node_modules/'))
    // 监听服务
app.listen(5000, () => {
    console.log("server runing http://127.0.0.1:5000");
})