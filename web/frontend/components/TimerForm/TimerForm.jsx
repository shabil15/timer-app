import React, { useState, useEffect } from 'react';
import './TimerForm.css';

function TimerForm() {
  const [showForm, setShowForm] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [shop, setShop] = useState('');

  useEffect(() => {
  
    const fetchShop = async () => {
      try {
        const response = await fetch('/api/shop'); 
        const data = await response.json();
        if (response.ok) {
          setShop(data.shop); 
        } else {
          throw new Error('Failed to fetch shop information');
        }
      } catch (error) {
        console.error(error);
        alert('Error fetching shop: ' + error.message);
      }
    };

    fetchShop();
  }, []);

  function combineDateAndTime(dateInput, timeInput) {
    const dateTimeString = `${dateInput}T${timeInput}:00`;
    return new Date(dateTimeString);
  }

  const handleSubmit = async () => {
    const startDateTime = combineDateAndTime(startDate, startTime);
    const endDateTime = combineDateAndTime(endDate, endTime);
    
    const timerData = {
      startDateTime,
      endDateTime,
      shop, 
    };
    console.log(timerData);
    try {
      const response = await fetch('/api/timers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(timerData),
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message);
        setShowForm(false);
      } else {
        throw new Error('Failed to save timer');
      }
    } catch (error) {
      console.error(error);
      alert('Error saving timer: ' + error.message);
    }
  };

  return (
    <div className="timer-container">
      <button className="add-button" onClick={() => setShowForm(true)}>+Add</button>

      {showForm && (
        <div className="timer-form">
          <div className="input-row">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="Start Date"
            />
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              placeholder="Start Time"
            />
          </div>

          <div className="input-row">
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="End Date"
            />
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              placeholder="End Time"
            />
          </div>

          <button className="save-button" onClick={handleSubmit}>Save</button>
        </div>
      )}
    </div>
  );
}

export default TimerForm;
