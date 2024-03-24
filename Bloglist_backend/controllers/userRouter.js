const userRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')

userRouter.post('/api/users', async (request, response, next) => {
    try {
    
      const body = request.body

      if (!body.password || !body.username) {
        next("noInput")
        return;
      }

      const uniqueUser = await User.findOne({
        username: body.username
      })

      if (uniqueUser) {
        next("uniqueUser")
        return;
      }

      if (body.password.length >= 3 && body.username.length >= 3) {
        const passwordHash = await bcrypt.hash(body.password, 10)

        const user = new User({
          username: body.username,
          name: body.name,
          passwordHash: passwordHash
        })

        const users = await user.save()
        response.status(201).json(users)
      } else {    
        next("shortInput")
      }
    } catch (error) {
      next(error)
    }
})
  
userRouter.get('/api/users', async (request, response) => {
    try {
      const users = await User.find({}).populate('blogs', {title: 1, author: 1, url: 1})
      response.status(200).json(users)
    } catch (error) {
      next(error)
    }
})

module.exports = userRouter