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

      const favoritedRestaurantsId = req.user && req.user.FavoritedRestaurants.map(fr => fr.id)
      const likedRestaurants = req.user && req.user.LikedRestaurants.map(like => like.id)

      const data = restaurants.rows.map(r => ({
        ...r,
        description: r.description.substring(0, 50), // description 會覆蓋掉原本 r 裡面的 description
        isFavorited: favoritedRestaurantsId.includes(r.id),
        isLiked: likedRestaurants.includes(r.id)
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
          { model: Comment, include: User },
          { model: User, as: 'FavoritedUsers' },
          { model: User, as: 'LikedUsers' }
        ],
        order: [[Comment, 'createdAt', 'DESC']] // 留言照新舊排序
      })

      if (!restaurant) throw new Error("Restaurant didn't exist!")
      await restaurant.increment('viewCounts')
      const isFavorited = restaurant.FavoritedUsers.some(f => f.id === req.user.id)
      const isLiked = restaurant.LikedUsers.some(like => like.id === req.user.id)

      res.render('restaurant', { restaurant: restaurant.toJSON(), isFavorited, isLiked })
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
  },

  getTopRestaurants: async (req, res, next) => {
    try {
      const restaurants = await Restaurant.findAll({
        include: [{ model: User, as: 'FavoritedUsers' }]
      })

      const result = restaurants
        .map(r => ({
          ...r.toJSON(),
          description: r.description.substring(0, 50),
          favoritedCount: r.FavoritedUsers.length,
          isFavorited: req.user && req.user.FavoritedRestaurants.some(fr => fr.id === r.id)
        }))
        .sort((a, b) => b.favoritedCount - a.favoritedCount)
        .slice(0, 10)
      // console.log(result)
      res.render('top-restaurants', { restaurants: result })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = restaurantController
