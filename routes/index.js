const express = require('express')
const router = express.Router()

const passport = require('../config/passport')

const admin = require('./modules/admin')

const restController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')
const { authenticated, authenticatedAdmin } = require('../middleware/auth')
const { generalErrorHandler } = require('../middleware/error-handler')

router.use('/admin', authenticatedAdmin, admin) // 管理者身份驗證, 導到後台 admin 路徑
router.get('/signup', userController.signUpPage) // 取得註冊頁
router.post('/signup', userController.signUp) // 使用者註冊處理
router.get('/signin', userController.signInPage) // 取得登入頁
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn) // 登入處理
router.get('/logout', userController.logout) // 登出

router.get('/restaurants/:id/dashboard', authenticated, restController.getDashboard) // 取得指定餐廳 dashboard
router.get('/restaurants/:id', authenticated, restController.getRestaurant) // 取得指定餐廳
router.get('/restaurants', authenticated, restController.getRestaurants) // 取得所有餐廳

router.use('/', (req, res) => res.redirect('/restaurants')) // 設定 fallback 路由，其他路由條件都不符合時，最終會通過的路由

router.use('/', generalErrorHandler) // 錯誤訊息處理

module.exports = router
