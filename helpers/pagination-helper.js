const getOffset = (limit, page) => (page - 1) * limit

const getPagination = (limit, page, total) => {
  const totalPage = Math.ceil(total / limit)
  const pages = Array.from({ length: totalPage }, (_, index) => index + 1)
  const currentPage = page < 1 ? 1 : page > totalPage ? totalPage : page // 兩層三元運算子由後往前看
  const prev = currentPage - 1 < 1 ? 1 : currentPage - 1
  const next = currentPage + 1 > totalPage ? totalPage : currentPage + 1

  return {
    totalPage,
    pages,
    currentPage,
    prev,
    next
  }
}

module.exports = {
  getOffset,
  getPagination
}
