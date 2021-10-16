const mongoose = require('mongoose');

const treatmentSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  appointmentId: { type: String, required: true },
  treatment: { type: String, required: true },
});

module.exports = mongoose.model('Treatment', treatmentSchema);
