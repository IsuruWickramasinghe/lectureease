import React, { useEffect, useState } from 'react';
import './subjects-details.style.css';
import { firestore } from '../../config/firebase-config';
import {
  doc,
  setDoc,
  getDocs,
  collection,
  query,
  where,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';

function SubjectDetails() {
  const [addSubMsg, setAddSubMsg] = useState("");
  const [updateSubMsg, setUpdateSubMsg] = useState("");
  const [selectDep, setSelectDep] = useState("");
  const [newSubject, setNewSubject] = useState("");
  const [selectDepSubs, setSelectDepSubs] = useState("hndit"); // Set a default value
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null); // New state variable for the selected subject

  useEffect(() => {
    getDepSub();
  }, [selectDepSubs]);

  // get all subjects
  const getDepSub = async () => {
    if (!selectDepSubs) {
      console.error('Invalid selectDepSubs value.');
      return;
    }

    try {
      const collectionRef = collection(firestore, "subjects");
      const queryRef = query(collectionRef, where("subjectDepartment", "==", selectDepSubs));
      const departmentSnapshot = await getDocs(queryRef);

      if (!departmentSnapshot.empty) {
        const subjectsSnapshot = [];
        departmentSnapshot.forEach((doc) => {
          subjectsSnapshot.push({
            id: doc.id,
            data: doc.data()
          });
        });
        setSubjects(subjectsSnapshot);
      } else {
        console.log('Department does not exist.');
      }
    } catch (error) {
      console.error('Error retrieving department subjects:', error);
    }
  };

  // add new subject
  const addNewSubject = async () => {
    if (selectDep && newSubject) {
      try {
        const subjectRef = doc(firestore, "subjects", `${newSubject}_${selectDep}`);
        await setDoc(subjectRef, {
          subjectName: newSubject,
          subjectDepartment: selectDep,
        });
        setNewSubject("");
        document.getElementById("subjectName").value = "";
        setAddSubMsg("New subject added successfully!");
      } catch (error) {
        setAddSubMsg("Error adding new subject:");
      }
    } else {
      setAddSubMsg("Invalid selectDep or newSubject value.");
    }
    getDepSub();
  };

  // update subject
  const updateSubjectData = async () => {
    if (selectedSubject) {
      try {
        const subRef = doc(firestore, "subjects", selectedSubject.id)
        await updateDoc(subRef, selectedSubject.data)
        setUpdateSubMsg("Updated successfully");
      } catch (error) {
        setUpdateSubMsg(error);
      }
    }
    resetFields();
    getDepSub();
  };

  // delete subject
  const deleteSubject = async () => {
    await deleteDoc(doc(firestore, 'subjects', selectedSubject.id))
    setUpdateSubMsg("subject deleted successfully!")
    getDepSub()
    resetFields()
  }

  // Function to reset input fields
  const resetFields = () => {
    setSelectedSubject(null);
    document.getElementById("subjectName").value = "";
    document.getElementById("subjecLecturer").value = "";
    document.getElementById("totalLecureHours").value = "";
    document.getElementById("completedLectureHours").value = "";
  };

  return (
    <div className='crud-subjects-details'>
      <div className='select-subject-wrapper'>
        {/* add new subject */}
        <div className="add-new-subect">
          <select className="select-department" defaultValue="" onChange={(e) => { setSelectDep(e.target.value) }}>
            <option value="" disabled>Select Department</option>
            <option value="hndit">HND-IT</option>
            <option value="hnde">HND-E</option>
            <option value="hndba">HND-BA</option>
            <option value="hnda">HND-A</option>
            <option value="hndthm">HND-THM</option>
          </select>
          <div className="add-subject">
            <label htmlFor="subjectName">New Subject</label>
            <input type="text" name='subjectName' id='subjectName' onChange={(e) => { setNewSubject(e.target.value) }} />
          </div>
          <div className="success-message">
            <span>{addSubMsg && addSubMsg}</span>
          </div>
          <button onClick={addNewSubject}>ADD</button>
        </div>

        {/* select department */}
        <div className="select_subject">
          <select className="select-department" defaultValue={selectDepSubs} onChange={(e) => { setSelectDepSubs(e.target.value) }}>
            <option value="" disabled>Select Department</option>
            <option value="hndit">HND-IT</option>
            <option value="hnde">HND-E</option>
            <option value="hndba">HND-BA</option>
            <option value="hnda">HND-A</option>
            <option value="hndthm">HND-THM</option>
          </select>
          {/* select subject */}
          <div className="show-all-subjects">
            {subjects.map(subject => (
              <div className="subjects" key={subject.id} onClick={() => { resetFields(); setSelectedSubject(subject); }}>
                <div className='subject-link'>{subject.data.subjectName}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* crud subject details */}
      <div className="crud-subject">
        <h3>Subject details</h3>
        <div className="crud-subject-details-field">
          <label htmlFor="subjectName">Subject Name</label>
          <input
            type="text"
            name='subjectName'
            id='subjectName'
            value={selectedSubject ? selectedSubject.data.subjectName : ""}
            onChange={(e) =>
              setSelectedSubject({
                ...selectedSubject,
                data: {
                  ...selectedSubject.data,
                  subjectName: e.target.value,
                },
              })
            }
          />
        </div>
        <div className="crud-subject-details-field">
          <label htmlFor="subjectDepartment">Department</label>
          <input
            type="text"
            name='subjectDepartment'
            id='subjectDepartment'
            value={selectedSubject ? selectedSubject.data.subjectDepartment : ""}
            onChange={(e) =>
              setSelectedSubject({
                ...selectedSubject,
                data: {
                  ...selectedSubject.data,
                  subjectDepartment: e.target.value,
                },
              })
            }
          />
        </div>
        <div className="crud-subject-details-field">
          <label htmlFor="subjecLecturer">Lecturer</label>
          <input
            type="text"
            name='subjecLecturer'
            id='subjecLecturer'
            value={selectedSubject ? selectedSubject.data.lecturer : ""}
            onChange={(e) =>
              setSelectedSubject({
                ...selectedSubject,
                data: {
                  ...selectedSubject.data,
                  lecturer: e.target.value,
                },
              })
            }
          />
        </div>
        <div className="crud-subject-details-field">
          <label htmlFor="subjectSemester">Semester</label>
          <input
            type="text"
            name='subjectSemester'
            id='subjectSemester'
            value={selectedSubject ? selectedSubject.data.semester : ""}
            onChange={(e) =>
              setSelectedSubject({
                ...selectedSubject,
                data: {
                  ...selectedSubject.data,
                  semester: e.target.value,
                },
              })
            }
          />
        </div>
        <div className="crud-subject-details-field">
          <label htmlFor="totalLecureHours">Total Lecture Hours</label>
          <input
            type="number"
            name='totalLecureHours'
            id='totalLecureHours'
            value={selectedSubject ? selectedSubject.data.totalLectureHours : ""}
            onChange={(e) =>
              setSelectedSubject({
                ...selectedSubject,
                data: {
                  ...selectedSubject.data,
                  totalLectureHours: e.target.value,
                },
              })
            }
          />
        </div>
        <div className="crud-subject-details-field">
          <label htmlFor="completedLectureHours">Completed Lecture Hours</label>
          <input
            type="number"
            name='completedLectureHours'
            id='completedLectureHours'
            value={selectedSubject ? selectedSubject.data.completedLectureHours : ""}
            onChange={(e) =>
              setSelectedSubject({
                ...selectedSubject,
                data: {
                  ...selectedSubject.data,
                  completedLectureHours: e.target.value,
                },
              })
            }
          />
        </div>
        <div className="success-message">
          <span>{updateSubMsg && updateSubMsg}</span>
        </div>
        <div className="crud-subjects-btns">
          <button className="btn-update" onClick={updateSubjectData}>
            UPDATE
          </button>
          <button className="btn-delete" onClick={deleteSubject}>DELETE</button>
        </div>
      </div>
    </div>
  );
}

export default SubjectDetails;
