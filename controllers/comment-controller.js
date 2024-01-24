const { Restaurant, User, Comment } = require('../models')

const commentController = {
  // 新增留言
  postComment: async (req, res, next) => {
    try {
      const { text, restaurantId } = req.body
      const userId = req.user.id

      if (!text) throw new Error('Comment is required!')

      const [user, restaurant] = await Promise.all([
        User.findByPk(userId),
        Restaurant.findByPk(restaurantId)
      ])

      if (!user) throw new Error("User didn't exist!")
      if (!restaurant) throw new Error("Restaurants did't exist!")

      const comment = await Comment.create({ text, userId, restaurantId })

      if (!comment) throw new Error('留言失敗')

      res.redirect(`/restaurants/${restaurantId}}`)
    } catch (error) {
      next(error)
    }
  },

  // 刪除留言
  deleteComment: async (req, res, next) => {
    try {
      const comment = await Comment.findByPk(req.params.id)
      if (!comment) throw new Error("Comment didn't exist!")

      await comment.destroy()

      res.redirect(`/restaurants/${comment.restaurantId}`)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = commentController
