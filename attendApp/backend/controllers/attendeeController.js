const Attendee = require('../models/AttendeeModel');

// Get all attendees
const getAllAttendees = async (req, res) => {
  try {
    const attendees = await Attendee.findAll();
    res.json(attendees);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve attendees' });
  }
};

// Add a new attendee
const addAttendee = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const newAttendee = await Attendee.create({ name, email, password });
    res.status(201).json(newAttendee);
  } catch (error) {
    res.status(400).json({ error: 'Failed to add attendee' });
  }
};

// Update an attendee
const updateAttendee = async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  try {
    const attendee = await Attendee.findByPk(id);
    if (!attendee) {
      return res.status(404).json({ error: 'Attendee not found' });
    }
    attendee.name = name || attendee.name;
    attendee.email = email || attendee.email;
    await attendee.save();
    res.json(attendee);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update attendee' });
  }
};

// Delete an attendee
const deleteAttendee = async (req, res) => {
  const { id } = req.params;
  try {
    const attendee = await Attendee.findByPk(id);
    if (!attendee) {
      return res.status(404).json({ error: 'Attendee not found' });
    }
    await attendee.destroy();
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete attendee' });
  }
};

module.exports = {
  getAllAttendees,
  addAttendee,
  updateAttendee,
  deleteAttendee
};
