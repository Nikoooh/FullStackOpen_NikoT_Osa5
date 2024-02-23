import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import Login from './components/Login'
import Notification from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const formRef = useRef()

  const logOut = () => {
    window.localStorage.removeItem('user')
    setUser(null)
  } 

  const handleNew = (e) => {
    e.preventDefault()

    const title = formRef.current.title.value
    const author = formRef.current.author.value
    const url = formRef.current.url.value

    if (title.length > 0 && author.length > 0 && url.length > 0) {
      setNotification({message: "a new blog created", type: "success"})
      setTimeout(() => {
        setNotification(null)
      }, 3000)
    } else {
      setNotification({message: "input title, author, url", type: "error"})
      setTimeout(() => {
        setNotification(null)
      }, 3000)
    }

    
  }

  useEffect(() => {
    const localUser = window.localStorage.getItem('user')
    if (localUser) {
      setUser(JSON.parse(localUser))
    }

    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  console.log(blogs, user);

  return (
    <div>
      {(user) ?
          <div> 
            <h2>Blogs</h2>           
            <p>{user.name} logged in</p>         
            <button onClick={logOut}>Log out</button>    

            <form style={{marginBottom: 25}} ref={formRef} onSubmit={handleNew}> 
              <h2>Create new</h2>

              
              <a>title:</a> <input name='title'></input>  
              <br/><br/>
              <a>author:</a>  <input name='author'></input>  
              <br/><br/>
              <a>url:</a> <input name='url'></input>  
              <br/><br/>

              <button type='submit'>Create</button>
            </form>    

            <Notification message={notification} />
            
            {blogs.map(blog =>
              <Blog key={blog.id} blog={blog} />
            )}
          </div>
        :
          <Login setUser={setUser} notification={notification} setNotification={setNotification}/>
      }
   
    </div>
  )
}

export default App