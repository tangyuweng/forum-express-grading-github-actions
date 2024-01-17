const fs = require('fs').promises

// const localFileHandler = file => { // file 是 multer 處理完的檔案
//   return new Promise((resolve, reject) => {
//     if (!file) return resolve(null)
//     const fileName = `upload/${file.originalname}`
//     return fs.promises.readFile(file.path)
//       .then(data => fs.promises.writeFile(fileName, data))
//       .then(() => resolve(`/${fileName}`))
//       .catch(err => reject(err))
//   })
// }

const localFileHandler = async file => {
  try {
    if (!file) return null

    const fileName = `upload/${file.originalname}`
    const data = await fs.readFile(file.path)
    await fs.writeFile(fileName, data)

    return `/${fileName}`
  } catch (error) {
    console.log('Error_msg', error)
    throw error
  }
}

module.exports = localFileHandler
