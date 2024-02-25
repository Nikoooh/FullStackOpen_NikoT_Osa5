import axios from 'axios'
const baseUrl = '/api/blogs'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const login = async loginInfo => {
  try {
    const request = await axios.post('http://localhost:3003/login', loginInfo)
    return request
  } catch (error) {
    return error
  }
  
}

const newBlog = async newBlog => {

  const user = JSON.parse(window.localStorage.user)
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${user.token}`
  }

  try {
    const request = await axios.post(baseUrl, newBlog, {
      headers: headers
    })
    return request
  } catch (error) {
    return error
  }
}

const editBlog = async blog => {
  try {
    const request = await axios.put(`${baseUrl}/${blog.id}`, blog)
    return request
  } catch (error) {
    return error
  }  
}

const deleteBlog = async blog => {

  const user = JSON.parse(window.localStorage.user)
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${user.token}`
  }

  try {
    const request = await axios.delete(`${baseUrl}/${blog.id}`, {
      headers: headers
    })
    return request
  } catch (error) {
    return error
  }
}

export default { getAll, login, newBlog, editBlog, deleteBlog }