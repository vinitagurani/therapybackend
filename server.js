// const express = require('express');
// const mongoose = require('mongoose');
// const therapistRoutes = require('./Routes/therapistRoutes');
// const adminRoutes = require('./Routes/adminRoutes');
// const sessionRoutes = require('./Routes/sessionRoutes');
// const requestRoutes = require('./Routes/requestRoutes');
// const cors = require('cors'); // Import cors

// const app = express(); // Initialize app

// const corsOptions = {
//     origin: 'http://localhost:5173',
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     credentials: true,
// };

// // Middleware setup
// app.use(cors(corsOptions)); // Use CORS middleware
// app.use(express.json()); // Use express's built-in JSON parser

// // Routes
// app.use('/api/therapists', therapistRoutes);
// app.use('/api/admin', adminRoutes);
// app.use('/api/sessions', sessionRoutes);
// app.use('/api/requests', requestRoutes);

// // MongoDB connection
// mongoose.connect('mongodb://localhost:27017/therapyPlatform', { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => console.log('MongoDB connected'))
//     .catch(err => console.error('MongoDB connection error:', err));

// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });

// // Error handling middleware
// app.use((err, req, res, next) => {
//     console.error('Error:', err);
//     res.status(500).json({ success: false, message: 'Internal Server Error' });
// });

const express = require('express');
const mongoose = require('mongoose');
const therapistRoutes = require('./Routes/therapistRoutes');
const adminRoutes = require('./Routes/adminRoutes');
const sessionRoutes = require('./Routes/sessionRoutes');
const requestRoutes = require('./Routes/requestRoutes');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// CORS options
// const corsOptions = {
//     origin: 'http://localhost:5173',
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     // credentials: true,
// };

const allowedOrigins = ['https://your-production-frontend-url.com', 'http://localhost:5173'];

const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) { // Allow requests with no origin (like mobile apps)
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json()); // This should come before your routes
app.use(express.json());

// Routes
app.use('/api/therapists', therapistRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/requests', requestRoutes);

const mongoURI = 'mongodb+srv://vinita:vinitagurnani@cluster0.r0lmqrf.mongodb.net/';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
