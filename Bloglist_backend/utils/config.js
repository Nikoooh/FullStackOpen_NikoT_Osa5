require('dotenv').config()

let PORT = process.env.PORT
let MONGODB_URI = (process.env.NODE_ENV.trim() === 'test') ? process.env.TEST_MONGODB_URI : process.env.MONGODB_URI

module.exports = {
    MONGODB_URI,
    PORT
}