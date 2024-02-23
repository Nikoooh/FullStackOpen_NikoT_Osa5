const http = require('http')
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const blogRouter = require('./controllers/blogRouter')
const config = require('./utils/config')
const loginRouter = require('./controllers/loginRouter')
const middleware = require('./utils/middleware')
const userRouter = require('./controllers/userRouter')

mongoose.connect(config.MONGODB_URI)

app.use(cors())
app.use(express.json())

app.use(middleware.userExtractor, blogRouter)
app.use(userRouter)
app.use(loginRouter)

app.use(middleware.errorHandler)

module.exports = app