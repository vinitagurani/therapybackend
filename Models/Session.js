const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'userModel' },
  userModel: { type: String, required: true, enum: ['Admin', 'Therapist'] },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: '2h' }, // Sessions expire after 2 hours
});

module.exports = mongoose.model('Session', SessionSchema);
