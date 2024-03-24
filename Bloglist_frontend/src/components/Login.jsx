import { useRef } from 'react'
import blogService from '../services/blogs'
import Notification from './Notification'

const Login = ({ setUser, notification, setNotification }) => {

  const loginRef = useRef()

  const handleLogin = async (e) => {
    e.preventDefault()

    const loginInfo = {
      username: loginRef.current.username.value,
      password: loginRef.current.password.value
    }

    if (loginInfo.username && loginInfo.password) {
      const request = await blogService.login(loginInfo)
        
      if (request.status === 200) {
        setUser(request.data)
        window.localStorage.setItem('user', JSON.stringify(request.data))
      } else {
        setNotification({message: request.response.data.error, type: 'error'})
        setTimeout(() => {
          setNotification({message: '', type: null})
        }, 3000)  
      }
            
    } else {
      setNotification({message: 'missing input', type: 'error'})
      setTimeout(() => {
        setNotification({message: '', type: null})
      }, 3000)            
    }
        
  }

  return (
    <div>
      <h2>Log in to the application</h2>
      <form ref={loginRef} onSubmit={handleLogin}>
        <p>Username</p><input data-testId='username' name='username'/>
        <p>Password</p><input data-testId='password' name='password'/> 
        <br/><br/>  
        <button type='submit'>
            Login
        </button>
      </form>
      <Notification message={notification}/>
    </div>
  )
}

export default Login