const { Restaurant } = require('../models')

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

      await Restaurant.create({
        name,
        tel,
        address,
        openingHours,
        description
      })
      req.flash('success_messages', 'restaurant was successfully created')
      res.redirect('/admin/restaurants')
    } catch (error) {
      next(error)
    }
  }
}

module.exports = adminController
