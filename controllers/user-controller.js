const bcrypt = require('bcryptjs')
const db = require('../models')
const { User } = db

const userController = {
  singUpPage: (req, res) => {
    res.render('signup')
  },
  singUp: async (req, res) => {
    const hash = await bcrypt.hash(req.body.password, 10)
    await User.create({
      name: req.body.name,
      email: req.body.email,
      password: hash
    })
    res.redirect('/signin')
  }
}

module.exports = userController
