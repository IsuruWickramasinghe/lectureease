import React, { useEffect, useState } from 'react';
import { auth, firestore } from '../../config/firebase-config';
import './pending-records.style.css';
import { collection, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore';

function PendingRecords() {
  const userId = auth.currentUser.uid;
  const [departmentLecturers, setDepartmentLecturers] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [subjectRecords, setSubjectRecords] = useState([]);
  const [selectSubData, setSelectSubData] = useState([]);
  const [selectedLecturer, setSelectedLecturer] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [currentDep, setCurrentDep] = useState('');
  const [selectedLecUid, setSelectedLecUid] = useState('');

  // load lecturers
  const handleLoadingData = async () => {
    try {
      const department = (await getDoc(doc(firestore, 'lecturers', userId))).data().RDepartment;
      const queryRef = query(collection(firestore, 'lecturers'), where('RDepartment', '==', department));
      const subjectsSnapshot = await getDocs(queryRef);

      const depLecsSnapshot = [];
      subjectsSnapshot.forEach((docX) => {
        depLecsSnapshot.push({
          id: docX.id,
          data: docX.data()
        });
      });
      setCurrentDep(department);
      setDepartmentLecturers(depLecsSnapshot);
    } catch (error) {
      console.error(error.message);
    }
  };

  // select lecturer
  const handleSelectLec = async () => {
    try {
      const collectionRef = collection(firestore, 'subjects');
      const queryRef = query(collectionRef, where('lecturer', '==', selectedLecturer), where('subjectDepartment', '==', currentDep));
      const loadLecSubs = await getDocs(queryRef);
      const subSnapshot = [];
      loadLecSubs.forEach((docY) => {
        subSnapshot.push({
          id: docY.id,
          data: docY.data().subjectName
        });
      });
      setSelectedSubjects(subSnapshot);
    } catch (error) {
      console.error('Error fetching lecturer subjects:', error);
    }
  };

  // load records
  const handleSelectSub = async () => {
    try {
      const querySnapshot = await getDocs(query(collection(firestore, 'lecturers'), where('RUserName', '==', selectedLecturer)));
      const collectionPath = querySnapshot.docs[0].id; // Get the first document's ID as a string
      setSelectedLecUid(collectionPath);
      const collectionRef = collection(firestore, 'lecturers', collectionPath, selectedSubject);
      const subRecords = await getDocs(collectionRef);
      const subRecordsSnapshot = [];
  
      subRecords.forEach((docX) => {
        subRecordsSnapshot.push({
          id: docX.id,
          data: docX.data()
        });
      });
  
      setSubjectRecords(subRecordsSnapshot);
      handleSubHrs();
    } catch (error) {
      console.error('Error fetching subject records:', error);
    }
  };

  // update subject count
  const updateSubCountAdd = async (noHoure) => {
    try {
      const count = (await getDoc(doc(firestore, "subjects", selectedSubject))).data().completedLectureHours
      const docSRef = doc(firestore, "subjects", selectedSubject);
      await updateDoc(docSRef, {
        completedLectureHours: (+(count)+(+(noHoure))),
      });
      // console.log("Subject updated with new record successfully!");
    } catch (error) {
      console.error("Error updating subject with new record:", error);
    }
    handleSubHrs()
  }
  const updateSubCountSub = async (noHoure) => {
    try {
      const count = (await getDoc(doc(firestore, "subjects", selectedSubject))).data().completedLectureHours
      const docSRef = doc(firestore, "subjects", selectedSubject);
      await updateDoc(docSRef, {
        completedLectureHours: (+(count)-(+(noHoure))),
      });
      // console.log("Subject updated with new record successfully!");
    } catch (error) {
      console.error("Error updating subject with new record:", error);
    }
    handleSubHrs()
  }

  // approve records
  const handleApproveRecords = async (index) => {
    await updateDoc(doc(firestore, 'lecturers', selectedLecUid, selectedSubject, index), {
      hodApr: true
    });
    handleSelectSub();
  };

  // not approve records
  const handleNotApproveRecords = async (index) => {
    await updateDoc(doc(firestore, 'lecturers', selectedLecUid, selectedSubject, index), {
      hodApr: false
    });
    handleSelectSub();
  };

  // load subject hours
  const handleSubHrs = async () => {
    try {
      const docRef = doc(firestore, 'subjects', selectedSubject);
      const docSnapshot = await getDoc(docRef);

      if (docSnapshot.exists()) {
        const subData = docSnapshot.data();
        const subSnapshot = {
          id: docSnapshot.id,
          data: subData
        };
        setSelectSubData([subSnapshot]);
      } else {
        console.log('Subject document does not exist');
      }
    } catch (error) {
      console.error('Error fetching subject hours:', error);
    }
  };

  useEffect(() => {
    handleLoadingData();
    handleSelectLec();
    handleSelectSub();
  }, [selectedLecturer, selectedSubject]);

  return (
    <div className="pending-records">
      {/* select sub and lec */}
      <div className="pending-lect-and-sub-selection">
        {/* select Lecturer */}
        <div className="select-pending-lec">
          <label htmlFor="selectPendingLec">Select Lecturer</label>
          <select
            name="selectPendingLec"
            id="selectPendingLec"
            defaultValue={''}
            onChange={(e) => {
              setSelectedLecturer(e.target.value);
            }}
          >
            <option value='' disabled>All Lecturers</option>
            {departmentLecturers.map((docY) => (
              <option value={docY.data.RUserName} key={docY.id}>
                {docY.data.RUserName}
              </option>
            ))}
          </select>
        </div>

        {/* select subject */}
        <div className="select-pending-sub">
          <label htmlFor="selectPendingSub">Select Subject</label>
          <select
            name="selectPendingSub"
            defaultValue={''}
            id="selectPendingSub"
            onChange={(e) => {
              setSelectedSubject(e.target.value);
            }}
          >
            <option value="">Select Subject</option>
            {selectedSubjects.map((docY) => (
              <option value={docY.id} key={docY.id}>
                {docY.id}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* subject hours count */}
      <div className="records-data">
        {selectSubData.map((docZ) => (
          <div key={docZ.id}>
            <div className="subject-name">{docZ.data.subjectName}</div>
            <div className="total-lecture-hours">
              Total lecture hours : <p>{docZ.data.totalLectureHours}</p>
            </div>
            <div className="completed-lecture-hours">
              Completed lecture hours : <p>{docZ.data.completedLectureHours}</p>
            </div>
            <div className="pending-lecture-hours">
              Pending lecture hours : <p>{+docZ.data.totalLectureHours - +docZ.data.completedLectureHours}</p>
            </div>
          </div>
        ))}
      </div>

      {/* pending records table */}
      <div className="pending-records-table">
        <div className="display-records">
          <h1>{selectedSubject}</h1>
          <div className="pending-records-sheet">
            <table className="display-record-table">
              {/* headers */}
              <thead>
                <tr>
                  <td>Date</td>
                  <td>Topic</td>
                  <td>No of Student</td>
                  <td>Start time</td>
                  <td>End time</td>
                  <td>No of hours</td>
                </tr>
              </thead>
              {/* table data */}
              <tbody>
                {subjectRecords.map((docY) => (
                  <tr key={docY.id} className={docY.data.hodApr ? 'Approved' : 'notApproved'}>
                    <td>{docY.data.recordDate}</td>
                    <td>{docY.data.recordTopic}</td>
                    <td>{docY.data.recordNoOfStudents}</td>
                    <td>{docY.data.startTime}</td>
                    <td>{docY.data.endTime}</td>
                    <td>{docY.data.noOfHours}</td>
                    <td
                      onClick={() => {
                        if (!docY.data.hodApr) {
                          handleApproveRecords(docY.id);
                          updateSubCountAdd(docY.data.noOfHours);
                        }
                      }}
                      className={`apb ${docY.data.hodApr ? 'disabled' : ''}`}
                    >
                      <i className="ri-check-line approve-btn"></i>
                    </td>


                    <td 
                      onClick={() => {
                        if(docY.data.hodApr) {
                          handleNotApproveRecords(docY.id);
                          updateSubCountSub(docY.data.noOfHours);
                        }
                      }} className="napb"
                    >
                      <i className="ri-close-line not-approve-btn"></i>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PendingRecords;
