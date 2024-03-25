const app = require('../app')
const listHelper = require('../utils/list_helper')
const supertest = require('supertest')
const mongoose = require('mongoose')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

// Osa4 A tehtävät

test('dummy returns one', () => {
  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('total likes', () => {
    test('when list has only one blog equals the likes of that', () => {
      const result = listHelper.totalLikes([blogs[0]])
      expect(result).toBe(7)
    })

    test('when list has 3 blogs equals to the sum of their likes', () => {
        const result = listHelper.totalLikes([...blogs.slice(0,3)])
        expect(result).toBe(24)
    })

    test('when list has all blogs equals to the sum of their likes', () => {
        const result = listHelper.totalLikes(blogs)
        expect(result).toBe(36)
    })

})

describe('favourite blog', () => {
    test('is the one with the most likes', () => {
      const result = listHelper.favouriteBlog(blogs)
      expect(result).toEqual({
        _id: "5a422b3a1b54a676234d17f9",
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12,
        __v: 0
      })
    })

})

describe('author with most blogs', () => {
    test('is the one who has made the most blogs', () => {
      const result = listHelper.mostBlogs(blogs)
      expect(result).toEqual({
        author: "Robert C. Martin",
        blogs: 3
      })
    })

})

describe('most liked author', () => {
    test('is the one who has the most likes', () => {
      const result = listHelper.mostLikes(blogs)
      expect(result).toEqual({
        author: "Edsger W. Dijkstra",
        likes: 17
      })
    })

})

const blogs = [
    {
      _id: "5a422a851b54a676234d17f7",
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 7,
      __v: 0
    },
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
      __v: 0
    },
    {
      _id: "5a422b3a1b54a676234d17f9",
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
      __v: 0
    },
    {
      _id: "5a422b891b54a676234d17fa",
      title: "First class tests",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
      likes: 10,
      __v: 0
    },
    {
      _id: "5a422ba71b54a676234d17fb",
      title: "TDD harms architecture",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
      likes: 0,
      __v: 0
    },
    {
      _id: "5a422bc61b54a676234d17fc",
      title: "Type wars",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
      likes: 2,
      __v: 0
    }  
]

// Osa 4 B

let token

beforeAll(async () => {
  await api.post('/api/users')
      .send({
        username: "TestiUser2",
        name: "NikoToivanen",
        password: "salasana123"
      })

  const getToken = await api.post('/login').send({username: "TestiUser2", password: "salasana123"})
  token = getToken.body
})

beforeEach(async () => {
  await Blog.deleteMany({})

  await Promise.all(initBlogs.map(async (blog) => {
    let newBlogObj = new Blog(blog)
    await newBlogObj.save()
  }));

})

test('two blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(2)

})

test('blogs are identified with an id field', async () => {
  const response = await api.get('/api/blogs')

  response.body.forEach(blog => {
    expect(blog.id).toBeDefined()
  })
  
})

test('adding one blog to the test database', async () => {

  const firstResponse = await api.get('/api/blogs')

  await api.post('/api/blogs')
    .send({
      title: "This is test database",
      author: "Testailija",
      url: "https://test.kom",
      likes: 12
    })   
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const secondsResponse = await api.get('/api/blogs')
  let sum = secondsResponse.body.length - firstResponse.body.length
  expect(sum).toEqual(1)

})

test('if no like is given, likes are zero', async () => {
  const response = await api.post('/api/blogs')
    .send({
      title: "No like given",
      author: "Likeless",
      url: "https://test.kom"
    })
    .expect(201)

    expect(response.body.likes).toBe(0)
})

test('if no title or url, response code is 400', async () => {
  await api.post('/api/blogs')
    .send({
      title: "No url",
      author: "Urless",
      likes: 4
    })
    .expect(400)

  await api.post('/api/blogs')
    .send({
      author: "Titleless",
      url: "https://notitlehere.com",
      likes: 4
    })
    .expect(400)  
})

test('deleting document with correct id results in status 204, with wrong 404', async () => {
  await api.post('/api/blogs')
    .send({
      title: "Delete",
      author: "Dlt",
      url: "https://test.kom",
      likes: 5
    })

  const deleteResponse = await api.get('/api/blogs')  

  await api.delete(`/api/blogs/${deleteResponse.body[deleteResponse.body.length - 1].id}`)
    .expect(204)

  await api.delete(`/api/blogs/123`)
    .expect(404)  
  
})

test('updating blogs', async () => {

  const getBlogs = await api.get('/api/blogs')
  const id = getBlogs.body[0].id
  await api.put(`/api/blogs/${id}`)
    .send({
      title: "Updated blog",
      likes: 53
    })
    .expect(201)
    
  const resp = await api.get('/api/blogs')

  expect(resp.body[0]).toEqual({
    id: id,
    title: "Updated blog",
    author: "santa52",
    url: "https://test.com",
    likes: 53
  }) 

})

afterAll(async () => {
  await Blog.deleteMany({})
  await mongoose.connection.close
})

const initBlogs = [
  {
    title: "Testing blog 1",
    author: "santa52",
    url: "https://test.com",
    likes: 186
  },
  {    
    title: "Testing blog 2",
    author: "gremlin1",
    url: "https://testingurl.com",
    likes: 64
  }
]

// Osa 4 D

beforeEach(async () => {
  await User.deleteMany({})
})

describe('creating a', () => {
  test('unique new user results in success', async () => {
    const request = await api.post('/api/users')
      .send({
        username: "TestiUser1",
        name: "NikoToivanen",
        password: "salasana123"
      })
      .expect(201)
  })

  test('not unique new user results in error', async () => {
    await api.post('/api/users')
      .send({
        username: "TestiUser2",
        name: "NikoToivanen",
        password: "salasana123"
      })
      .expect(201)

      await api.post('/api/users')
      .send({
        username: "TestiUser2",
        name: "NikoToivanen",
        password: "salasana123"
      })
      .expect(400)
  })

  test('user with no password results in error', async () => {
    await api.post('/api/users')
      .send({
        username: "TestiUser2",
        name: "NikoToivanen"
      })
      .expect(400)
  })

})

afterAll(async () => {
  await mongoose.connection.close()
})