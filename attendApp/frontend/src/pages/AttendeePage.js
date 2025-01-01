import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CSVReader } from 'react-papaparse';
import './AttendeePage.css';

const AttendeePage = () => {
  const [attendees, setAttendees] = useState([]);
  const [newAttendee, setNewAttendee] = useState({ name: '', email: '', password: '' });

  useEffect(() => {
    const fetchAttendees = async () => {
      try {
        const response = await axios.get('https://attendapp-backend.cloud-stacks.com/api/attendees');
        setAttendees(response.data);
      } catch (error) {
        console.error('Error fetching attendees:', error);
      }
    };
    fetchAttendees();
  }, []);

  const handleAddAttendee = async () => {
    if (newAttendee.name && newAttendee.email && newAttendee.password) {
      try {
        const response = await axios.post('https://attendapp-backend.cloud-stacks.com/api/attendees', newAttendee, {
          headers: { 'Content-Type': 'application/json' }
        });
        setAttendees([...attendees, response.data]);
        setNewAttendee({ name: '', email: '', password: '' });
      } catch (error) {
        console.error('Error adding attendee:', error);
      }
    }
  };

  const handleBulkUpload = async (data) => {
    const uploadedAttendees = data.map(item => ({
      name: item.data.name,
      email: item.data.email,
      password: 'defaultPassword' // Assuming a default password
    }));
    try {
      await Promise.all(uploadedAttendees.map(attendee => 
        axios.post('https://attendapp-backend.cloud-stacks.com/api/attendees', attendee, {
          headers: { 'Content-Type': 'application/json' }
        })
      ));
      setAttendees([...attendees, ...uploadedAttendees]);
    } catch (error) {
      console.error('Error uploading attendees:', error);
    }
  };

  const handleInvitation = async (email, name) => {
    try {
      await axios.post('https://attendapp-backend.cloud-stacks.com/api/send-invitation', { email, name }, {
        headers: { 'Content-Type': 'application/json' }
      });
      console.log(`Invitation sent to ${email}`);
    } catch (error) {
      console.error(`Failed to send invitation to ${email}:`, error);
    }
  };

  const handleRSVPTracking = (email) => {
    console.log(`Tracking RSVP for ${email}`);
  };

  return (
    <div className="attendee-page">
      <h1>Manage Attendees</h1>
      
      <div className="add-attendee">
        <input
          type="text"
          placeholder="Name"
          value={newAttendee.name}
          onChange={(e) => setNewAttendee({ ...newAttendee, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          value={newAttendee.email}
          onChange={(e) => setNewAttendee({ ...newAttendee, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          value={newAttendee.password}
          onChange={(e) => setNewAttendee({ ...newAttendee, password: e.target.value })}
        />
        <button onClick={handleAddAttendee}>Add Attendee</button>
      </div>

      <CSVReader onFileLoaded={handleBulkUpload}>
        <button>Bulk Upload</button>
      </CSVReader>

      <ul className="attendee-list">
        {attendees.map((attendee, index) => (
          <li key={index}>
            <span>{attendee.name} - {attendee.email}</span>
            <button onClick={() => handleInvitation(attendee.email, attendee.name)}>Send Invitation</button>
            <button onClick={() => handleRSVPTracking(attendee.email)}>Track RSVP</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AttendeePage;