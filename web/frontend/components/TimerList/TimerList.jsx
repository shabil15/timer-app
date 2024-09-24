import React, { useEffect, useState } from 'react';
import './TimerList.css'; 

function TimerList() {
  const [timers, setTimers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTimers = async () => {
      try {
        const response = await fetch('/api/timers');
        if (!response.ok) {
          throw new Error('Failed to fetch timers');
        }
        const data = await response.json();
        setTimers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTimers();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="timer-list">
      <h2>Your Timers</h2>
      {timers.length === 0 ? (
        <div>
          <p>Currently, there are no timers. Please add a new timer.</p>
        </div>
      ) : (
        <ul>
          {timers.map((timer) => (
            <li key={timer._id}>
              <div>
                <strong>Start Time:</strong> {new Date(timer.startDateTime).toLocaleString()}
              </div>
              <div>
                <strong>End Time:</strong> {new Date(timer.endDateTime).toLocaleString()}
              </div>
              <div>
                <strong>Shop:</strong> {timer.shop}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TimerList;
