const express = require('express')
const router = express.Router()

const adminController = require('../../controllers/admin-controller')

router.get('/restaurants/create', adminController.createRestaurant) // 新增餐廳頁

router.get('/restaurants/:id/edit', adminController.editRestaurant) // 取得指定餐廳更新頁

router.get('/restaurants/:id', adminController.getRestaurant) // 取得指定餐廳

router.put('/restaurants/:id', adminController.putRestaurant) // 更新餐廳

router.get('/restaurants', adminController.getRestaurants) // 後台取得所有餐廳

router.post('/restaurants', adminController.postRestaurant) // 新增餐廳

router.get('/', (req, res) => res.redirect('/admin/restaurants'))

module.exports = router
