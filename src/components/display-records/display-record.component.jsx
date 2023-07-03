import { collection, doc, getDocs } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { firestore } from '../../config/firebase-config'
import './display-record.style.css'

function DisplayRecords(props) {
  const [subjectRecordSheet, setSubjectRecordSheet] = useState([]);

  const getSubjectRecord = async () => {
    const collectionRef = collection(firestore, "lecturers", props.uid, props.subject);
    const subRecords = await getDocs(collectionRef);
    const subRecordsSnapshot = [];
    
    subRecords.forEach((docX) => {
      subRecordsSnapshot.push(docX.data());
    });
    setSubjectRecordSheet(subRecordsSnapshot);
  };

  useEffect(()=>{
    getSubjectRecord()
  },[props.subject,props.refresh])
  


  return (
    <div className="display-records">
      <h1>{props.subject}</h1>
      <div className="display-records-sheet">
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
            {subjectRecordSheet.map((docY, index) => (
              <tr key={index} className={(docY.hodApr==false)? "notApproved": "Approved"}>
                <td>{docY.recordDate}</td>
                <td>{docY.recordTopic}</td>
                <td>{docY.recordNoOfStudents}</td>
                <td>{docY.startTime}</td>
                <td>{docY.endTime}</td>
                <td>{docY.noOfHours}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DisplayRecords
