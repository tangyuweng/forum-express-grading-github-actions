const { Restaurant, User, Comment } = require('../models')

const commentController = {
  // 新增留言
  postComment: async (req, res, next) => {
    try {
      const { text, restaurantId } = req.body
      const userId = req.user.id

      const [user, restaurant] = await Promise.all([
        User.findByPk(userId),
        Restaurant.findByPk(restaurantId)
      ])

      if (!user) throw new Error("User didn't exist!")
      if (!restaurant) throw new Error("Restaurants did't exist!")

      await Comment.create({ text, userId, restaurantId })

      res.redirect(`/restaurants/${restaurantId}}`)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = commentController
