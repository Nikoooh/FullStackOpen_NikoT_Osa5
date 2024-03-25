const jwt = require('jsonwebtoken')
const User = require('../models/user')

const errorHandler = (error, request, response, next) => {
    if (error === "shortInput") {
      return response.status(400).json({error: "password and username must be atleast 3 characters long"})
    }
  
    if (error === "noInput") {
      return response.status(400).json({error: "username and password must be provided"})
    }
  
    if (error === "uniqueUser") {
      return response.status(400).json({error: "username taken"})
    }
  
    if (error.name === "JsonWebTokenError") {
      return response.status(400).json({error: "token invalid or missing"})
    }
  
    if (error.name === "CastError") {
      return response.status(400).json({error: "malformatted id"})
    }

    if (error === "missingInfo") {
        return response.status(400).json({error: "title or url missing"})
    }
    
    next()

}
  
const unknownEndpoint = (error, request, response, next) => {
    response.status(404).json({error: "unknown endpoint"})
}
  
const tokenExtractor = async (request, response, next) => {
    const authorization = request.get('Authorization')
    let token
    
    if (authorization && authorization.startsWith('Bearer ')) {
        token = authorization.replace('Bearer ', '')  
    }
    
    try {
        let decodedToken = jwt.verify(token, process.env.SECRET)
        request.token = decodedToken
    } catch (error) {
        next(error)
    } 

    next()

}

const userExtractor = async (request, response, next) => {

  const user = await User.findById(request.token?.id)

  if (user) {
    request.user = user
  }

  next()

}

module.exports = {
    errorHandler,
    unknownEndpoint,
    tokenExtractor,
    userExtractor
}