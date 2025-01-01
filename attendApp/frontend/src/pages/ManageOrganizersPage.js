import React, { useState, useEffect } from 'react';
import './ManageOrganizersPage.css';

const ManageOrganizersPage = () => {
  const [organizers, setOrganizers] = useState([]);
  const [newOrganizer, setNewOrganizer] = useState('');
  const [permissions, setPermissions] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrganizers = async () => {
      try {
        const response = await fetch('https://attendapp-backend.cloud-stacks.com/api/organizers');
        if (!response.ok) throw new Error('Failed to fetch organizers');
        const data = await response.json();
        setOrganizers(data);
        const permissionsObj = data.reduce((acc, organizer) => {
          acc[organizer.email] = organizer.permissions;
          return acc;
        }, {});
        setPermissions(permissionsObj);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchOrganizers();
  }, []);

  const handleAddOrganizer = async () => {
    if (newOrganizer && !organizers.some(org => org.email === newOrganizer)) {
      try {
        const response = await fetch('https://attendapp-backend.cloud-stacks.com/api/organizers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: newOrganizer, permissions: [], primaryOrganizerId: 1 })
        });
        if (!response.ok) throw new Error('Failed to add organizer');
        const addedOrganizer = await response.json();
        setOrganizers([...organizers, addedOrganizer]);
        setPermissions({ ...permissions, [newOrganizer]: [] });
        setNewOrganizer('');
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handlePermissionChange = async (organizer, module) => {
    const currentPermissions = permissions[organizer] || [];
    const newPermissions = currentPermissions.includes(module) ?
      currentPermissions.filter((perm) => perm !== module) :
      [...currentPermissions, module];

    try {
      const response = await fetch(`https://attendapp-backend.cloud-stacks.com/api/organizers/${organizer}/permissions`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ permissions: newPermissions })
      });
      if (!response.ok) throw new Error('Failed to update permissions');
      setPermissions({ ...permissions, [organizer]: newPermissions });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="manage-organizers-page">
      <h1>Manage Organizers</h1>
      {error && <div className="error">{error}</div>}
      <div className="add-organizer">
        <input
          type="text"
          value={newOrganizer}
          onChange={(e) => setNewOrganizer(e.target.value)}
          placeholder="Enter organizer email"
        />
        <button onClick={handleAddOrganizer}>Add Organizer</button>
      </div>
      <div className="organizers-list">
        {organizers.map((organizer) => (
          <div key={organizer.id} className="organizer-item">
            <span className="organizer-name">{organizer.email}</span>
            <div className="permissions">
              <label>
                <input
                  type="checkbox"
                  checked={permissions[organizer.email]?.includes('ModuleA') || false}
                  onChange={() => handlePermissionChange(organizer.email, 'ModuleA')}
                />
                Module A
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={permissions[organizer.email]?.includes('ModuleB') || false}
                  onChange={() => handlePermissionChange(organizer.email, 'ModuleB')}
                />
                Module B
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageOrganizersPage;