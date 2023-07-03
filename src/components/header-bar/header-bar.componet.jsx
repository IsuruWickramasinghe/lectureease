import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

import SignOut from '../sign-out/sign-out.componet'
import Clock from '../clock/clock.component'
import SidebarToggle from '../sidebar-toggle/sidebar-toggle.component'

import './header-bar.style.css'

function Headerbar({sidebarToggle}) {

  const [pathName,setPathName] = useState("")

  const location = useLocation().pathname

  useEffect(()=>{
    setPathName(
      location==="/lectureease/dashboard" ? "Dashboard" :
      location==="/lectureease/dashboard/stats" ? "Stats" :
      location==="/lectureease/dashboard/addrecord" ? "Add New Record" :
      location==="/lectureease/dashboard/pendingrecords" ? "Pending Record" :
      location==="/lectureease/dashboard/timetable" ? "Time Table" :
      location==="/lectureease/dashboard/datavalidation" ? "Data Validation" :
      location==="/lectureease/dashboard/datavalidation/user-registration" ? "User Registration" :
      location==="/lectureease/dashboard/datavalidation/user-details" ? "User Details" :
      location==="/lectureease/dashboard/datavalidation/subjects-details" ? "Subjects Details" :
      location==="/lectureease/dashboard/datavalidation/students-count" ? "Students Count" :
      location==="/lectureease/dashboard/datavalidation/update-time-table" ? "Time Table" : ""
    )
  })

  return (
    <div className='header-bar'>
      {/* clock from clock componet */}
      <div className="clock">
        <Clock />
      </div>
      {/* sidebar toggle button */}
      <div className="sidebar-toggle">
        <SidebarToggle sidebarToggle={sidebarToggle} />
      </div>
      {/* navigations */}
      <div className="routing-path">
        {pathName}
      </div>
      {/* sign out button */}
      <div className="sign-out">
        <SignOut/>
      </div>
    </div>
  )
}

export default Headerbar