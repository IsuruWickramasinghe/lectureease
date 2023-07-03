import React from 'react';
import { NavLink } from 'react-router-dom';

import './navbar.style.css';

function Navbar({ currentUserData , sidebarToggle }) {
  return (
    <nav className="nav-links">
      {currentUserData.RAdminState ? (
        <>
          <NavLink onClick={sidebarToggle} className="nav-link stats-link" to="stats">
            <i className="ri-line-chart-line"></i>
            Stats
          </NavLink>
          <NavLink onClick={sidebarToggle} className="nav-link add-record-link" to="addrecord">
            <i className="ri-add-circle-line"></i>
            Add Record
          </NavLink>
          <NavLink onClick={sidebarToggle} className="nav-link pending-records-link" to="pendingrecords">
            <i className="ri-list-check-3"></i>
            Pending Records
          </NavLink>
          <NavLink onClick={sidebarToggle} className="nav-link time-table-link" to="timetable">
            <i className="ri-time-line"></i>
            Time Table
          </NavLink>
          <NavLink onClick={sidebarToggle} className="nav-link data-validation-link" to="datavalidation">
            <i className="ri-refresh-line"></i>
            Data Validation
          </NavLink>
        </>
      ) : (
        <>
          <NavLink onClick={sidebarToggle} className="nav-link stats-link" to="stats">
            <i className="ri-line-chart-line"></i>
            Stats
          </NavLink>
          <NavLink onClick={sidebarToggle} className="nav-link add-record-link" to="addrecord">
            <i className="ri-add-circle-line"></i>
            Add Record
          </NavLink>
          <NavLink onClick={sidebarToggle} className="nav-link time-table-link" to="timetable">
            <i className="ri-time-line"></i>
            Time Table
          </NavLink>
        </>
      )}
    </nav>
  );
}

export default Navbar;
