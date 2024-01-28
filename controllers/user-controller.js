const bcrypt = require('bcryptjs')
const localFileHandler = require('../helpers/file-helpers')
const { User, Comment, Restaurant, Favorite, Like, Followship } = require('../models')
const helper = require('../helpers/auth-helpers')

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
  },

  // 取得使用者 Profile
  getUser: async (req, res, next) => {
    try {
      const currentUser = helper.getUser(req)
      if (currentUser.id !== Number(req.params.id)) throw new Error("User didn't exist!")

      const user = await User.findByPk(req.params.id, {
        include: [
          {
            model: Comment,
            include: [
              {
                model: Restaurant,
                attributes: ['image']
              }
            ]
          }
        ]
      })
      if (!user) throw new Error("User didn't exist!")
      // console.log(user.toJSON())
      res.render('users/profile', { user: user.toJSON() })
    } catch (error) {
      next(error)
    }
  },

  // 取得編輯 Profile 頁
  editUser: async (req, res, next) => {
    try {
      const currentUser = helper.getUser(req)
      if (currentUser.id !== Number(req.params.id)) throw new Error("User didn't exist!")

      const user = await User.findByPk(req.params.id)
      if (!user) throw new Error("User didn't exist!")
      res.render('users/edit', { user: user.toJSON() })
    } catch (error) {
      next(error)
    }
  },

  // 修改 Profile
  putUser: async (req, res, next) => {
    try {
      const currentUser = helper.getUser(req)
      if (currentUser.id !== Number(req.params.id)) throw new Error("User didn't exist!")

      const { name } = req.body
      const { file } = req

      if (!name.trim()) throw new Error('User name is required!')

      const [user, filePath] = await Promise.all([
        User.findByPk(req.params.id),
        localFileHandler(file)
      ])

      if (!user) throw new Error("User didn't exist!")

      await user.update({
        name,
        image: filePath || user.image
      })

      req.flash('success_messages', '使用者資料編輯成功')
      res.redirect(`/users/${user.id}`)
    } catch (error) {
      next(error)
    }
  },

  // 加入喜歡餐廳
  addFavorite: async (req, res, next) => {
    try {
      const { restaurantId } = req.params

      const [restaurant, favorite] = await Promise.all([
        Restaurant.findByPk(restaurantId), // 要收藏的這家餐廳是否存在？
        Favorite.findOne({ // 確認這個收藏的關聯是否存在？
          where: {
            userId: req.user.id,
            restaurantId
          }
        })
      ])

      if (!restaurant) throw new Error("Restaurant didn't exist!")
      if (favorite) throw new Error('You have favorited this restaurant!')

      await Favorite.create({
        userId: req.user.id,
        restaurantId
      })

      res.redirect('back')
    } catch (error) {
      next(error)
    }
  },

  // 移除喜歡餐廳
  deleteFavorite: async (req, res, next) => {
    try {
      const favorite = await Favorite.findOne({ // 確認收藏關聯是否存在
        where: {
          userId: req.user.id,
          restaurantId: req.params.restaurantId
        }
      })

      if (!favorite) throw new Error("You haven't favorited this restaurant!")

      await favorite.destroy()

      res.redirect('back')
    } catch (error) {
      next(error)
    }
  },

  addLike: async (req, res, next) => {
    try {
      const { restaurantId } = req.params
      const [restaurant, like] = await Promise.all([
        Restaurant.findByPk(restaurantId),
        Like.findOne({
          where: {
            userId: req.user.id,
            restaurantId
          }
        })
      ])

      if (!restaurant) throw new Error("Restaurant didn't exist!")
      if (like) throw new Error('You have liked this restaurant!')

      await Like.create({
        userId: req.user.id,
        restaurantId
      })

      res.redirect('back')
    } catch (error) {
      next(error)
    }
  },

  removeLike: async (req, res, next) => {
    try {
      const like = await Like.findOne({
        where: {
          userId: req.user.id,
          restaurantId: req.params.restaurantId
        }
      })

      if (!like) throw new Error("You haven't liked this restaurant!")

      await like.destroy()

      res.redirect('back')
    } catch (error) {
      next(error)
    }
  },

  getTopUsers: async (req, res, next) => {
    try {
      const users = await User.findAll({
        include: [{ model: User, as: 'Followers' }]
      })

      const result = users
        .map(user => ({
          ...user.toJSON(),
          followerCount: user.Followers.length, // 計算追蹤者人數
          isFollowed: req.user.Followings.some(f => f.id === user.id) // 判斷目前登入使用者是否已追蹤該 user 物件
        }))
        .sort((a, b) => b.followerCount - a.followerCount)

      res.render('top-users', { users: result })
    } catch (error) {
      next(error)
    }
  },

  addFollowing: async (req, res, next) => {
    try {
      const { userId } = req.params
      const [user, followship] = await Promise.all([
        User.findByPk(userId),
        Followship.findOne({
          where: {
            followerId: req.user.id,
            followingId: userId
          }
        })
      ])

      if (!user) throw new Error("User didn't exist!")
      if (followship) throw new Error('You are already followed this user!')

      await Followship.create({
        followerId: req.user.id,
        followingId: userId
      })

      res.redirect('back')
    } catch (error) {
      next(error)
    }
  },

  removeFollowing: async (req, res, next) => {
    try {
      const { userId } = req.params
      const followship = await Followship.findOne({
        where: {
          followerId: req.user.id,
          followingId: userId
        }
      })

      if (!followship) throw new Error("You haven't followed this user!")

      await followship.destroy()

      res.redirect('back')
    } catch (error) {
      next(error)
    }
  }
}

module.exports = userController
