import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import Login from './components/Login'
import NewBlog from './components/NewBlog'
import Notification from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState({message: '', type: null})
  const [visible, setVisible] = useState(false)

  const getBlogs = () => {
    blogService.getAll().then(blogs =>{
      const sort = blogs.sort((a, b) => b.likes - a.likes)
      setBlogs( sort )
    })  
  }

  const logOut = () => {
    window.localStorage.removeItem('user')
    setUser(null)
  }

  const createNew = async (newBlog) => {
    try {
      const yhteys = await blogService.newBlog(newBlog)
      if (yhteys.status === 201) {
        setNotification({message: `new blog ${newBlog.title} by ${newBlog.author} created`, type: 'success'})
        setTimeout(() => {
          setNotification({message: '', type: null})
        }, 3000)
        getBlogs()
        setVisible(false) 
      }
    } catch (error) {
      console.log(error);
    }      
  } 
  
  const handleLike = async id => {

    const blog = blogs.find((blog) => blog.id === id)
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

  useEffect(() => {
    const localUser = window.localStorage.getItem('user')
    if (localUser) {
      setUser(JSON.parse(localUser))
    }

    getBlogs() 
  }, [])

  return (
    <div>
      {(user) ?
        <div> 
          <h2>Blogs</h2>           
          <p>{user.name} logged in</p>         
          <button onClick={logOut}>Log out</button>    
          <br/>
          <br/>            
      
          <div style={{display: visible ? 'block' : 'none'}}> 
            <NewBlog setNotification={setNotification} setVisible={setVisible} getBlogs={getBlogs} createNew={createNew}/>
          </div>
       
          <button style={{marginBottom: 15}} onClick={() => setVisible(!visible)}>{(!visible) ? 'New blog' : 'Cancel'}</button>
          <Notification message={notification} />
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} getBlogs={getBlogs} user={user} id={blog.id} handleLike={handleLike} />
          )}
        </div>
        :
        <Login setUser={setUser} notification={notification} setNotification={setNotification}/>
      }
   
    </div>
  )
}

export default App