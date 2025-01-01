const fs = require('fs');
const path = require('path');
const { Attendee } = require('../models/AttendeeModel');

// Utility function to parse and upload attendees from a file
const uploadAttendeesFromFile = async (filePath) => {
  try {
    const fileData = fs.readFileSync(path.resolve(filePath), 'utf8');
    const parsedAttendees = JSON.parse(fileData);

    for (const attendee of parsedAttendees) {
      const { name, email } = attendee;
      // Assuming password is generated or handled elsewhere
      if (name && email) {
        await Attendee.create({ name, email, password: 'defaultPassword' });
      }
    }
    return { success: true, message: 'Attendees uploaded successfully' };
  } catch (error) {
    return { success: false, message: 'Failed to upload attendees', error };
  }
};

module.exports = { uploadAttendeesFromFile };
