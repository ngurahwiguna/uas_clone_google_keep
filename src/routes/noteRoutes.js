const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteControllers');

// Mapping endpoints
router.get('/', noteController.getAllNotes);
router.post('/', noteController.createNote);
router.put('/:id', noteController.updateNote);
router.delete('/:id', noteController.deleteNote);

module.exports = router;