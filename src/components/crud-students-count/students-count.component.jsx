import React, { useEffect, useState } from 'react';
import './students-count.style.css';
import { firestore } from '../../config/firebase-config';
import { collection, doc, getDocs, updateDoc } from 'firebase/firestore';

function StudentsCount() {
  const [studentCountData, setStudentCountData] = useState([]);

  // Get student count details
  const studentCount = async () => {
    const dataSnapshot = [];
    const studentRef = collection(firestore, 'student_count_data');
    const getData = await getDocs(studentRef);
    getData.forEach((docs) => {
      dataSnapshot.push({
        id: docs.id,
        data: docs.data(),
      });
    });
    setStudentCountData(dataSnapshot);
  };

  useEffect(() => {
    studentCount();
  }, []);

  const handleInputChange = (index, value) => {
    const updatedData = [...studentCountData];
    updatedData[index].data.student_count = value;
    setStudentCountData(updatedData);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const promises = studentCountData.map((docs) => {
        const studentCountRef = doc(firestore, 'student_count_data', docs.id);
        return updateDoc(studentCountRef, docs.data);
      });
      await Promise.all(promises);
      console.log('Documents updated successfully');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form className="student-count" onSubmit={handleUpdate}>
      <div className="students-count-wrapper">
        <div className="year-one">
          <h2>Year One</h2>
          <div className="student-count-text-field">
            <label htmlFor="yearOneBoys" className="boys">
              Year One Boys
            </label>
            <input
              type="text"
              name="yearOneBoys"
              id={studentCountData[0]?.id}
              value={studentCountData[0]?.data?.student_count || ''}
              onChange={(e) => handleInputChange(0, e.target.value)}
            />
          </div>
          <div className="student-count-text-field">
            <label htmlFor="yearOneGirls" className="girls">
              Year One Girls
            </label>
            <input
              type="text"
              name="yearOneGirls"
              id={studentCountData[1]?.id}
              value={studentCountData[1]?.data?.student_count || ''}
              onChange={(e) => handleInputChange(1, e.target.value)}
            />
          </div>
        </div>

        <div className="year-two">
          <h2>Year Two</h2>
          <div className="student-count-text-field">
            <label htmlFor="yearTwoBoys" className="boys">
              Year Two Boys
            </label>
            <input
              type="text"
              name="yearTwoBoys"
              id={studentCountData[2]?.id}
              value={studentCountData[2]?.data?.student_count || ''}
              onChange={(e) => handleInputChange(2, e.target.value)}
            />
          </div>
          <div className="student-count-text-field">
            <label htmlFor="yearTwoGirls" className="girls">
              Year Two Girls
            </label>
            <input
              type="text"
              name="yearTwoGirls"
              id={studentCountData[3]?.id}
              value={studentCountData[3]?.data?.student_count || ''}
              onChange={(e) => handleInputChange(3, e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="student-count-update-btn">
        <button type="submit">Update</button>
      </div>
    </form>
  );
}

export default StudentsCount;
