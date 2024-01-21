const { Restaurant, Category } = require('../models')

const restaurantController = {

  // 取得所有餐廳資料
  getRestaurants: async (req, res, next) => {
    try {
      const categoryId = Number(req.query.categoryId) || ''

      const [restaurants, categories] = await Promise.all([
        await Restaurant.findAll({
          include: Category,
          where: {
            ...categoryId ? { categoryId } : {}
          },
          raw: true,
          nest: true
        }),
        Category.findAll({ raw: true })
      ])

      const data = restaurants.map(r => ({
        ...r,
        description: r.description.substring(0, 50) // description 會覆蓋掉原本 r 裡面的 description
      }))

      res.render('restaurants', { restaurants: data, categories, categoryId })
    } catch (error) {
      next(error)
    }
  },

  // 取得指定餐廳
  getRestaurant: async (req, res, next) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, {
        include: Category,
        // raw: true,
        nest: true
      })
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      await restaurant.increment('viewCounts')
      res.render('restaurant', { restaurant: restaurant.toJSON() })
    } catch (error) {
      next(error)
    }
  },

  // 取得指定餐廳 dashboard
  getDashboard: async (req, res, next) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, {
        include: Category,
        nest: true,
        raw: true
      })
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      res.render('dashboard', { restaurant })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = restaurantController
