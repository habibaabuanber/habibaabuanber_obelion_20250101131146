import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './ManagePermissions.css';

const ManagePermissions = ({ primaryOrganizerId, onAddOrganizer }) => {
  const [organizerEmail, setOrganizerEmail] = useState('');
  const [permissions, setPermissions] = useState({
    manageEvents: false,
    manageAttendees: false,
    manageSponsors: false,
  });
  const [error, setError] = useState(null);

  const handleAddOrganizer = async () => {
    if (organizerEmail) {
      try {
        const response = await fetch('https://attendapp-backend.cloud-stacks.com/organizers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: organizerEmail,
            permissions,
            primaryOrganizerId,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to add organizer');
        }

        const newOrganizer = await response.json();
        onAddOrganizer(newOrganizer);
        setOrganizerEmail('');
        setPermissions({
          manageEvents: false,
          manageAttendees: false,
          manageSponsors: false,
        });
        setError(null);
      } catch (error) {
        setError(error.message);
      }
    }
  };

  const handlePermissionChange = (permission) => {
    setPermissions((prevPermissions) => ({
      ...prevPermissions,
      [permission]: !prevPermissions[permission],
    }));
  };

  return (
    <div className="manage-permissions-container">
      <h2>Add Additional Organizers</h2>
      {error && <div className="error-message">{error}</div>}
      <input
        type="email"
        value={organizerEmail}
        onChange={(e) => setOrganizerEmail(e.target.value)}
        placeholder="Enter organizer's email"
        className="organizer-email-input"
      />
      <div className="permissions-checkboxes">
        <label>
          <input
            type="checkbox"
            checked={permissions.manageEvents}
            onChange={() => handlePermissionChange('manageEvents')}
          />
          Manage Events
        </label>
        <label>
          <input
            type="checkbox"
            checked={permissions.manageAttendees}
            onChange={() => handlePermissionChange('manageAttendees')}
          />
          Manage Attendees
        </label>
        <label>
          <input
            type="checkbox"
            checked={permissions.manageSponsors}
            onChange={() => handlePermissionChange('manageSponsors')}
          />
          Manage Sponsors
        </label>
      </div>
      <button onClick={handleAddOrganizer} className="add-organizer-button">
        Add Organizer
      </button>
    </div>
  );
};

ManagePermissions.propTypes = {
  primaryOrganizerId: PropTypes.string.isRequired,
  onAddOrganizer: PropTypes.func.isRequired,
};

export default ManagePermissions;