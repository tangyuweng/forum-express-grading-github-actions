// auth-helpers: 處理各種和使用者身分驗證相關

// 從 passport 取得登入者資料
const getUser = req => {
  return req.user || null
}

// 從 passport 驗證使用者已經是否登入
const ensureAuthenticated = req => {
  return req.isAuthenticated()
}

module.exports = {
  getUser,
  ensureAuthenticated
}
