import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom'
import { auth } from './config/firebase-config'

import LoginPage from './pages/login-page/login.page'
import NotFound from './pages/not-found/not-found'
import Dashboard from './pages/dashboard/dashboard.page'
import Stats from './components/stats/stats.component'
import AddRecord from './components/add-record/add-record.component'
import PendingRecords from './components/pending-records/pending-records.component'
import TimeTable from './components/time-table/time-table.component'
import DataValidation from './components/data-validation/data-validation.component'
import UserRegistration from './components/user-registration/user-registration.component'

import './App.css'
import UserDetails from './components/crud-user-details/user-details.component'
import SubjectDetails from './components/crud-subject-details/subjects-details.component'
import StudentsCount from './components/crud-students-count/students-count.component'
import UpdateTimeTable from './components/crud-time-table/update-time-table.component'
import CrudUserForm from './components/crud-user-form/crud-user-form.component'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setIsLoggedIn(!!user)
    })
  }, [])

  return (
    <Router>
      <Routes>
        <Route path="/lectureease" element={isLoggedIn ? <Navigate to="/lectureease/dashboard/stats" /> : <LoginPage />} exact />
        <Route path="/lectureease/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/lectureease" />}>
          <Route path='stats' element={<Stats/>} />
          <Route path='addrecord' element={<AddRecord/>} />
          <Route path='pendingrecords' element={<PendingRecords/>} />
          <Route path='timetable' element={<TimeTable/>} />
          <Route path='datavalidation' element={<DataValidation/>} >
            <Route path='user-registration' element={<UserRegistration/>} />
            <Route path='user-details' element={<UserDetails/>} >
              <Route path={":uid"} element={<CrudUserForm/>} />
            </Route>
            <Route path='subjects-details' element={<SubjectDetails/>} />
            <Route path='students-count' element={<StudentsCount/>} />
            <Route path='update-time-table' element={<UpdateTimeTable/>} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default App
