import React, { useEffect, useState } from 'react';
import { Icon } from '@shopify/polaris';
import { DeleteIcon } from '@shopify/polaris-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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

  // Function to format date and time
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);

    const formattedDate = new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);

    const formattedTime = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }).format(date);

    return `${formattedDate} at ${formattedTime}`;
  };

  // Function to calculate remaining time for a live countdown
  const calculateRemainingTime = (endDateTime) => {
    const endTime = new Date(endDateTime).getTime();
    const now = new Date().getTime();
    const difference = endTime - now;

    if (difference <= 0) {
      return 'Expired';
    }

    const hours = Math.floor(difference / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  // Hook to update countdown every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTimers((timers) => timers.map(timer => ({
        ...timer, 
        remainingTime: calculateRemainingTime(timer.endDateTime)
      })));
    }, 1000);

    return () => clearInterval(interval); // Clear interval on component unmount
  }, [timers]);

  const handleDelete = async (timerId) => {
    try {
      const response = await fetch(`/api/timers/${timerId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete the timer');
      }

      setTimers((prevTimers) => prevTimers.filter((timer) => timer._id !== timerId));
      toast.success('Timer deleted successfully');
    } catch (err) {
      setError(err.message);
      toast.error('Failed to delete the timer');
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="timer-list">
      <ToastContainer/>
      <h2>Your Timers</h2>
      {timers.length === 0 ? (
        <div className="no-timers">
          <p>Currently, there are no timers. Please add a new timer.</p>
        </div>
      ) : (
        <ul className="timers-list">
          {timers.map((timer) => (
            <li key={timer._id} className="timer-item">
              <div className="timer-info">
                <div><strong>Start Time:</strong> {formatDateTime(timer.startDateTime)}</div>
                <div><strong>End Time:</strong> {formatDateTime(timer.endDateTime)}</div>
              </div>
              <div className="countdown">
                {timer.remainingTime ? <strong>Time Remaining:</strong> : <strong>Status:</strong>} {timer.remainingTime || 'Expired'}
              </div>
              <button
                onClick={() => handleDelete(timer._id)}
                aria-label="Delete Timer"
                className="delete-button"
              >
                <Icon source={DeleteIcon} color="critical" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TimerList;
