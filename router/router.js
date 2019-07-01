const express = require('express')
const router = express.Router()
const cts = require('../controller/controller')
router.get('/', cts.index)
module.exports = router