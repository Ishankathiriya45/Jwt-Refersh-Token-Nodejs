const fs = require('fs')
const path = require('path')

const uploadImg = (fileName, buffer) => {
    let imagePath = path.join('public/uploads/product', fileName)
    let writeStream = fs.createWriteStream(imagePath)
    writeStream.write(buffer)
}

module.exports = {
    uploadImg
}