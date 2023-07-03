import React, { useEffect, useState } from 'react';
import './time-table.style.css';
import { firestore } from '../../config/firebase-config';
import { doc, getDoc } from 'firebase/firestore';

function TimeTable() {
  const [timetableData, setTimetableData] = useState([]);
  const [selectedYear, setSelectedYear] = useState('yearOne');

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        const timetableRef = doc(firestore, 'timeTable', selectedYear);
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
  }, [selectedYear]);

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  return (
    <div className='time-table'>
      {/* select year */}
      <div className="year-select">
        <label htmlFor="year">Select Year: </label>
        <select name="year" id="year" value={selectedYear} onChange={handleYearChange}>
          <option value="yearOne">Year One</option>
          <option value="yearTwo">Year Two</option>
        </select>
      </div>
      <div className="table-wrapper">
        <table className="table displayTable mobileTT">
          {/* table header */}
          <thead className="thead">
            <tr className="table-header table-header-display">
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
                <div className="value-cell">8.30 - 9.30</div>
              </td>
              <td>
                <div className="value-cell">{timetableData[0]?.Monday || ''}</div>
              </td>
              <td>
                <div className="value-cell">{timetableData[0]?.Tuesday || ''}</div>
              </td>
              <td>
                <div className="value-cell">{timetableData[0]?.Wednesday || ''}</div>
              </td>
              <td>
                <div className="value-cell">{timetableData[0]?.Thursday || ''}</div>
              </td>
              <td>
                <div className="value-cell">{timetableData[0]?.Friday || ''}</div>
              </td>
            </tr>
            {/* row 2 */}
            <tr className="time-period">
              <td>
                <div className="value-cell">9.30 - 10.30</div>
              </td>
              <td>
                <div className="value-cell">{timetableData[1]?.Monday || ''}</div>
              </td>
              <td>
                <div className="value-cell">{timetableData[1]?.Tuesday || ''}</div>
              </td>
              <td>
                <div className="value-cell">{timetableData[1]?.Wednesday || ''}</div>
              </td>
              <td>
                <div className="value-cell">{timetableData[1]?.Thursday || ''}</div>
              </td>
              <td>
                <div className="value-cell">{timetableData[1]?.Friday || ''}</div>
              </td>
            </tr>
            {/* row 3 */}
            <tr className="time-period">
              <td>
                <div className="value-cell">10.30 - 11.30</div>
              </td>
              <td>
                <div className="value-cell">{timetableData[2]?.Monday || ''}</div>
              </td>
              <td>
                <div className="value-cell">{timetableData[2]?.Tuesday || ''}</div>
              </td>
              <td>
                <div className="value-cell">{timetableData[2]?.Wednesday || ''}</div>
              </td>
              <td>
                <div className="value-cell">{timetableData[2]?.Thursday || ''}</div>
              </td>
              <td>
                <div className="value-cell">{timetableData[2]?.Friday || ''}</div>
              </td>
            </tr>
            {/* row 4 */}
            <tr className="time-period">
              <td>
                <div className="value-cell">11.30 - 12.30</div>
              </td>
              <td>
                <div className="value-cell">{timetableData[3]?.Monday || ''}</div>
              </td>
              <td>
                <div className="value-cell">{timetableData[3]?.Tuesday || ''}</div>
              </td>
              <td>
                <div className="value-cell">{timetableData[3]?.Wednesday || ''}</div>
              </td>
              <td>
                <div className="value-cell">{timetableData[3]?.Thursday || ''}</div>
              </td>
              <td>
                <div className="value-cell">{timetableData[3]?.Friday || ''}</div>
              </td>
            </tr>
            {/* row 5 */}
            <tr className="time-period">
              <td>
                <div className="value-cell">1.00 - 2.00</div>
              </td>
              <td>
                <div className="value-cell">{timetableData[4]?.Monday || ''}</div>
              </td>
              <td>
                <div className="value-cell">{timetableData[4]?.Tuesday || ''}</div>
              </td>
              <td>
                <div className="value-cell">{timetableData[4]?.Wednesday || ''}</div>
              </td>
              <td>
                <div className="value-cell">{timetableData[4]?.Thursday || ''}</div>
              </td>
              <td>
                <div className="value-cell">{timetableData[4]?.Friday || ''}</div>
              </td>
            </tr>
            {/* row 6 */}
            <tr className="time-period">
              <td>
                <div className="value-cell">2.00 - 3.00</div>
              </td>
              <td>
                <div className="value-cell">{timetableData[5]?.Monday || ''}</div>
              </td>
              <td>
                <div className="value-cell">{timetableData[5]?.Tuesday || ''}</div>
              </td>
              <td>
                <div className="value-cell">{timetableData[5]?.Wednesday || ''}</div>
              </td>
              <td>
                <div className="value-cell">{timetableData[5]?.Thursday || ''}</div>
              </td>
              <td>
                <div className="value-cell">{timetableData[5]?.Friday || ''}</div>
              </td>
            </tr>
            {/* row 7 */}
            <tr className="time-period">
              <td>
                <div className="value-cell">3.00 - 4.00</div>
              </td>
              <td>
                <div className="value-cell">{timetableData[6]?.Monday || ''}</div>
              </td>
              <td>
                <div className="value-cell">{timetableData[6]?.Tuesday || ''}</div>
              </td>
              <td>
                <div className="value-cell">{timetableData[6]?.Wednesday || ''}</div>
              </td>
              <td>
                <div className="value-cell">{timetableData[6]?.Thursday || ''}</div>
              </td>
              <td>
                <div className="value-cell">{timetableData[6]?.Friday || ''}</div>
              </td>
            </tr>
            {/* row 8 */}
            <tr className="time-period">
              <td>
                <div className="value-cell">4.00 - 5.00</div>
              </td>
              <td>
                <div className="value-cell">{timetableData[7]?.Monday || ''}</div>
              </td>
              <td>
                <div className="value-cell">{timetableData[7]?.Tuesday || ''}</div>
              </td>
              <td>
                <div className="value-cell">{timetableData[7]?.Wednesday || ''}</div>
              </td>
              <td>
                <div className="value-cell">{timetableData[7]?.Thursday || ''}</div>
              </td>
              <td>
                <div className="value-cell">{timetableData[7]?.Friday || ''}</div>
              </td>
            </tr>
            {/* ... */}
          </tbody>
        </table>
      </div>
        
    </div>
  );
}

export default TimeTable;
