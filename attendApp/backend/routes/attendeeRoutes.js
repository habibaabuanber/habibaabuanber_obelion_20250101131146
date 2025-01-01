const express = require('express');
const { getAllAttendees, addAttendee, updateAttendee, deleteAttendee } = require('../controllers/attendeeController');

const router = express.Router();

router.get('/attendees', getAllAttendees);
router.post('/attendees', addAttendee);
router.put('/attendees/:id', updateAttendee);
router.delete('/attendees/:id', deleteAttendee);

module.exports = router;
