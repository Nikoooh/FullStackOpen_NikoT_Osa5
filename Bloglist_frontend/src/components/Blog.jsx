import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, getBlogs, user, id, handleLike }) => {

  const [visible, setVisible] = useState(false)

  const handleDelete = async () => {
    const confirmation = window.confirm(`Delete blog ${blog.title} ?`)
    if (confirmation) {
      const yhteys = await blogService.deleteBlog(blog)
      if (yhteys.status === 204) {
        getBlogs()
      }
    }
  }

  return (
    <div style={{borderBottom: '1px solid rgba(5, 5, 5, 0.4)', marginBottom: 10, padding: 4}}>
      <span> {blog.title} </span>
      <span> {blog.author} </span>
      <button onClick={() => setVisible(!visible)}>{(visible) ? 'hide' : 'view'}</button>
      {(visible) ?
        <div>
          <p>{blog.url}</p>
          <div> 
            likes: {blog.likes} <button onClick={() => handleLike(id)}>like</button>
          </div>
          <p>{blog.user.name}</p>
          
          {(user.name === blog.user.name) ?
            <button onClick={handleDelete}>Delete blog</button>
            :
            null
          }
          
        </div>
        :
        null  
      }
    </div>  
  )
}

export default Blog