const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const Appointment = require('../models/appointment');
const checkAuthentication = require('../middleware/checkAuthentication');

///////////////////   APPOINTMENT BOOKING MODULE   ////////////////////

///// Utility function to extract token //////
function extractToken(req) {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(' ')[0] === 'Bearer'
  ) {
    return req.headers.authorization.split(' ')[1];
  } else if (req.body && req.body.token) {
    return req.body.token;
  }
  return null;
}

///////////   Appointment Booking   ///////////
router.post('/', (req, res) => {
  const token = extractToken(req);
  if (token === null) {
    return res.status(401).json({
      message: 'JWT required',
    });
  }
  const userInfo = jwt.verify(token, process.env.JWT_SECRET);
  let patientId = '';
  // Extracting Patient ID from payload of the token
  if (userInfo.userType === 'patient') {
    patientId = userInfo.id;
  }
  Appointment.find({ time: req.body.time })
    .exec()
    .then((appointment) => {
      // If appointment exists
      if (appointment.length >= 1) {
        return res.status(409).json({
          message: `Appointment already booked at: ${req.body.time}`,
        });
      } else {
        const appointment = new Appointment({
          _id: new mongoose.Types.ObjectId(),
          doctorId: new mongoose.Types.ObjectId(),
          patientId,
          time: req.body.time,
          status: 'pending',
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
              error: err,
            });
          });
      }
    });
});

module.exports = router;
