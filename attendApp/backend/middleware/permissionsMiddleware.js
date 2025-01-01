const Organizer = require('../models/OrganizerModel');

// Middleware to check permissions
const checkPermissions = (requiredPermissions) => {
  return async (req, res, next) => {
    try {
      const organizerId = req.body.primaryOrganizerId || req.params.id;
      const organizer = await Organizer.findByPk(organizerId);

      if (!organizer) {
        return res.status(404).json({ error: 'Organizer not found' });
      }

      const hasPermission = requiredPermissions.every(permission =>
        organizer.permissions.includes(permission)
      );

      if (!hasPermission) {
        return res.status(403).json({ error: 'Permission denied' });
      }

      next();
    } catch (error) {
      res.status(500).json({ error: 'An error occurred during permission check' });
    }
  };
};

module.exports = checkPermissions;
