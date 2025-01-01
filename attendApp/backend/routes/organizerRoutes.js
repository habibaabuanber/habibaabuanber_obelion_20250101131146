const express = require('express');
const router = express.Router();
const organizerController = require('../controllers/organizerController');

router.post('/organizers', organizerController.addOrganizer);
router.get('/organizers', organizerController.getOrganizers);
router.put('/organizers/:id/permissions', organizerController.updateOrganizerPermissions);
router.delete('/organizers/:id', organizerController.deleteOrganizer);

module.exports = router;
