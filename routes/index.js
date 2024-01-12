const express = require('express')
const router = express.Router()

const restController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')
const admin = require('./modules/admin')

router.use('/admin', admin) // 導到後台 admin 路徑

router.get('/signup', userController.singUpPage) // 取得登入頁

router.post('/signup', userController.singUp) // 登入

router.get('/restaurants', restController.getRestaurants)

// 設定 fallback 路由，其他路由條件都不符合時，最終會通過的路由
router.use('/', (req, res) => res.redirect('/restaurants'))

module.exports = router
