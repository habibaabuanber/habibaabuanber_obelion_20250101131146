import React, { useState } from 'react';
import './AttendeeManagement.css';
import axios from 'axios';

const AttendeeManagement = () => {
  const [attendees, setAttendees] = useState([]);
  const [rsvpStatuses, setRsvpStatuses] = useState({});
  const [newAttendee, setNewAttendee] = useState({ name: '', email: '', password: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAttendee({ ...newAttendee, [name]: value });
  };

  const addAttendee = async () => {
    if (newAttendee.name && newAttendee.email && newAttendee.password) {
      try {
        const response = await axios.post('https://attendapp-backend.cloud-stacks.com/api/attendees', newAttendee, {
          headers: { 'Content-Type': 'application/json' }
        });
        setAttendees([...attendees, response.data]);
        setNewAttendee({ name: '', email: '', password: '' });
      } catch (error) {
        console.error('Failed to add attendee', error);
      }
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = JSON.parse(e.target.result);
        await axios.post('https://attendapp-backend.cloud-stacks.com/api/upload-attendees', data, {
          headers: { 'Content-Type': 'application/json' }
        });
        setAttendees([...attendees, ...data]);
      } catch (error) {
        console.error('Failed to upload attendees', error);
      }
    };
    reader.readAsText(file);
  };

  const sendInvitations = async () => {
    const updatedRsvpStatuses = {};
    try {
      attendees.forEach(attendee => {
        updatedRsvpStatuses[attendee.email] = 'Pending';
      });
      setRsvpStatuses(updatedRsvpStatuses);
    } catch (error) {
      console.error('Failed to send invitations', error);
    }
  };

  return (
    <div className="attendee-management">
      <h1>Attendee Management</h1>
      <div className="add-attendee">
        <input
          type="text"
          name="name"
          placeholder="Attendee Name"
          value={newAttendee.name}
          onChange={handleInputChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Attendee Email"
          value={newAttendee.email}
          onChange={handleInputChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={newAttendee.password}
          onChange={handleInputChange}
        />
        <button onClick={addAttendee}>Add Attendee</button>
      </div>
      <div className="bulk-upload">
        <input type="file" accept=".json" onChange={handleFileUpload} />
        <button onClick={sendInvitations}>Send Invitations</button>
      </div>
      <div className="attendee-list">
        <h2>Attendees</h2>
        <ul>
          {attendees.map((attendee, index) => (
            <li key={index}>
              {attendee.name} - {attendee.email} - RSVP: {rsvpStatuses[attendee.email] || 'Not Sent'}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AttendeeManagement;