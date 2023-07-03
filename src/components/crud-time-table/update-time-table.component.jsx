import React, { useEffect, useState } from 'react';
import './update-time-table.style.css';
import { firestore } from '../../config/firebase-config';
import { collection, doc, setDoc, getDoc } from 'firebase/firestore';

function UpdateTimeTable() {
  const [selectYear, setSelectYear] = useState('yearOne');
  const [timetableData, setTimetableData] = useState([]);

  const handleSelectYearChange = (e) => {
    setSelectYear(e.target.value);
  };

  const handleInputChange = (index, day, value) => {
    const updatedData = [...timetableData];
    if (!updatedData[index]) {
      updatedData[index] = {};
    }
    updatedData[index][day] = value.trim() || null; // Assign null if value is empty after trimming
    setTimetableData(updatedData);
  };  

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const timetableRef = doc(firestore, 'timeTable', selectYear);
      await setDoc(timetableRef, { data: timetableData });
      console.log('Timetable updated successfully');
      document.getElementById("form").reset()
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        const timetableRef = doc(firestore, 'timeTable', selectYear);
        const timetableSnapshot = await getDoc(timetableRef);
        if (timetableSnapshot.exists()) {
          const timetableData = timetableSnapshot.data().data;
          setTimetableData(timetableData);
        } else {
          setTimetableData([]);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchTimetable();
  }, [selectYear]);

  return (
    <div>
      <div className="select-year">
        <label htmlFor="selectYear">Select Year:</label>
        <select
          name="selectYear"
          id="selectYear"
          value={selectYear}
          onChange={handleSelectYearChange}
        >
          <option value="yearOne">Year One</option>
          <option value="yearTwo">Year Two</option>
        </select>
      </div>
      <form className="timetable" onSubmit={handleUpdate} id='form'>
        <table className="table">
          {/* table header */}
          <thead className="thead">
            <tr className="table-header">
              <td></td>
              <td>Monday</td>
              <td>Tuesday</td>
              <td>Wednesday</td>
              <td>Thursday</td>
              <td>Friday</td>
            </tr>
          </thead>
          {/* table body */}
          <tbody className="table-body">
            {/* row 1 */}
            <tr className="time-period">
              <td>
                <input type="text" defaultValue="8.30 - 9.30" />
              </td>
              <td>
                <input
                  type="text"
                  defaultValue={timetableData[0]?.Monday || ''}
                  onChange={(e) => handleInputChange(0, 'Monday', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  defaultValue={timetableData[0]?.Tuesday || ''}
                  onChange={(e) => handleInputChange(0, 'Tuesday', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  defaultValue={timetableData[0]?.Wednesday || ''}
                  onChange={(e) => handleInputChange(0, 'Wednesday', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  defaultValue={timetableData[0]?.Thursday || ''}
                  onChange={(e) => handleInputChange(0, 'Thursday', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  defaultValue={timetableData[0]?.Friday || ''}
                  onChange={(e) => handleInputChange(0, 'Friday', e.target.value)}
                />
              </td>
            </tr>
            {/* row 2 */}
            <tr className="time-period">
              <td>
                <input type="text" defaultValue="9.30 - 10.30" />
              </td>
              <td>
                <input
                  type="text"
                  defaultValue={timetableData[1]?.Monday || ''}
                  onChange={(e) => handleInputChange(1, 'Monday', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  defaultValue={timetableData[1]?.Tuesday || ''}
                  onChange={(e) => handleInputChange(1, 'Tuesday', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  defaultValue={timetableData[1]?.Wednesday || ''}
                  onChange={(e) => handleInputChange(1, 'Wednesday', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  defaultValue={timetableData[1]?.Thursday || ''}
                  onChange={(e) => handleInputChange(1, 'Thursday', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  defaultValue={timetableData[1]?.Friday || ''}
                  onChange={(e) => handleInputChange(1, 'Friday', e.target.value)}
                />
              </td>
            </tr>
            {/* row 3 */}
            <tr className="time-period">
              <td>
                <input type="text" defaultValue="10.30 - 11.30" />
              </td>
              <td>
                <input
                  type="text"
                  defaultValue={timetableData[2]?.Monday || ''}
                  onChange={(e) => handleInputChange(2, 'Monday', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  defaultValue={timetableData[2]?.Tuesday || ''}
                  onChange={(e) => handleInputChange(2, 'Tuesday', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  defaultValue={timetableData[2]?.Wednesday || ''}
                  onChange={(e) => handleInputChange(2, 'Wednesday', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  defaultValue={timetableData[2]?.Thursday || ''}
                  onChange={(e) => handleInputChange(2, 'Thursday', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  defaultValue={timetableData[2]?.Friday || ''}
                  onChange={(e) => handleInputChange(2, 'Friday', e.target.value)}
                />
              </td>
            </tr>
            {/* row 4 */}
            <tr className="time-period">
              <td>
                <input type="text" defaultValue="11.30 - 12.30" />
              </td>
              <td>
                <input
                  type="text"
                  defaultValue={timetableData[3]?.Monday || ''}
                  onChange={(e) => handleInputChange(3, 'Monday', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  defaultValue={timetableData[3]?.Tuesday || ''}
                  onChange={(e) => handleInputChange(3, 'Tuesday', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  defaultValue={timetableData[3]?.Wednesday || ''}
                  onChange={(e) => handleInputChange(3, 'Wednesday', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  defaultValue={timetableData[3]?.Thursday || ''}
                  onChange={(e) => handleInputChange(3, 'Thursday', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  defaultValue={timetableData[3]?.Friday || ''}
                  onChange={(e) => handleInputChange(3, 'Friday', e.target.value)}
                />
              </td>
            </tr>
            {/* row 5 */}
            <tr className="time-period">
              <td>
                <input type="text" defaultValue="1.00 - 2.00" />
              </td>
              <td>
                <input
                  type="text"
                  defaultValue={timetableData[4]?.Monday || ''}
                  onChange={(e) => handleInputChange(4, 'Monday', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  defaultValue={timetableData[4]?.Tuesday || ''}
                  onChange={(e) => handleInputChange(4, 'Tuesday', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  defaultValue={timetableData[4]?.Wednesday || ''}
                  onChange={(e) => handleInputChange(4, 'Wednesday', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  defaultValue={timetableData[4]?.Thursday || ''}
                  onChange={(e) => handleInputChange(4, 'Thursday', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  defaultValue={timetableData[4]?.Friday || ''}
                  onChange={(e) => handleInputChange(4, 'Friday', e.target.value)}
                />
              </td>
            </tr>
            {/* row 6 */}
            <tr className="time-period">
              <td>
                <input type="text" defaultValue="2.00 - 3.00" />
              </td>
              <td>
                <input
                  type="text"
                  defaultValue={timetableData[5]?.Monday || ''}
                  onChange={(e) => handleInputChange(5, 'Monday', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  defaultValue={timetableData[5]?.Tuesday || ''}
                  onChange={(e) => handleInputChange(5, 'Tuesday', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  defaultValue={timetableData[5]?.Wednesday || ''}
                  onChange={(e) => handleInputChange(5, 'Wednesday', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  defaultValue={timetableData[5]?.Thursday || ''}
                  onChange={(e) => handleInputChange(5, 'Thursday', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  defaultValue={timetableData[5]?.Friday || ''}
                  onChange={(e) => handleInputChange(5, 'Friday', e.target.value)}
                />
              </td>
            </tr>
            {/* row 7 */}
            <tr className="time-period">
              <td>
                <input type="text" defaultValue="3.00 - 4.00" />
              </td>
              <td>
                <input
                  type="text"
                  defaultValue={timetableData[6]?.Monday || ''}
                  onChange={(e) => handleInputChange(6, 'Monday', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  defaultValue={timetableData[6]?.Tuesday || ''}
                  onChange={(e) => handleInputChange(6, 'Tuesday', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  defaultValue={timetableData[6]?.Wednesday || ''}
                  onChange={(e) => handleInputChange(6, 'Wednesday', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  defaultValue={timetableData[6]?.Thursday || ''}
                  onChange={(e) => handleInputChange(6, 'Thursday', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  defaultValue={timetableData[6]?.Friday || ''}
                  onChange={(e) => handleInputChange(6, 'Friday', e.target.value)}
                />
              </td>
            </tr>
            {/* row 8 */}
            <tr className="time-period">
              <td>
                <input type="text" defaultValue="4.00 - 5.00" />
              </td>
              <td>
                <input
                  type="text"
                  defaultValue={timetableData[7]?.Monday || ''}
                  onChange={(e) => handleInputChange(7, 'Monday', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  defaultValue={timetableData[7]?.Tuesday || ''}
                  onChange={(e) => handleInputChange(7, 'Tuesday', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  defaultValue={timetableData[7]?.Wednesday || ''}
                  onChange={(e) => handleInputChange(7, 'Wednesday', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  defaultValue={timetableData[7]?.Thursday || ''}
                  onChange={(e) => handleInputChange(7, 'Thursday', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  defaultValue={timetableData[7]?.Friday || ''}
                  onChange={(e) => handleInputChange(7, 'Friday', e.target.value)}
                />
              </td>
            </tr>
          </tbody>
        </table>
        <div className="timetable-update-btn">
          <button type="submit">UPDATE</button>
        </div>
      </form>
    </div>
  );
}

export default UpdateTimeTable;
