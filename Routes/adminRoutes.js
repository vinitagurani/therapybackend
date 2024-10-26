// const express = require('express');
// const router = express.Router();
// const Admin = require('../Models/Admin'); // Assuming you have the Admin model

// // Admin login
// router.post('/login', async (req, res) => {
//     const { username, password } = req.body;
//     try {
//         const admin = await Admin.findOne({ username });
//         if (admin && admin.password === password) {
//             res.status(200).json({ message: 'Login successful', admin });
//         } else {
//             res.status(400).json({ message: 'Invalid credentials' });
//         }
//     } catch (error) {
//         res.status(500).json({ message: 'Error logging in', error });
//     }
// });

// // Admin sign-up
// router.post('/signup', async (req, res) => {
//     const { username, password } = req.body;
//     try {
//         const adminExists = await Admin.findOne({ username });
//         if (adminExists) {
//             return res.status(400).json({ message: 'Admin already exists' });
//         }

//         const newAdmin = new Admin({ username, password });
//         await newAdmin.save();
//         res.status(201).json({ message: 'Admin registered successfully', admin: newAdmin });
//     } catch (error) {
//         res.status(500).json({ message: 'Error signing up', error });
//     }
// });

// module.exports = router;


const express = require('express');
const router = express.Router();
const Admin = require('../Models/Admin'); // Assuming you have the Admin model
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // Import jsonwebtoken
const Request = require('../Models/Request');

// Secret key for JWT (store this in environment variables in production)
const JWT_SECRET = 'your_jwt_secret_key'; // Change this to your secret key

// Admin login
// router.post('/login', async (req, res) => {
//     const { username, password } = req.body;
//     try {
//         const admin = await Admin.findOne({ username });
//         if (admin && await bcrypt.compare(password, admin.password)) {
//             // Generate a token
//             const token = jwt.sign(
//                 { id: admin._id, username: admin.username },
//                 JWT_SECRET,
//                 { expiresIn: '2h' } // Token expires in 2 hours
//             );
//             res.status(200).json({ message: 'Login successful', token });
//         } else {
//             res.status(400).json({ message: 'Invalid credentials' });
//         }
//     } catch (error) {
//         res.status(500).json({ message: 'Error logging in', error });
//     }
// });

// Admin login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const admin = await Admin.findOne({ username });
        if (!admin) {
            return res.status(404).json({ message: 'User not found' }); // Distinct error message
        }

        if (await bcrypt.compare(password, admin.password)) {
            // Generate a token
            const token = jwt.sign(
                { id: admin._id, username: admin.username },
                JWT_SECRET,
                { expiresIn: '2h' } // Token expires in 2 hours
            );
            res.status(200).json({ message: 'Login successful', token });
        } else {
            res.status(400).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
});


// Admin sign-up
router.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    try {
        const adminExists = await Admin.findOne({ username });
        if (adminExists) {
            return res.status(400).json({ message: 'Admin already exists' });
        }

        // Check if the password is provided
        if (!password) {
            return res.status(400).json({ message: 'Password is required!' });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10); // 10 rounds
        const newAdmin = new Admin({ username, password: hashedPassword });
        await newAdmin.save();

        // Optionally, you can generate a token upon signup as well
        const token = jwt.sign(
            { id: newAdmin._id, username: newAdmin.username },
            JWT_SECRET,
            { expiresIn: '2h' } // Token expires in 2 hours
        );

        res.status(201).json({ message: 'Admin registered successfully', admin: newAdmin, token });
    } catch (error) {
        res.status(500).json({ message: 'Error signing up', error });
    }
});

// Admin fetches all requests
router.get('/requests', async (req, res) => {
    try {
        const requests = await Request.find().populate('therapist'); // Assuming 'therapist' is a reference
        res.status(200).json({ success: true, requests });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching requests', error });
    }
}); // working  

router.put('/request/:id/approve', async (req, res) => {
    try {
        const requestId = req.params.id;
        const updatedRequest = await Request.findByIdAndUpdate(requestId, { status: 'approved' }, { new: true });

        if (!updatedRequest) {
            return res.status(404).json({ success: false, message: 'Request not found' });
        }

        res.status(200).json({ success: true, message: 'Request approved', request: updatedRequest });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error approving request', error });
    }
}); // wroking 

// Reject a request
router.put('/request/:id/reject', async (req, res) => {
    try {
        const requestId = req.params.id;
        await Request.findByIdAndUpdate(requestId, { status: 'rejected' });
        res.status(200).json({ success: true, message: 'Request rejected' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error rejecting request', error });
    }
}); // working 





module.exports = router;
