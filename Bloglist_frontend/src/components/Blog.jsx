import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, getBlogs, user }) => {

  const [visible, setVisible] = useState(false)

  const handleLike = async () => {

    const newBlog = blog
    newBlog.likes = newBlog.likes + 1

    try {
      const yhteys = await blogService.editBlog(newBlog)
      if (yhteys.status === 201) {
        getBlogs()
      }
    } catch (error) {
      console.log(error);
    }
  }

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
      {blog.title} {blog.author}
      <button onClick={() => setVisible(!visible)}>{(visible) ? 'hide' : 'view'}</button>
      {(visible) ?
        <div>
          <p>{blog.url}</p>
          <div> 
            likes: {blog.likes} <button onClick={handleLike}>like</button>
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