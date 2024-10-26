const express = require('express');
const router = express.Router();
const Request = require('../Models/Request');

// Get all requests
router.get('/', async (req, res) => {
    try {
        const requests = await Request.find();
        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching requests', error });
    }
});

// Approve a request
router.put('/approve/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const updatedRequest = await Request.findByIdAndUpdate(id, { status: 'approved' }, { new: true });
        res.status(200).json({ message: 'Request approved', request: updatedRequest });
    } catch (error) {
        res.status(500).json({ message: 'Error approving request', error });
    }
});

// Reject a request
router.put('/reject/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const updatedRequest = await Request.findByIdAndUpdate(id, { status: 'rejected' }, { new: true });
        res.status(200).json({ message: 'Request rejected', request: updatedRequest });
    } catch (error) {
        res.status(500).json({ message: 'Error rejecting request', error });
    }
});
// Create a new request
router.post('/', async (req, res) => {
    const { therapist, age, qualification, speciality } = req.body;

    try {
        const newRequest = new Request({
            therapist,
            age,
            qualification,
            speciality
        });

        await newRequest.save();
        res.status(201).json({ success: true, message: 'Request created successfully', newRequest });
    } catch (error) {
        console.error('Error creating request:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const request = await Request.findById(req.params.id);
        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }
        res.status(200).json(request);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching request', error });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const updatedRequest = await Request.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedRequest) {
            return res.status(404).json({ message: 'Request not found' });
        }
        res.status(200).json(updatedRequest);
    } catch (error) {
        res.status(500).json({ message: 'Error updating request', error });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deletedRequest = await Request.findByIdAndDelete(req.params.id);
        if (!deletedRequest) {
            return res.status(404).json({ message: 'Request not found' });
        }
        res.status(200).json({ message: 'Request deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting request', error });
    }
});





module.exports = router;

// 671a0c5b4f494a4dd1a4945c