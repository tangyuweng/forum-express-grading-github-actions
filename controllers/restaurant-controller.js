const { Restaurant, Category, User, Comment } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')

const restaurantController = {

  // 取得所有餐廳資料
  getRestaurants: async (req, res, next) => {
    try {
      const DEFAULT_LIMIT = 9

      const categoryId = Number(req.query.categoryId) || ''

      const page = Number(req.query.page) || 1
      const limit = Number(req.query.limit) || DEFAULT_LIMIT
      const offset = getOffset(limit, page)

      const [restaurants, categories] = await Promise.all([
        await Restaurant.findAndCountAll({ // findAndCountAll：會傳傳 {count: 3, rows: [rest], [rest], [rest]}
          include: Category,
          where: {
            ...categoryId ? { categoryId } : {}
          },
          limit,
          offset,
          raw: true,
          nest: true
        }),
        Category.findAll({ raw: true })
      ])

      const data = restaurants.rows.map(r => ({
        ...r,
        description: r.description.substring(0, 50) // description 會覆蓋掉原本 r 裡面的 description
      }))

      res.render('restaurants', {
        restaurants: data,
        categories,
        categoryId,
        pagination: getPagination(limit, page, restaurants.count)
      })
    } catch (error) {
      next(error)
    }
  },

  // 取得指定餐廳
  getRestaurant: async (req, res, next) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, {
        include: [
          Category,
          {
            model: Comment,
            include: User
          }
        ],
        order: [
          [Comment, 'createdAt', 'DESC'] // 留言照新舊排序
        ]
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

      const commentCount = await Comment.count({
        where: {
          restaurant_id: restaurant.id
        }
      })

      if (!restaurant) throw new Error("Restaurant didn't exist!")
      res.render('dashboard', { restaurant, commentCount })
    } catch (error) {
      next(error)
    }
  },

  // 取得最新動態
  getFeeds: async (req, res, next) => {
    try {
      const [restaurants, comments] = await Promise.all([
        Restaurant.findAll({
          limit: 10,
          order: [['createdAt', 'DESC']],
          include: [Category],
          nest: true,
          raw: true
        }),
        Comment.findAll({
          limit: 10,
          order: [['createdAt', 'DESC']],
          include: [User, Restaurant],
          nest: true,
          raw: true
        })
      ])

      res.render('feeds', { restaurants, comments })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = restaurantController
