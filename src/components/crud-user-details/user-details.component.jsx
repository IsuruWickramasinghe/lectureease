import React, { useEffect, useState } from 'react'
import { firestore } from '../../config/firebase-config' 
import { getDocs, collection, where, query } from 'firebase/firestore'
import { Link, Outlet } from 'react-router-dom'

import './user-details.tyle.css'

function UserDetails() {
  const [department,setDepartment] = useState("")
  const [lecturers, setLecturers] = useState([]);

  // select lecturers by departmet
  const getData = async () => {
    const querySnapshot = await getDocs(query(collection(firestore, "lecturers"), where("RDepartment", "==", department)));
    const lecturersData = [];
    querySnapshot.forEach((doc) => {
      lecturersData.push({
        id: doc.id,
        name: doc.data().RUserName,
      })
    });
    setLecturers(lecturersData);
  }

  useEffect(()=>{
    getData()
  },[department,lecturers])

  return (
    <div className='user-details'>
      <div className="select-departmet-wrapper">
        {/* select department */}
        <div>
          <select className="select-department" defaultValue="" onChange={(e)=>{setDepartment(e.target.value)}}>
            <option value="" disabled>Select Department</option>
            <option value="hndit">HND-IT</option>
            <option value="hnde">HND-E</option>
            <option value="hndba">HND-BA</option>
            <option value="hnda">HND-A</option>
            <option value="hndthm">HND-THM</option>
          </select>
        </div>
        {/* select lecturer to update */}
        <div className="display-lecturers">
          {
            lecturers.map(lecturer => (
              <div className="lectuer" key={lecturer.id}>
                <Link className='lecturer-link' to={lecturer.id} >{lecturer.name}</Link>
              </div>
            ))
          }
        </div>
      </div>
      {/* user update form */}
      <div className="lecturer-crud">
        <Outlet />
      </div>
    </div>
  )
}

export default UserDetails