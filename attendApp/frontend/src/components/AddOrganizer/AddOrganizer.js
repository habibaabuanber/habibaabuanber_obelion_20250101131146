import React, { useState } from 'react';
import './AddOrganizer.css';

function AddOrganizer({ primaryOrganizer, onAddOrganizer }) {
  const [organizerEmail, setOrganizerEmail] = useState('');
  const [permissions, setPermissions] = useState([]);
  const [error, setError] = useState('');

  const handleEmailChange = (e) => {
    setOrganizerEmail(e.target.value);
  };

  const handlePermissionChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setPermissions([...permissions, value]);
    } else {
      setPermissions(permissions.filter((permission) => permission !== value));
    }
  };

  const handleAddOrganizer = async () => {
    if (organizerEmail && permissions.length > 0) {
      try {
        const response = await fetch('https://attendapp-backend.cloud-stacks.com/api/organizers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: organizerEmail,
            permissions,
            primaryOrganizerId: primaryOrganizer.id,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.error || 'An error occurred while adding the organizer');
          return;
        }

        const newOrganizer = await response.json();
        onAddOrganizer(newOrganizer);
        setOrganizerEmail('');
        setPermissions([]);
        setError('');
      } catch {
        setError('An error occurred while adding the organizer');
      }
    }
  };

  return (
    <div className="add-organizer">
      <h2>Add Additional Organizer</h2>
      <input
        type="email"
        value={organizerEmail}
        onChange={handleEmailChange}
        placeholder="Organizer's Email"
      />
      <div className="permissions">
        <label>
          <input
            type="checkbox"
            value="module1"
            checked={permissions.includes('module1')}
            onChange={handlePermissionChange}
          />
          Manage Module 1
        </label>
        <label>
          <input
            type="checkbox"
            value="module2"
            checked={permissions.includes('module2')}
            onChange={handlePermissionChange}
          />
          Manage Module 2
        </label>
      </div>
      <button onClick={handleAddOrganizer}>Add Organizer</button>
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default AddOrganizer;