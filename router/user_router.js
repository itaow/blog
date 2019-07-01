const express = require('express')
const router = express.Router()
const cts = require('../controller/user_controller')

router.get('/register', cts.register)
router.post('/register', cts.registerDo)

router.get('/login', cts.login)
router.post('/login', cts.loginDo)

router.get('/logout', cts.logOut)

router.get('/upload', cts.upload)
router.post('/upload', cts.uploadDo)
module.exports = router