import React, { useState, useEffect, useRef } from 'react';
import { auth, firestore } from '../../config/firebase-config';
import { doc, collection, getDoc, getDocs, query, where } from 'firebase/firestore';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './download-pdf-card.style.css'

function DownloadPddfCard() {
  const userId = auth.currentUser.uid;
  const [currentUserSubjects, setCurrentUserSubjects] = useState([]);
  const [selectedSubjectRecords, setSelectedSubjectRecords] = useState([]);
  const [currentUser, setCurrentUser] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const downloadFileRef = useRef(null);

  useEffect(() => {
    handleCurrentUser();
  }, [selectedSubject]);

  const handleCurrentUser = async () => {
    try {
      const userRef = doc(firestore, 'lecturers', userId);
      const docSnap = await getDoc(userRef);
  
      if (docSnap.exists()) {
        const userSnap = {
          id: docSnap.id,
          data: docSnap.data()
        };
        setCurrentUser(userSnap);
        const userName = docSnap.data().RUserName;
        handleCurrentUserSubjects(userName);
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  };
  

  const handleCurrentUserSubjects = async (userName) => {
    try {
      const subjectsSnapshot = await getDocs(
        query(collection(firestore, 'subjects'), where('lecturer', '==', userName))
      );

      const subArr = subjectsSnapshot.docs.map((docX) => ({
        id: docX.id,
        name: docX.data().subjectName
      }));
      setCurrentUserSubjects(subArr);
      hadndleSelectedSubjectRecords();
    } catch (error) {
      console.error('Error fetching current user subjects:', error);
    }
  };

  const hadndleSelectedSubjectRecords = async () => {
    if (selectedSubject) {
      try {
        const subRecRef = collection(firestore, 'lecturers', userId, selectedSubject);
        const recordSnapshot = await getDocs(subRecRef);
        const recordsArr = [];
        recordSnapshot.forEach((docY) => {
          recordsArr.push({
            id: docY.id,
            data: docY.data()
          });
        });
        setSelectedSubjectRecords(recordsArr);
      } catch (error) {
        console.error('Error fetching selected subject records:', error);
      }
    }
  };

  const handleDownloadPDF = () => {
    if (downloadFileRef.current) {
      const input = downloadFileRef.current;
  
      html2canvas(input, { scale: 4 }).then((canvas) => {
        const pdf = new jsPDF({
          format: 'a4',
          orientation: 'portrait',
        });
  
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
  
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
  
        const scale = Math.min(pageWidth / canvasWidth, pageHeight / canvasHeight);
        const scaledWidth = canvasWidth * scale;
        const scaledHeight = canvasHeight * scale;
  
        const x = (pageWidth - scaledWidth) / 2;
        const y = 0;
  
        pdf.addImage(canvas.toDataURL('image/jpeg', 1.0), 'JPEG', x, y, scaledWidth, scaledHeight);
        pdf.save(`Subject_${selectedSubject}_Records.pdf`);
      });
    } else {
      console.log('Please select a subject to download the PDF file.');
    }
  };
  

  return (
    <div className='download-file-card'>
      {/* select subject */}
      <div className="select-sub-and-down">
        <div className="your-records">
          Your Subject Records
        </div>
        <div className='select-and-down'>
          <select
            name="selectSubject"
            defaultValue={''}
            id="selectSubject"
            onChange={(e) => setSelectedSubject(e.target.value)}
          >
            <option value="">Select Your Subject</option>
            {currentUserSubjects.map((subject) => (
              <option value={subject.id} key={subject.id}>
                {subject.id}
              </option>
            ))}
          </select>
          <button onClick={handleDownloadPDF}>
            Download <b>{selectedSubject && `${selectedSubject}`}</b> PDF file
          </button>
        </div>
      </div>

      {/* downloadable file */}
      <div className="downloadable-file" ref={downloadFileRef}>
        {/* user data */}
        <div className="selected-data">
          <div className='sub-lecturer'>
            Lecturer : <p>{currentUser && currentUser.data.RUserName}</p> 
          </div>
          <div className="sub-name">
            Subject : <p>{selectedSubject && `${selectedSubject}`}</p> 
          </div>
          <div className="sub-year">
            Year : <p></p>
          </div>
          <div className="sub-semester">
            Semester : <p></p>
          </div>
          <div className="lec-contact">
            Contact No : <p>{currentUser && currentUser.data.RMobileNumber}</p> 
          </div>
        </div>

        <table className="display-record-table" >
          {/* headers */}
          <thead>
            <tr>
              <td>Date</td>
              <td>Topic</td>
              <td>No of Student</td>
              <td>Start time</td>
              <td>End time</td>
              <td>No of hours</td>
              <td>Lecturer sign</td>
              <td>HOD sign</td>
            </tr>
          </thead>
          {/* table data */}
          <tbody>
            {selectedSubjectRecords.map((docY) => (
              <tr key={docY.id} className={docY.data.hodApr ? 'ApprovedX' : 'notApprovedX'}>
                <td>{docY.data.recordDate}</td>
                <td>{docY.data.recordTopic}</td>
                <td>{docY.data.recordNoOfStudents}</td>
                <td>{docY.data.startTime}</td>
                <td>{docY.data.endTime}</td>
                <td>{docY.data.noOfHours}</td>
                <td></td>
                <td></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default DownloadPddfCard;
