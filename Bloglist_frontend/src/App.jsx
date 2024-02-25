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
            <NewBlog setNotification={setNotification} setVisible={setVisible} getBlogs={getBlogs}/>
          </div>
       
          <button style={{marginBottom: 15}} onClick={() => setVisible(!visible)}>{(!visible) ? 'New blog' : 'Cancel'}</button>
          <Notification message={notification} />
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} getBlogs={getBlogs} user={user}/>
          )}
        </div>
        :
        <Login setUser={setUser} notification={notification} setNotification={setNotification}/>
      }
   
    </div>
  )
}

export default App