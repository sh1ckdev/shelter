// models/volunteer-model.js
const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tasks: [{ type: String }],
    schedule: { type: String }, 
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
});

module.exports = mongoose.model('Volunteer', volunteerSchema);