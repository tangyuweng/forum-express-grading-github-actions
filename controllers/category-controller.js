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
  },

  // 新增種類
  postCategory: async (req, res, next) => {
    try {
      const { name } = req.body
      if (!name) throw new Error('Category name is required!')
      await Category.create({ name })
      res.redirect('/admin/categories')
    } catch (error) {
      next(error)
    }
  }
}

module.exports = categoryController
