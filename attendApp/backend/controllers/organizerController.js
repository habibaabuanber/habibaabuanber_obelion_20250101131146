const Organizer = require('../models/OrganizerModel');

// Create a new organizer
exports.addOrganizer = async (req, res) => {
  try {
    const { email, permissions, primaryOrganizerId } = req.body;

    // Check if the organizer already exists
    const existingOrganizer = await Organizer.findOne({ where: { email } });
    if (existingOrganizer) {
      return res.status(400).json({ error: 'Organizer already exists' });
    }

    // Create a new organizer
    const newOrganizer = await Organizer.create({
      email,
      permissions,
      primaryOrganizerId,
      passwordHash: 'hashedPassword', // Placeholder for password hash generation
    });

    res.status(201).json(newOrganizer);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while adding the organizer' });
  }
};

// Get all organizers
exports.getOrganizers = async (req, res) => {
  try {
    const organizers = await Organizer.findAll();
    res.status(200).json(organizers);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching organizers' });
  }
};

// Update an organizer's permissions
exports.updateOrganizerPermissions = async (req, res) => {
  try {
    const { id } = req.params;
    const { permissions } = req.body;

    const organizer = await Organizer.findByPk(id);
    if (!organizer) {
      return res.status(404).json({ error: 'Organizer not found' });
    }

    organizer.permissions = permissions;
    await organizer.save();

    res.status(200).json(organizer);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while updating permissions' });
  }
};

// Delete an organizer
exports.deleteOrganizer = async (req, res) => {
  try {
    const { id } = req.params;

    const organizer = await Organizer.findByPk(id);
    if (!organizer) {
      return res.status(404).json({ error: 'Organizer not found' });
    }

    await organizer.destroy();
    res.status(204).json();
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while deleting the organizer' });
  }
};
