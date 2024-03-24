const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const express = require('express')
const bcrypt = require('bcrypt')
const middleware = require('./../utils/middleware')

blogRouter.use(express.json())

blogRouter.get('/api/blogs', async (request, response) => {

  const blogs = await Blog.find({}).populate('user', {username: 1, name: 1})
  response.status(200).json(blogs)  

})

blogRouter.post('/api/blogs', middleware.tokenExtractor, async (request, response, next) => {
  try {

    const body = request.body
    const user = await User.findById(request.token.id)

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0,
      user: request.token.id
    })

    if (!blog.title || !blog.url) {
      next("missingInfo")
    } else {
      
      const blogs = await blog.save()
      user.blogs = user.blogs.concat(blogs._id)
      await user.save()

      response.status(201).json(blogs)
    }
  } catch (error) {
    next(error)
  }
  
})

blogRouter.delete('/api/blogs/:id', middleware.tokenExtractor, async (request, response) => {

  try {
    const toBeDeleted = await Blog.findById(request.params.id)

    if (toBeDeleted) {
      if (toBeDeleted.user.toString() === request.token.id) {
        const deleteBlog = await Blog.findByIdAndDelete(request.params.id)
        response.status(204).end()
      } else {
        response.status(404).end()
      }    
    } else {
      response.status(404).end()
    }
    
  } catch (error) {
    console.log(error);
    response.status(404).end()
  }
  
})

blogRouter.put('/api/blogs/:id', async (request, response) => {
  console.log(request.body);
  try {
    const body = request.body
    const blogs = await Blog.findOneAndUpdate(
      { _id: request.params.id },
      body,
      {new: true}
    )

    response.status(201).json(blogs)

  } catch (error) {
    response.status(404).end()
  }
})

module.exports = blogRouter