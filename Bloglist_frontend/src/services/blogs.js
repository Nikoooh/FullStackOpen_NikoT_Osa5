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

export default { getAll, login }