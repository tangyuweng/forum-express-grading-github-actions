const bcrypt = require('bcryptjs')
const db = require('../models')
const { User } = db

const userController = {
  singUpPage: (req, res) => {
    res.render('signup')
  },

  singUp: async (req, res, next) => {
    try {
      if (req.body.password !== req.body.passwordCheck) {
        throw new Error('Password do not match!')
      }

      const existingUser = await User.findOne({
        where: { email: req.body.email }
      })
      if (existingUser) throw new Error('Email already exists!')

      const hash = await bcrypt.hash(req.body.password, 10)
      await User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash
      })

      req.flash('success_messages', '成功註冊帳號！')
      res.redirect('/signin')
    } catch (error) {
      next(error)
    }
  }
}

module.exports = userController
