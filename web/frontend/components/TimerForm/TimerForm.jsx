import React, { useState } from "react";
import "./TimerForm.css";

function TimerForm() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="timer-container">
      <button className="add-button" onClick={() => setShowForm(true)}>
        +Add
      </button>

      {showForm && (
        <div className="timer-form">
          <div className="input-row">
            <input type="date" placeholder="Start Date" />
            <input type="time" placeholder="Start Time" />
          </div>

          <div className="input-row">
            <input type="date" placeholder="End Date" />
            <input type="time" placeholder="End Time" />
          </div>

          <button className="save-button" onClick={() => setShowForm(false)}>
            Save
          </button>
        </div>
      )}
    </div>
  );
}

export default TimerForm;
