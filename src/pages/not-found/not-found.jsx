import React from 'react'
import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div>
      <h1>404</h1>
      <h2>not founded</h2>
      <p>go back to <Link to="/lectureease">Home</Link> </p>
    </div>
  )
}

export default NotFound