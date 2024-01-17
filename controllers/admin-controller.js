const { Restaurant } = require('../models')
const localFileHandler = require('../helpers/file-helpers')

const adminController = {

  // 後台取得所有餐廳
  getRestaurants: async (req, res, next) => {
    try {
      const restaurants = await Restaurant.findAll({ raw: true })
      res.render('admin/restaurants', { restaurants })
    } catch (error) {
      next(error)
    }
  },

  // 新增餐廳頁
  createRestaurant: (req, res) => {
    return res.render('admin/create-restaurant')
  },

  // 新增餐廳
  postRestaurant: async (req, res, next) => {
    try {
      const { name, tel, address, openingHours, description } = req.body
      if (!name) throw new Error('Restaurant name is required!')

      const { file } = req
      const filePath = await localFileHandler(file)

      await Restaurant.create({
        name,
        tel,
        address,
        openingHours,
        description,
        image: filePath || null
      })
      req.flash('success_messages', 'restaurant was successfully created')
      res.redirect('/admin/restaurants')
    } catch (error) {
      next(error)
    }
  },

  // 取得指定餐廳
  getRestaurant: async (req, res, next) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, { raw: true })
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      res.render('admin/restaurant', { restaurant })
    } catch (error) {
      next(error)
    }
  },

  // 取得指定餐廳更新頁
  editRestaurant: async (req, res, next) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, { raw: true })
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      res.render('admin/edit-restaurant', { restaurant })
    } catch (error) {
      next(error)
    }
  },

  // 更新餐廳
  putRestaurant: async (req, res, next) => {
    try {
      const { name, tel, address, openingHours, description } = req.body
      if (!name) throw new Error('Restaurant name is required!')

      const { file } = req
      const [restaurant, filePath] = await Promise.all([
        Restaurant.findByPk(req.params.id),
        localFileHandler(file)
      ])

      if (!restaurant) throw new Error("Restaurant didn't exist!")

      await restaurant.update({
        name,
        tel,
        address,
        openingHours,
        description,
        image: filePath || restaurant.image
      })
      req.flash('success_messages', 'restaurant was successfully to update')
      res.redirect('/admin/restaurants')
    } catch (error) {
      next(error)
    }
  },

  // 刪除餐廳
  deleteRestaurant: async (req, res, next) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id)
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      await restaurant.destroy()
      res.redirect('/admin/restaurants')
    } catch (error) {
      next(error)
    }
  }
}

module.exports = adminController
