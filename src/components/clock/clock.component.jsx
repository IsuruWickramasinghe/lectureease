import React, { useState, useEffect } from 'react'

import './clock.style.css'

function Clock() {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
      const intervalId = setInterval(() => {
        setCurrentTime(new Date());
      }, 1000);
  
      return () => {
        clearInterval(intervalId);
      };
    }, []);
  
    return (
      <div>
        <div className='clock'>{currentTime.toLocaleTimeString()}</div>
      </div>
    );
}

export default Clock