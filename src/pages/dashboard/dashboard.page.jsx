import React, { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { auth } from '../../config/firebase-config'

import Sidebar from '../../components/sidebar/sidebar.component'
import Headerbar from '../../components/header-bar/header-bar.componet'
import background from '../../assets/background.svg'

import './dashboard.style.css'

function Dashboard() {

  // check user logged in or not if user not logged it automatically redirect him into the login page 
  useEffect(() => {
    const userStateCheck = async () => {
      const user = await auth.currentUser
      if (!user) {
        navigate('lectureease/')
      }
    }
    userStateCheck()
  }, [])

  // sidebar toggle
  const [isToggleClicked,setisToggleClicked] = useState(false)
  const sidebarToggle = () => {
    (!isToggleClicked)? setisToggleClicked(true) : setisToggleClicked(false)
  }

  return (
    <div className='dashboard'>
      {/* side bar and nav bar componet */}
      <div className={(isToggleClicked) ? "dashboard-sidebar sidebar-open" : "dashboard-sidebar"}>
        <Sidebar sidebarToggle={sidebarToggle} />
      </div>
      {/* nav bar btns components in the outlet*/}
      <div className="dashboard-content">
        <Headerbar sidebarToggle={sidebarToggle} />
        <img className='background-img' src={background} alt="background" />
        <Outlet />
      </div>
    </div>
  )
}

export default Dashboard
