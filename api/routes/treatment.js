const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const Treatment = require('../models/treatment');
const Appointment = require('../models/appointment');

///////////////////   TREATMENT MODULE   ////////////////////

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

///// Treatment Module /////

// router.post('/', async (req, res) => {
//   const token = extractToken(req);
//   if (token === null) {
//     return res.status(401).json({
//       message: 'JWT required',
//     });
//   }
//   const userInfo = jwt.verify(token, process.env.JWT_SECRET);
//   if (userInfo.userType == 'doctor') {
//     console.log(req.body.appointmentId);
//     Appointment.find({ _id: req.body.appointmentId })
//       .exec()
//       .then(async (appointment) => {
//         if (appointment.length < 1) {
//           return res.status(401).json({
//             message: 'Treatment prescription failed',
//           });
//         } else {
//           return res.status(200).json({
//             appointment,
//           });
//         }
//       })
//       .catch((err) => {
//         console.log(err);
//         return res.status(500).json({
//           error: err,
//         });
//       });
//   }
// });

router.post('/', async (req, res) => {
  const token = extractToken(req);
  if (token === null) {
    return res.status(401).json({
      message: 'JWT required',
    });
  }
  const userInfo = jwt.verify(token, process.env.JWT_SECRET);
  if (userInfo.userType == 'doctor') {
    console.log(req.body.appointmentId);
    Appointment.find({ _id: req.body.appointmentId })
      .exec()
      .then(async (appointment) => {
        if (appointment.length < 1) {
          return res.status(401).json({
            message: 'Treatment prescription failed',
          });
        }
        try {
          // update status of the appointment
          const updatedAppointment = await Appointment.findOneAndUpdate(
            { _id: appointment[0]._id },
            { status: 'Prescribed' },
            { new: true }
          );
          const treatment = new Treatment({
            _id: new mongoose.Types.ObjectId(),
            appointmentId: req.body.appointmentId,
            treatment: req.body.treatment,
          });
          treatment
            .save()
            .then((result) => {
              return res.status(200).json({
                message: 'Treatment prescribed successfully',
                appointmentId: result.appointmentId,
                treatment: result.treatment,
                appointmentStatus: updatedAppointment.status,
              });
            })
            .catch((err) => {
              console.log(err);
              return res.status(500).json({
                error: err,
              });
            });
        } catch (err) {
          return res.status(500).json({
            error: 'Try/Catch error',
            message: err.message,
          });
        }
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json({
          error: err,
        });
      });
  }
});

module.exports = router;
