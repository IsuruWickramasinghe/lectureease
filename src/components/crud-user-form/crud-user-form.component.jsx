import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { firestore, auth } from '../../config/firebase-config';
import {
  doc,
  getDoc,
  getDocs,
  query,
  where,
  collection,
  updateDoc,
} from 'firebase/firestore';
import './crun-user-form.style.css';

function CrudUserForm() {
  const { uid } = useParams();
  const [selectedUser, setSelectedUser] = useState({});
  const [userSubjects, setUserSubjects] = useState([]);

  // Get user data from Firestore using uid
  const displayUserData = async () => {
    const getUserData = await getDoc(doc(firestore, 'lecturers', uid));
    const userData = getUserData.data();
    setSelectedUser(userData);
    await getSubjects(userData.RUserName);
  };

  // Get subjects
  const getSubjects = async (lecturer) => {
    if (lecturer) {
      try {
        const collectionRef = collection(firestore, 'subjects');
        const queryRef = query(collectionRef, where('lecturer', '==', lecturer));
        const departmentSnapshot = await getDocs(queryRef);

        if (!departmentSnapshot.empty) {
          const subjectsSnapshot = [];
          departmentSnapshot.forEach((doc) => {
            subjectsSnapshot.push({
              id: doc.id,
              data: doc.data(),
            });
          });
          setUserSubjects(subjectsSnapshot);
        } else {
          setUserSubjects([]);
          console.log('Department does not exist.');
        }
      } catch (error) {
        console.error('Error retrieving department subjects:', error);
      }
    } else {
      console.error('Invalid selectDepSubs value.');
    }
  };

  useEffect(() => {
    displayUserData();
    resetselectedUser();
  }, [uid]);

  const handleNameChange = (e) => {
    setSelectedUser((prevUser) => ({
      ...prevUser,
      RUserName: e.target.value,
    }));
  };

  const handleDepartmentChange = (e) => {
    setSelectedUser((prevUser) => ({
      ...prevUser,
      RDepartment: e.target.value,
    }));
  };

  const handleMobileNumberChange = (e) => {
    setSelectedUser((prevUser) => ({
      ...prevUser,
      RMobileNumber: e.target.value,
    }));
  };

  const handleAdminStateChange = (e) => {
    setSelectedUser((prevUser) => ({
      ...prevUser,
      RAdminState: e.target.checked,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Update the user details in Firestore
    const userRef = doc(firestore, 'lecturers', uid);
    await updateDoc(userRef, selectedUser);
  };

  const handleVisitOrPermChange = (e) => {
    setSelectedUser((prevUser) => ({
      ...prevUser,
      RVisitOrPerm: e.target.value,
    }));
  };

  // reset select user
  const resetselectedUser = () => {
    setSelectedUser({});
    setUserSubjects([]);
  };

  return (
    <div className='crud-user'>
      <div className='crud-user-details-form'>
        <form action='submit' id='crud-user-form' onSubmit={handleFormSubmit}>
          {/* admin state */}
          <div className='crud-user-form-data-field setAdmin'>
            <label htmlFor='RAdminState'>Set Admin</label>
            <input
              type='checkbox'
              name='RAdminState'
              id='RAdminState'
              checked={selectedUser.RAdminState || false}
              onChange={handleAdminStateChange}
            />
          </div>
          {/* name */}
          <div className='crud-user-form-data-field'>
            <label htmlFor='RUserName'>Name</label>
            <input
              type='text'
              name='RUserName'
              id='RUserName'
              value={selectedUser.RUserName || ''}
              onChange={handleNameChange}
            />
          </div>
          {/* department */}
          <div className='crud-user-form-data-field'>
            <label htmlFor='RDepartment'>Department</label>
            <select
              name='RDepartment'
              id='RDepartment'
              value={selectedUser.RDepartment || ''}
              onChange={handleDepartmentChange}
            >
              <option value='hndit'>HND-IT</option>
              <option value='hnde'>HND-E</option>
              <option value='hndba'>HND-BA</option>
              <option value='hnda'>HND-A</option>
              <option value='hndthm'>HND-THM</option>
            </select>
          </div>
          {/* visiting or permanent */}
          <div className='crud-user-form-data-field'>
            <label htmlFor='RVisitOrPerm'>State</label>
            <select
              name='RVisitOrPerm'
              id='RVisitOrPerm'
              value={selectedUser.RVisitOrPerm || ''}
              onChange={handleVisitOrPermChange}
            >
              <option value='permanent'>Permanent</option>
              <option value='visiting'>Visiting</option>
            </select>
          </div>
          {/* email */}
          <div className='crud-user-form-data-field'>
            <label htmlFor='REmail'>Email</label>
            <input
              type='email'
              name='REmail'
              id='REmail'
              value={selectedUser.REmail || ''}
              disabled
            />
          </div>
          {/* password */}
          <div className='crud-user-form-data-field'>
            <label htmlFor='RPassword'>Password</label>
            <input
              type='text'
              name='RPassword'
              id='RPassword'
              value={selectedUser.RPassword || ''}
              disabled
            />
          </div>
          {/* number */}
          <div className='crud-user-form-data-field'>
            <label htmlFor='RMobileNumber'>Number</label>
            <input
              type='number'
              name='RMobileNumber'
              id='RMobileNumber'
              value={selectedUser.RMobileNumber || ''}
              onChange={handleMobileNumberChange}
            />
          </div>
          {/* submit button */}
          <div className='crud-user-form-data-field'>
            <button type='submit' className='RBtn'>
              UPDATE DETAILS
            </button>
          </div>
        </form>
      </div>
      <div className='user-subject-list'>
        <div className='h1'>Subjects</div>
        <ol type='1'>
          {userSubjects.map((subject) => (
            <li key={subject.id}>
              {subject.id}
              <ol type='i'>
                <li>No. C L H: {subject.data.totalLectureHours}</li>
                <li>No. T L H: {subject.data.completedLectureHours}</li>
              </ol>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export default CrudUserForm;
