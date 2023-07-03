import React, { useState, useEffect } from 'react';
import { auth, firestore } from '../../config/firebase-config';
import { doc, getDocs, collection, getDoc, query, where, updateDoc } from 'firebase/firestore';
import { BarChart, ResponsiveContainer, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { updateEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import './stats.style.css';
import DownloadPdfCard from '../download-pdf-card/download-pdf-card.component';

function Stats() {
  const [studentCountData, setStudentCountData] = useState([]);
  const [lectureHoursData, setLectureHoursData] = useState([]);
  const [currentUserEmail, setCurrentUserEmail] = useState('');
  const [currentUserPassword, setCurrentUserPassword] = useState('');
  const [resetMsg,setResetMsg] = useState("");

  useEffect(() => {
    studentsData();
    subjectBarChart();
    loadCurrentUser();
  }, []);

  const studentsData = async () => {
    const getStudentsData = await getDocs(collection(firestore, 'student_count_data'));
    const studentData = getStudentsData.docs.map((doc) => doc.data());
    setStudentCountData(studentData);
  };

  const subjectBarChart = async () => {
    const authUser = auth.currentUser.uid;
    try {
      const cU = (await getDoc(doc(firestore, 'lecturers', authUser))).data().RUserName;
      const queryRef = query(collection(firestore, 'subjects'), where('lecturer', '==', cU));
      const getSubData = await getDocs(queryRef);
      const subjectsData = [];
      getSubData.forEach((docX) => {
        const dataX = docX.data();
        subjectsData.push({
          name: dataX.subjectName + ' \n ' + dataX.subjectDepartment,
          Total_Hours: dataX.totalLectureHours,
          Completed_Hours: dataX.completedLectureHours,
        });
      });
      setLectureHoursData(subjectsData);
    } catch (error) {
      console.error(error);
    }
  };

  const promptUserForCredentials = () => {
    const password = prompt('Please enter your password:');
    return { password };
  };

  const resetEmailPassword = async () => {
    try {
      const user = auth.currentUser;
      const updatedFields = {};
      if (currentUserEmail !== user.email) {
        updatedFields.email = currentUserEmail;
      }
      if (currentUserPassword) {
        updatedFields.password = currentUserPassword;
      }

      // Update email and password in Google Auth
      if (Object.keys(updatedFields).length > 0) {
        // Prompt user to reauthenticate
        const credentials = promptUserForCredentials();
        const credential = EmailAuthProvider.credential(user.email, credentials.password);
        await reauthenticateWithCredential(user, credential);
        
        // Update email and password
        await updateEmail(user, currentUserEmail);
        await updatePassword(user, currentUserPassword);
        setResetMsg("Email and password updated successfully in Google Auth.")
      }

      // Update email in Firestore database
      if (currentUserEmail !== user.email) {
        const userId = user.uid;
        const userDocRef = doc(firestore, 'lecturers', userId);
        await updateDoc(userDocRef, { REmail: currentUserEmail });
        console.log('Email updated successfully in Firestore database.');
      }

       // Update email and password in Firestore database
      if (currentUserEmail !== user.email || currentUserPassword !== "" ) {
        const userId = user.uid;
        const userDocRef = doc(firestore, 'lecturers', userId);
        await updateDoc(userDocRef, {
          REmail: currentUserEmail,
          RPassword: currentUserPassword,
        });
        setResetMsg("Email and password updated successfully in Firestore database.")
      }
      else{
        setResetMsg("Password empty.")
      }

    } catch (error) {
      setResetMsg(error.message)
    }
  };

  const loadCurrentUser = () => {
    const user = auth.currentUser;
    if (user) {
      setCurrentUserEmail(user.email);
      setCurrentUserPassword('');
    }
  };

  const student_count_data_colors = ['#068DA9', '#DB005B', '#068DA9', '#DB005B'];

  return (
    <div className='stats'>
      {/* down load pdf*/}
      <div className="download-pdf-card">
        <DownloadPdfCard />
      </div>
      {/* lecture hours chart */}
      <div className='lecture-hours-chart'>
        <div className='chart-header'>Lecture Hours</div>
        <ResponsiveContainer width='100%' height={300}>
          <BarChart data={lectureHoursData}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='name' tick={{ fontSize: 8, wordBreak: 'break-all' }} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey='Completed_Hours' fill='#8884d8' background={{ fill: '#eee' }} />
            <Bar dataKey='Total_Hours' fill='#82ca9d' />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* students details chart */}
      <div className='students-details-chart'>
        <div className='chart-header'>Students Count</div>
        <ResponsiveContainer width='100%' height={300}>
          <BarChart data={studentCountData}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='name' />
            <YAxis />
            <Bar dataKey='student_count' fill='#8884d8' label={{ position: 'top' }}>
              {studentCountData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={student_count_data_colors[index % 20]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* reset email and password */}
      <div className='resetEmailPass'>
        <h3>Login Details</h3>
        <div className='userDetailsInputFields'>
          <label htmlFor='currentUserEmail'>User Email</label>
          <input
            type='text'
            name='currentUserEmail'
            id='currentUserEmail'
            value={currentUserEmail}
            onChange={(e) => setCurrentUserEmail(e.target.value)}
          />
        </div>
        <div className='userDetailsInputFields'>
          <label htmlFor='currentUserPassword'>User Password</label>
          <input
            type='password'
            name='currentUserPassword'
            id='currentUserPassword'
            value={currentUserPassword}
            placeholder='new password'
            onChange={(e) => setCurrentUserPassword(e.target.value)}
          />
        </div>
        <p className="reset-msg">
          {resetMsg && resetMsg}
        </p>
        <button onClick={resetEmailPassword}>Reset</button>
      </div>
    </div>
  );
}

export default Stats;
