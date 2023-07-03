import React, { useEffect, useState } from 'react';
import { auth, firestore } from '../../config/firebase-config';
import { doc, getDoc } from 'firebase/firestore';
import Navbar from '../navbar/navbar.component';

import './sidebar.style.css'

function Sidebar({sidebarToggle}) {
  const [curretUserData, setCurrentUserData] = useState([]);

  // get current logged in user data and put in into the currentUser userState
  useEffect(() => {
    const getLoggedinUserDetails = async () => {
      const loggedinUserData = await getDoc(
        doc(firestore, 'lecturers', auth.currentUser.uid)
      )
      if (loggedinUserData.exists) {
        setCurrentUserData(loggedinUserData.data());
      }
    }
    getLoggedinUserDetails()
  }, [])

  return (
    <div className="sidebar">
      {/* dashboard logo */}
      <div className="logo">LECTURE EASE</div>
      {/* user profile with image */}
      <div className="user-profile">
        <img
          src={curretUserData.RProfilePicture}
          alt="profile"
        />
        {/* set current user name and user state */}
        <div className="loggedin-user-name-and-state">
          <p className="loggedin-user-name">{curretUserData.RUserName}</p>
          <span className='user-login-state'> / { (curretUserData.RAdminState==true)?"HOD":"Lecturer"}</span>
        </div>
      </div>
      {/* nav links */}
      <Navbar currentUserData={curretUserData} sidebarToggle={sidebarToggle}/>
      {/* footer */}
      <footer className='footer'>
        <span>isuruW - lecture ease v0.1</span>
      </footer>
    </div>
  );
}

export default Sidebar;
