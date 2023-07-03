import React, { useEffect, useState } from 'react';
import './add-record.style.css';
import { auth, firestore } from '../../config/firebase-config';
import { collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from 'firebase/firestore';
import DisplayRecords from '../display-records/display-record.component';

function AddRecord() {
  const userId = auth.currentUser.uid;
  const [userSubjects, setUserSubjects] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [selectedSubject,setSelectedSubject] = useState("")
  const [addNewRecordMsg,setAddNewRecordMsg] = useState("")
  const [refreshDisplayRecords, setRefreshDisplayRecords] = useState(false); // New state variable


  // Get user data from Firestore using userId
  const displayUserData = async () => {
    const getUserData = await getDoc(doc(firestore, 'lecturers', userId));
    const userData = getUserData.data();
    await getDepsAndSubs(userData.RUserName);
  };

  // Get department and subject
  const getDepsAndSubs = async (lecturer) => {
    if (lecturer) {
      try {
        const collectionRef = collection(firestore, 'subjects');
        const queryRef = query(collectionRef, where('lecturer', '==', lecturer));
        const departmentSnapshot = await getDocs(queryRef);

        if (!departmentSnapshot.empty) {
          const subjectsSnapshot = [];
          const uniqueDepartments = new Set();

          departmentSnapshot.forEach((docX) => {
            subjectsSnapshot.push({
              id: docX.id,
              data: docX.data(),
            });
            uniqueDepartments.add(docX.data().subjectDepartment);
          });

          setUserSubjects(subjectsSnapshot);
          setFilteredSubjects(subjectsSnapshot);
          setSelectedDepartment('');
        } else {
          console.log('Department does not exist.');
        }
      } catch (error) {
        console.error('Error retrieving department subjects:', error);
      }
    } else {
      console.error('Invalid selectDepSubs value.');
    }
  };

  // Handle department change
  const handleDepartmentChange = (event) => {
    const selectedDepartment = event.target.value;

    if (selectedDepartment === '') {
      setFilteredSubjects(userSubjects);
    } else {
      const filteredSubjects = userSubjects.filter((docX) => {
        return docX.data.subjectDepartment === selectedDepartment;
      });
      setFilteredSubjects(filteredSubjects);
    }
    setSelectedDepartment(selectedDepartment);
  };

  // form submit
  const handleSubmit = async (event) => {
    event.preventDefault();
    const addNewRecordForm = document.querySelector("#addNewRecordForm");
    const addNewRecordFormFields = addNewRecordForm.querySelectorAll("input");
  
    const newRecordFile = {
      department: selectedDepartment,
      subject: selectedSubject,
      hodApr: false
    };
  
    addNewRecordFormFields.forEach((input) => {
      newRecordFile[input.name] = input.value;
    });
  
    // add new record
    try {
      const docRef = doc(
        collection(firestore, "lecturers", userId, newRecordFile.subject),
        (newRecordFile.recordDate+"_"+newRecordFile.startTime)
      );
      await setDoc(docRef, newRecordFile);
      setAddNewRecordMsg("New record added successfully!");
    } catch (error) {
      setAddNewRecordMsg("Error adding new record:", error);
    }

    // Toggle refresh flag to refresh DisplayRecords
    setRefreshDisplayRecords((prevRefresh) => !prevRefresh);

  };
  
  useEffect(() => {
    displayUserData();
  },[]);

  return (
    <div className='add-record'>
      <div className='add-new-record-panel'>
        {/* select dep and sub */}
        <div className='addRecord-selectDepAndSub'>
          {/* select department */}
          <div className='addRecord-select-department'>
            <label htmlFor='selectDepartment'>Select department :</label>
            <select
              name='selectDepartment'
              value={selectedDepartment}
              onChange={handleDepartmentChange}
            >
              <option value=''>All Departments</option>
              {Array.from(new Set(userSubjects.map((docX) => docX.data.subjectDepartment))).map(
                (department) => (
                  <option key={department} value={department}>
                    {department}
                  </option>
                )
              )}
            </select>
          </div>
          {/* select subject */}
          <div className='addRecord-select-subject'>
            <label htmlFor='selectSubject'>Select Subject :</label>
            <select name='selectSubject' defaultValue='' id='selectSubject' onChange={e => {setSelectedSubject(e.target.value)}}>
              <option value=''>
                Select subject
              </option>
              {filteredSubjects.map((docX) => (
                <option key={docX.id} value={docX.id}>
                  {docX.data.subjectName}
                </option>
              ))}
            </select>
          </div>
        </div>
        {/* add new record form */}
        <form action='' className='addNewRecordForm' onSubmit={handleSubmit} id='addNewRecordForm'>
          <div>Add new Record</div>
          <div className='addNewRecordField'>
            <label htmlFor='recordDate'>Date</label>
            <input type='date' name='recordDate' id='recordDate' />
          </div>
          <div className='addNewRecordField'>
            <label htmlFor='recordTopic'>Topic</label>
            <input type='text' name='recordTopic' id='recordTopic' />
          </div>
          <div className='addNewRecordField'>
            <label htmlFor='recordNoOfStudents'>No of Students</label>
            <input type='number' name='recordNoOfStudents' id='recordNoOfStudents' />
          </div>
          <div className='addNewRecordField'>
            <label htmlFor='startTime'>Start Time</label>
            <input type='time' name='startTime' id='startTime' />
          </div>
          <div className='addNewRecordField'>
            <label htmlFor='endTime'>End Time</label>
            <input type='time' name='endTime' id='endTime' />
          </div>
          <div className='addNewRecordField'>
            <label htmlFor='noOfHours'>No of Hours</label>
            <input type='number' name='noOfHours' id='noOfHours' />
          </div>
          <div className='newRecordAddedMsg'>
            <p>{addNewRecordMsg && addNewRecordMsg}</p>
          </div>
          <div className='addNewRecordField'>
            <button type='submit'>Submit</button>
          </div>
        </form>
      </div>

      <div className='display-lecture-record-sheet'>
        <DisplayRecords  subject={selectedSubject} uid={userId} refresh={refreshDisplayRecords} />
      </div>
    </div>
  );
}

export default AddRecord;
