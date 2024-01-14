const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcryptjs = require('bcryptjs')
const db = require('../models')
const User = db.User

// set up Passport strategy
passport.use(new LocalStrategy(
  // customize user field
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  // authenticate user
  async (req, email, password, cb) => {
    try {
      const user = await User.findOne({ where: { email } })
      if (!user) return cb(null, false, req.flash('error_messages', '帳號或密碼錯誤！'))
      const passwordMatch = await bcryptjs.compare(password, user.password)
      if (!passwordMatch) return cb(null, false, req.flash('error_messages', '帳號或密碼錯誤！'))
      return cb(null, user)
    } catch (error) {
      return cb(error)
    }
  }
))

// serialize and deserialize user
passport.serializeUser((user, cb) => {
  cb(null, user.id)
})

passport.deserializeUser(async (id, cb) => {
  try {
    let user = await User.findByPk(id)
    user = user.toJSON()
    return cb(null, user)
  } catch (error) {
    cb(error)
  }
})

module.exports = passport
