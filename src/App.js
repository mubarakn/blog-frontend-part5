import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

import('./app.css')

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [blogs, setBlogs] = useState([])
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [info, setInfo] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const loggedUserJSON = localStorage.getItem('user')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
    }
  }, [])

  useEffect(() => {
    if (user) {
      blogService.setToken(user.token)
      blogService
        .getAll()
        .then(blogs => setBlogs( blogs ))
    }
  }, [user])

  const handleLogin = async e => {
    e.preventDefault()
    loginService
      .login({ username, password })
      .then(user => {
        localStorage.setItem('user', JSON.stringify(user))
        setUser(user)
      })
      .catch(error => {
        if (error.response.status === 401) {
          setError('Invalid username or password')
          setTimeout(() => {
            setError('')
          }, 5000);
        }
      })
  }

  const loginForm = () => {
    return (
      <div>
        <h2>log in to application</h2>
        <form onSubmit={handleLogin}>
          <div>
            <label>Username:</label> <input type="text" value={username} onChange={({target}) => setUsername(target.value)} />
          </div>
          <div>
            <label>Password:</label> <input type="password" value={password} onChange={({target}) => setPassword(target.value)} />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  const handleCreate = async e => {
    e.preventDefault()
    const blog = await blogService.add({ title, author, url })
    setInfo(`a new blog ${title} by ${author} added`)
    setTimeout(() => {
      setInfo('')
    }, 5000);
    setTitle('')
    setAuthor('')
    setUrl('')
    setBlogs([...blogs, blog])
  }

  const createBlog = () => {
    return (
      <div>
        <h2>create new</h2>
        <form onSubmit={handleCreate}>
          <div>
            <label>title:</label> <input type="text" value={title} onChange={({target}) => setTitle(target.value)} />            
          </div>
          <div>
            <label>author:</label> <input type="text" value={author} onChange={({target}) => setAuthor(target.value) } />
          </div>
          <div>
            <label>url:</label> <input type="text" value={url} onChange={({target}) => setUrl(target.value) } />
          </div>
          <button type="submit">create</button>
        </form>
      </div>
    )
  }

  const blogList = () => {
    return (
      <>
        <h2>blogs</h2>
        <div>{user.name} logged in <button onClick={() => {localStorage.clear(); setUser(null)}}>logout</button></div>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
      </>
    )
  }

  return (
    <div>
      {info && <div className="info">{info}</div>}
      {error && <div className="error">{error}</div>}
      {!user && loginForm()}
      {user && createBlog()}
      {user && blogList()}
    </div>
  )
}

export default App