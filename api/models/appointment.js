const mongoose = require('mongoose');
const User = require('./user');

const appointmentSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  doctorId: { type: String },
  patientId: { type: String },
  time: { type: String, required: true },
  status: { type: String, default: 'pending', required: true },
});

module.exports = mongoose.model('Appointment', appointmentSchema);
