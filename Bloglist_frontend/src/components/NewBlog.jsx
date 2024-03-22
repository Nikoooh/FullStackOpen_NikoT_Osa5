import { useState } from 'react'
import PropTypes from 'prop-types'

const NewBlog = ({ setNotification, createNew }) => {

  const [newBlog, setNewBlog] = useState({title: '', url: '', author: ''})
  
  const handleNew = async (e) => {
    e.preventDefault()
  
    if (newBlog.title.length > 0 || newBlog.url.length > 0 || newBlog.author.length > 0) {
      await createNew(newBlog)
      setNewBlog({title: '', url: '', author: ''})
    } else {
      setNotification({message: 'input title, author, url', type: 'error'})
      setTimeout(() => {
        setNotification({message: '', type: null})
      }, 3000)
    } 
  }

  return (
    <div>
      <form style={{marginBottom: 5}} onSubmit={handleNew}> 
        <h2>Create new</h2>
  
        <a>title:</a> <input value={newBlog.title} onChange={(e) => setNewBlog({...newBlog, title: e.target.value})} name='title' placeholder='title' />
        <br/><br/>

        <a>author:</a> <input value={newBlog.author} onChange={(e) => setNewBlog({...newBlog, author: e.target.value})} name='author' placeholder='author' />
        <br/><br/>

        <a>url:</a> <input value={newBlog.url} onChange={(e) => setNewBlog({...newBlog, url: e.target.value})} name='url' placeholder='url' />
        <br/><br/>

        <br/><br/>
        <button type='submit'>Create blog</button>
      </form>    
    </div>
  )
}

NewBlog.propTypes = {
  createNew: PropTypes.func.isRequired
}

export default NewBlog