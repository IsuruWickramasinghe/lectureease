import React from 'react'

import './sidebar-toggle.style.css'

function SidebarToggle({sidebarToggle}) {
  return (
    <div className='sidebar-toggle' onClick={sidebarToggle}>
      <div><i className="ri-menu-line"></i></div>
    </div>
  )
}

export default SidebarToggle