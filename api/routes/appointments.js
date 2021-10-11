const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Appointment = require('../models/appointment');

///////////////////   APPOINTMENT BOOKING MODULE   ////////////////////

router.post('/', (req, res) => {
  Appointment.find({ time: req.body.time })
    .exec()
    .then((appointment) => {
      if (appointment.length >= 1) {
        return res.status(409).json({
          message: `Appointment already booked at: ${req.body.time}`,
        });
      } else {
        const appointment = new Appointment({
          _id: new mongoose.Types.ObjectId(),
          doctorId: req.body.doctorId,
          patient: req.body.patientId,
          time: req.body.time,
          status: req.body.status || 'pending',
        });
        appointment
          .save()
          .then((result) => {
            res.status(201).json({
              message: 'Appointment created successfully',
              result,
            });
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({
              password: req.body.password,
              error: err,
            });
          });
      }
    });
});

module.exports = router;
