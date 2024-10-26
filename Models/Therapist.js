const mongoose = require('mongoose');

const TherapistSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: { type: Number },
  qualification: { type: String },
  speciality: { type: String },
  requests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Request' }],
});

module.exports = mongoose.model('Therapist', TherapistSchema);
