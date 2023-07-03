import React from 'react'

import LoginForm from '../../components/login-form/login-form.componet'
import './login.style.css'
import  logo  from '../../assets/logo.svg'

function LoginPage() {
  return (
    <div className="LoginPage">
      <div className="loginPage-art">
        <img src={logo} alt="Logo" />
        <h1>Lecture Ease</h1>
      </div>
      <LoginForm />
    </div>
  )
}

export default LoginPage
