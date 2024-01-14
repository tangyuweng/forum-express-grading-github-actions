const bcrypt = require('bcryptjs')
const db = require('../models')
const { User } = db

const userController = {

  // 取得註冊頁
  signUpPage: (req, res) => {
    res.render('signup')
  },

  // 使用者註冊處理
  signUp: async (req, res, next) => {
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
  },

  // 取得登入頁
  signInPage: (req, res) => {
    res.render('signin')
  },

  // 登入處理
  signIn: (req, res) => {
    req.flash('success_messages', '登入成功！')
    res.redirect('/restaurants')
  },

  // 登出
  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  }
}

module.exports = userController
