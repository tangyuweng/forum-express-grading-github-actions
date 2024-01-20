const express = require('express')
const router = express.Router()

const adminController = require('../../controllers/admin-controller')
const categoryController = require('../../controllers/category-controller')

const upload = require('../../middleware/multer')

router.get('/restaurants/create', adminController.createRestaurant) // 新增餐廳頁
router.get('/restaurants/:id/edit', adminController.editRestaurant) // 取得指定餐廳更新頁
router.get('/restaurants/:id', adminController.getRestaurant) // 取得指定餐廳
router.put('/restaurants/:id', upload.single('image'), adminController.putRestaurant) // 更新餐廳
router.delete('/restaurants/:id', adminController.deleteRestaurant) // 刪除餐廳
router.get('/restaurants', adminController.getRestaurants) // 後台取得所有餐廳
router.post('/restaurants', upload.single('image'), adminController.postRestaurant) // 新增餐廳

router.patch('/users/:id', adminController.patchUser) // 更改使用者權限
router.get('/users', adminController.getUsers) // 後台取得所有使用者

router.get('/categories', categoryController.getCategories) // 後台取得所種類
router.post('/categories', categoryController.postCategory) // 新增種類

router.get('/', (req, res) => res.redirect('/admin/restaurants'))

module.exports = router
