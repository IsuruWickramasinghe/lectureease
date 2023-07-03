import React from 'react'

import './data-validation.style.css'
import { NavLink, Outlet } from 'react-router-dom'

function DataValidation() {
  return (
    <div className='data-validation'>
      <div className="data-validation-nav-links">
        <NavLink to='user-registration' className="data-validation-nav-link">User Registration</NavLink>
        <NavLink to='user-details' className="data-validation-nav-link">User Details</NavLink>
        <NavLink to='subjects-details' className="data-validation-nav-link">Subjects Details</NavLink>
        <NavLink to='students-count' className="data-validation-nav-link">Students Count</NavLink>
        <NavLink to='update-time-table' className="data-validation-nav-link">Time Table</NavLink>
      </div>
      <div className="data-validation-tabs">
        <Outlet />
      </div>
    </div>
  )
}

export default DataValidation