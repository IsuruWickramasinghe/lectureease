import React from 'react'
import { auth } from '../../config/firebase-config'
import { signOut } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'

import './sign-out.style.css'

function SignOut() {
  const navigate = useNavigate()
  const signout = async () => {
    await signOut(auth)
    navigate('/lectureease')
  }
  return (
    <div className='sign-out'>
      <div onClick={signout}><i className="ri-logout-circle-r-line"></i></div>
    </div>
  )
}

export default SignOut