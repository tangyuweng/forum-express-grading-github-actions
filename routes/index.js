const express = require('express')
const router = express.Router()

const passport = require('../config/passport')

const admin = require('./modules/admin')

const restController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')
const commentController = require('../controllers/comment-controller')
const { authenticated, authenticatedAdmin } = require('../middleware/auth')
const { generalErrorHandler } = require('../middleware/error-handler')
const upload = require('../middleware/multer')

router.use('/admin', authenticatedAdmin, admin) // 管理者身份驗證, 導到後台 admin 路徑
router.get('/signup', userController.signUpPage) // 取得註冊頁
router.post('/signup', userController.signUp) // 使用者註冊處理
router.get('/signin', userController.signInPage) // 取得登入頁
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn) // 登入處理
router.get('/logout', userController.logout) // 登出

router.get('/restaurants/feeds', authenticated, restController.getFeeds) // 取得最新動態
router.get('/restaurants/:id/dashboard', authenticated, restController.getDashboard) // 取得指定餐廳 dashboard
router.get('/restaurants/:id', authenticated, restController.getRestaurant) // 取得指定餐廳
router.get('/restaurants', authenticated, restController.getRestaurants) // 取得所有餐廳

router.delete('/comments/:id', authenticatedAdmin, commentController.deleteComment) // 管理者才可刪除留言，需要加入管理者驗證
router.post('/comments', authenticated, commentController.postComment) // 新增留言

router.post('/favorite/:restaurantId', authenticated, userController.addFavorite) // 加入喜歡餐廳
router.delete('/favorite/:restaurantId', authenticated, userController.deleteFavorite) // 移除喜歡餐廳

router.post('/like/:restaurantId', authenticated, userController.addLike)
router.delete('/like/:restaurantId', authenticated, userController.removeLike)

router.post('/following/:userId', authenticated, userController.addFollowing)
router.delete('/following/:userId', authenticated, userController.removeFollowing)

router.get('/users/top', authenticated, userController.getTopUsers)
router.get('/users/:id/edit', authenticated, userController.editUser) // 取得編輯 Profile 頁
router.get('/users/:id', authenticated, userController.getUser) // 取得使用者 Profile
router.put('/users/:id', authenticated, upload.single('image'), userController.putUser) // 修改 Profile

router.use('/', (req, res) => res.redirect('/restaurants')) // 設定 fallback 路由，其他路由條件都不符合時，最終會通過的路由

router.use('/', generalErrorHandler) // 錯誤訊息處理

module.exports = router
