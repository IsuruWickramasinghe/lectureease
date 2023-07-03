import React, { useState } from 'react'
import { auth } from '../../config/firebase-config'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'

import './login-form.style.css'

function LoginForm() {
  const navigate = useNavigate()

  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginMsg, setLoginMsg] = useState('')

  const loginUsingFirebaseAuth = async (e) => {
    e.preventDefault()
    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword)
      setLoginMsg('logged in successfully')
      navigate('/lectureease/dashboard/stats')
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        setLoginMsg('User not found. Please check your email or register.')
      } else if (error.code === 'auth/wrong-password') {
        setLoginMsg('Invalid password. Please try again.')
      } else {
        setLoginMsg('An error occurred. Please try again later.')
      }
    }
  }

  return (
    <div className="loginPage-loginForm">
      <form onSubmit={loginUsingFirebaseAuth}>
        <div className="loginForm-inputField">
          <label htmlFor="email">Email</label>
          <input type="email" name="email" id="email" autoComplete="email" onChange={(e) => setLoginEmail(e.target.value)} />
        </div>
        <div className="loginForm-inputField">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            autoComplete="current-password"
            onChange={(e) => setLoginPassword(e.target.value)}
          />
        </div>
        <div className="loginForm-btn">
          <button type="submit">SIGN IN</button>
        </div>
        <div className="loginMsg">
          <span>{loginMsg}</span>
        </div>
      </form>
    </div>
  )
}

export default LoginForm
