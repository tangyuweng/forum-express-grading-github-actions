const { Category } = require('../models')

const categoryController = {

  // 取得所有種類
  getCategories: async (req, res, next) => {
    try {
      const categories = await Category.findAll({ raw: true })
      res.render('admin/categories', { categories })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = categoryController
