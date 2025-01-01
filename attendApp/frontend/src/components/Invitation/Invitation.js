import React, { useState } from 'react';
import './Invitation.css';
import axios from 'axios';

function Invitation() {
  const [attendees, setAttendees] = useState([]);
  const [newAttendee, setNewAttendee] = useState({ name: '', email: '', password: '' });
  const [bulkUploadData, setBulkUploadData] = useState('');

  const addAttendee = async () => {
    if (newAttendee.name && newAttendee.email && newAttendee.password) {
      try {
        const response = await axios.post('https://attendapp-backend.cloud-stacks.com/api/attendees', newAttendee, {
          headers: { 'Content-Type': 'application/json' }
        });
        setAttendees([...attendees, response.data]);
        setNewAttendee({ name: '', email: '', password: '' });
      } catch (error) {
        console.error('Failed to add attendee:', error);
      }
    }
  };

  const bulkUploadAttendees = async () => {
    const uploadedAttendees = bulkUploadData.split('\n').map(line => {
      const [name, email, password] = line.split(',');
      return { name, email, password };
    });
    try {
      await Promise.all(uploadedAttendees.map(attendee => axios.post('https://attendapp-backend.cloud-stacks.com/api/attendees', attendee, {
        headers: { 'Content-Type': 'application/json' }
      })));
      setAttendees([...attendees, ...uploadedAttendees]);
      setBulkUploadData('');
    } catch (error) {
      console.error('Failed to bulk upload attendees:', error);
    }
  };

  const sendInvitations = async () => {
    try {
      const response = await axios.post('https://attendapp-backend.cloud-stacks.com/api/upload-attendees', attendees, {
        headers: { 'Content-Type': 'application/json' }
      });
      console.log('Invitations sent to:', response.data);
    } catch (error) {
      console.error('Failed to send invitations:', error);
    }
  };

  return (
    <div className="invitation">
      <h2>Manage Attendees</h2>
      <div>
        <input
          type="text"
          value={newAttendee.name}
          onChange={(e) => setNewAttendee({ ...newAttendee, name: e.target.value })}
          placeholder="Add attendee name"
        />
        <input
          type="email"
          value={newAttendee.email}
          onChange={(e) => setNewAttendee({ ...newAttendee, email: e.target.value })}
          placeholder="Add attendee email"
        />
        <input
          type="password"
          value={newAttendee.password}
          onChange={(e) => setNewAttendee({ ...newAttendee, password: e.target.value })}
          placeholder="Add attendee password"
        />
        <button onClick={addAttendee}>Add Attendee</button>
      </div>
      <div>
        <textarea
          value={bulkUploadData}
          onChange={(e) => setBulkUploadData(e.target.value)}
          placeholder="Bulk upload attendees, format: name,email,password per line"
        ></textarea>
        <button onClick={bulkUploadAttendees}>Upload Attendees</button>
      </div>
      <div>
        <button onClick={sendInvitations}>Send Invitations</button>
      </div>
      <ul>
        {attendees.map((attendee, index) => (
          <li key={index}>
            {attendee.name} - RSVP: {attendee.rsvp || 'Pending'}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Invitation;