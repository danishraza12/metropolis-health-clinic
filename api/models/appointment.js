const mongoose = require('mongoose');

const appointmentSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  doctorId: mongoose.Schema.Types.ObjectId,
  patientId: { type: String },
  time: { type: String, required: true },
  status: { type: String, default: 'pending', required: true },
});

module.exports = mongoose.model('Appointment', appointmentSchema);
