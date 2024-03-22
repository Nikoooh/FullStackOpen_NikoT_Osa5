import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import NewBlog from './NewBlog'

const blog = {
  title: 'Testing if title is defined',
  author: 'mikael',
  url: 'https://testingjest.com',
  likes: 5,
  user: {
    name: 'Tester Tester',
    username: 'roger'
  }
}

const propUser = {
  name: 'Tester Tester',
  username: 'roger'
}

test('renders title', () => {
  render(<Blog blog={blog} />)
  const element = screen.getByText('Testing if title is defined')
  expect(element).toBeDefined()
})

test('url', async () => {
  
  render(
    <Blog blog={blog} user={propUser}/>
  )
  await userEvent.click(screen.getByText('view'));  
  expect(screen.getByText('https://testingjest.com')).toBeDefined()
  
})

test('likes', async () => {
  
  render(
    <Blog blog={blog} user={propUser}/>
  )
  await userEvent.click(screen.getByText('view')); 
  expect(screen.getByText('likes: 5')).toBeDefined()
  
})

test('user', async () => {
  
  render(
    <Blog blog={blog} user={propUser}/>
  )
  await userEvent.click(screen.getByText('view'));  
  expect(screen.getByText('mikael')).toBeDefined()
})
 
test('when liked blog liked twice, function is called twice', async () => {

  const mockHandler = vi.fn()

  render(
    <Blog blog={blog} user={propUser} handleLike={mockHandler}/>
  )

  const user = userEvent.setup()
  
  await user.click(screen.getByText('view'));  
  await user.click(screen.getByText('like'));  
  await user.click(screen.getByText('like')); 

  expect(mockHandler.mock.calls).toHaveLength(2)

})

test('when new blog created, function has the correct information', async () => {

  const user = userEvent.setup()
  const createNew = vi.fn()
  const setNotification = vi.fn()

  render(
    <NewBlog setNotification={setNotification} createNew={createNew}/>
  )

  const url = screen.getByPlaceholderText('url')
  await user.type(url, 'url test')

  const title = screen.getByPlaceholderText('title')
  await user.type(title, 'testing title')

  const author = screen.getByPlaceholderText('author')
  await user.type(author, 'author test')
  
  const createNewBtn = screen.getByText('Create blog')
  await user.click(createNewBtn)

  expect(createNew.mock.calls[0][0]).toStrictEqual({title: 'testing title', url: 'url test', author: 'author test'})
  
})