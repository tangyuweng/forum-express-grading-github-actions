const { Restaurant, Category } = require('../models')

const restaurantController = {

  // 取得所有餐廳資料
  getRestaurants: async (req, res, next) => {
    try {
      const restaurants = await Restaurant.findAll({
        include: Category,
        raw: true,
        nest: true
      })

      const data = restaurants.map(r => ({
        ...r,
        description: r.description.substring(0, 50) // description 會覆蓋掉原本 r 裡面的 description
      }))

      res.render('restaurants', { restaurants: data })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = restaurantController
