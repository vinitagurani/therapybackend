const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
    therapist: { type: mongoose.Schema.Types.ObjectId, ref: 'Therapist', required: true },
    age: { type: Number },
    qualification: { type: String },
    speciality: { type: String },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Request', RequestSchema);
