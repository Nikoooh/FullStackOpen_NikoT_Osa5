import { useRef } from 'react'
import blogService from '../services/blogs'
import PropTypes from 'prop-types'

const NewBlog = ({ setNotification, setVisible, getBlogs }) => {

  const formRef = useRef()
  const handleNew = async (e) => {
    e.preventDefault()
  
    const title = formRef.current.title.value
    const author = formRef.current.author.value
    const url = formRef.current.url.value
    const newBlog = {
      title: title,
      author: author,
      url: url
    }
  
    if (title.length > 0 && author.length > 0 && url.length > 0) {
      try {
        const yhteys = await blogService.newBlog(newBlog)
        if (yhteys.status === 201) {
          setNotification({message: 'a new blog created', type: 'success'})
          setTimeout(() => {
            setNotification({message: '', type: null})
          }, 3000)
          getBlogs()
          setVisible(false) 
          formRef.current.title.value = ''
          formRef.current.author.value = ''
          formRef.current.url.value = ''
        }
      } catch (error) {
        console.log(error);
      }
          
    } else {
      setNotification({message: 'input title, author, url', type: 'error'})
      setTimeout(() => {
        setNotification({message: '', type: null})
      }, 3000)
    } 
  }
  return (
    <div>
      <form style={{marginBottom: 5}} ref={formRef} onSubmit={handleNew}> 
        <h2>Create new</h2>
  
        <a>title:</a> <input name='title'></input>  
        <br/><br/>
        <a>author:</a>  <input name='author'></input>  
        <br/><br/>
        <a>url:</a> <input name='url'></input>  
        <br/><br/>
        <button type='submit'>Create</button>
      </form>    
    </div>
  )
}

NewBlog.propTypes = {
  getBlogs: PropTypes.func.isRequired
}

export default NewBlog