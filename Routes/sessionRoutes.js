const express = require('express');
const router = express.Router();
const Session = require('../Models/Session'); // Assuming Session model exists

// Create a new session
router.post('/', async (req, res) => {
    const { userId, userModel, token } = req.body; // Expecting userId, userModel and token in request body
    try {
        // Validate userModel
        if (!['Admin', 'Therapist'].includes(userModel)) {
            return res.status(400).json({ message: 'Invalid user model' });
        }

        const newSession = new Session({ userId, userModel, token });
        await newSession.save();
        res.status(201).json({ message: 'Session created successfully', session: newSession });
    } catch (error) {
        res.status(500).json({ message: 'Error creating session', error });
    }
});

// Get all sessions
router.get('/', async (req, res) => {
    try {
        const sessions = await Session.find();
        res.status(200).json(sessions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching sessions', error });
    }
});

// Update a session
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { userId, userModel, token } = req.body; // Expecting these fields for update
    try {
        // Validate userModel
        if (!['Admin', 'Therapist'].includes(userModel)) {
            return res.status(400).json({ message: 'Invalid user model' });
        }

        const updatedSession = await Session.findByIdAndUpdate(id, { userId, userModel, token }, { new: true });
        if (!updatedSession) {
            return res.status(404).json({ message: 'Session not found' });
        }
        res.status(200).json({ message: 'Session updated', session: updatedSession });
    } catch (error) {
        res.status(500).json({ message: 'Error updating session', error });
    }
});

module.exports = router;
