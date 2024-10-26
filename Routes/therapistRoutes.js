// const express = require('express');
// const router = express.Router();
// const Therapist = require('../Models/Therapist');
// const bcrypt = require('bcrypt'); // Import bcrypt

// // Therapist login
// router.post('/login', async (req, res) => {
//     const { username, password } = req.body;
//     try {
//         const therapist = await Therapist.findOne({ username });
//         if (therapist && await bcrypt.compare(password, therapist.password)) {
//             res.status(200).json({ message: 'Login successful', therapist });
//         } else {
//             res.status(400).json({ message: 'Invalid credentials' });
//         }
//     } catch (error) {
//         res.status(500).json({ message: 'Error logging in', error });
//     }
// });

// // Therapist signup
// router.post('/signup', async (req, res) => {
//     const { username, password } = req.body;

//     try {
//         // Check if user already exists
//         const existingUser = await Therapist.findOne({ username });
//         if (existingUser) {
//             return res.status(400).json({ success: false, message: 'User already exists!' });
//         }

//         // Check if the password is provided
//         if (!password) {
//             return res.status(400).json({ success: false, message: 'Password is required!' });
//         }

//         // Log the password for debugging
//         console.log("Password to hash:", password);

//         // Hash the password before saving
//         const hashedPassword = await bcrypt.hash(password, 10); // 10 rounds
//         const newTherapist = new Therapist({ username, password: hashedPassword });
//         await newTherapist.save();

//         res.status(201).json({ success: true, message: 'Therapist registered successfully!' });
//     } catch (error) {
//         console.error('Error during signup:', error);
//         res.status(500).json({ success: false, message: 'Server error', error: error.message });
//     }
// });

// // Get all therapists
// router.get('/', async (req, res) => {
//     try {
//         const therapists = await Therapist.find();
//         res.status(200).json(therapists);
//     } catch (error) {
//         res.status(500).json({ message: 'Error fetching therapists', error });
//     }
// });
// router.get('/:id', async (req, res) => {
//     try {
//         const therapist = await Therapist.findById(req.params.id);
//         if (!therapist) {
//             return res.status(404).json({ message: 'Therapist not found' });
//         }
//         res.status(200).json(therapist);
//     } catch (error) {
//         res.status(500).json({ message: 'Error fetching therapist', error });
//     }
// });


// module.exports = router;

const express = require('express');
const router = express.Router();
const Therapist = require('../Models/Therapist');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // Import jsonwebtoken
const Request = require('../Models/Request'); // Adjust the path as necessary


// Secret key for JWT (store this in environment variables in production)
const JWT_SECRET = 'your_jwt_secret_key'; // Change this to your secret key

// Therapist login
// router.post('/login', async (req, res) => {
//     const { username, password } = req.body;
//     try {
//         const therapist = await Therapist.findOne({ username });
//         if (therapist && await bcrypt.compare(password, therapist.password)) {
//             // Generate a token
//             const token = jwt.sign(
//                 { id: therapist._id, username: therapist.username },
//                 JWT_SECRET,
//                 { expiresIn: '2h' } // Token expires in 2 hours
//             );

//             // Send back the therapist ID along with the token
//             res.status(200).json({
//                 message: 'Login successful',
//                 token,
//                 id: therapist._id // Include therapist ID
//             });
//         } else {
//             res.status(400).json({ message: 'Invalid credentials' });
//         }
//     } catch (error) {
//         res.status(500).json({ message: 'Error logging in', error });
//     }
// });

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        // Check if the therapist exists
        const therapist = await Therapist.findOne({ username });
        
        if (!therapist) {
            // If therapist is not found, return a specific message
            return res.status(404).json({ message: 'User not found' });
        }

        // If the therapist is found, check the password
        const isPasswordValid = await bcrypt.compare(password, therapist.password);
        if (isPasswordValid) {
            // Generate a token
            const token = jwt.sign(
                { id: therapist._id, username: therapist.username },
                JWT_SECRET,
                { expiresIn: '2h' } // Token expires in 2 hours
            );

            // Send back the therapist ID along with the token
            return res.status(200).json({
                message: 'Login successful',
                token,
                id: therapist._id // Include therapist ID
            });
        } else {
            // If the password is incorrect
            return res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error logging in', error });
    }
});



  


// Therapist signup
router.post('/signup', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if user already exists
        const existingUser = await Therapist.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists!' });
        }

        // Check if the password is provided
        if (!password) {
            return res.status(400).json({ success: false, message: 'Password is required!' });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10); // 10 rounds
        const newTherapist = new Therapist({ username, password: hashedPassword });
        await newTherapist.save();

        res.status(201).json({ success: true, message: 'Therapist registered successfully!' });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

// Get all therapists
router.get('/', async (req, res) => {
    try {
        const therapists = await Therapist.find();
        res.status(200).json(therapists);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching therapists', error });
    }
});

// Get therapist by ID
router.get('/:id', async (req, res) => {
    try {
        const therapist = await Therapist.findById(req.params.id);
        if (!therapist) {
            return res.status(404).json({ message: 'Therapist not found' });
        }
        res.status(200).json(therapist);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching therapist', error });
    }
});


// Therapist submits a request
router.post('/request', async (req, res) => {
    const { therapist, age, qualification, speciality } = req.body;

    try {
        // Validate incoming data
        if (!therapist || !age || !qualification || !speciality) {
            return res.status(400).json({ success: false, message: 'All fields are required!' });
        }

        // Save the request to the database
        const newRequest = new Request({ therapist, age, qualification, speciality, status: 'pending' });
        await newRequest.save();

        res.status(201).json({ success: true, message: 'Request submitted successfully!', request: newRequest });
    } catch (error) {
        console.error('Error submitting request:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

module.exports = router;
