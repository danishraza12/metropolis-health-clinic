const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

//////////////////   USER REGISTRATION MODULE   ///////////////////

router.post('/signup', (req, res) => {
  // Checking if mail already exists in the database
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: 'Email already exists',
        });
      } else {
        // SALTING password before saving
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err,
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash,
              userType: req.body.userType,
            });
            user
              .save()
              .then((result) => {
                const token = jwt.sign(
                  {
                    email: req.body.email,
                    status: true,
                  },
                  process.env.JWT_SECRET,
                  {
                    expiresIn: 60 * 30, // Expires in 30 minutes
                  }
                );
                res.status(201).json({
                  message: 'Registered Successfully',
                  token,
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
      }
    });
});

router.post('/activate', async (req, res) => {
  try {
    const userInfo = jwt.verify(req.body.token, process.env.JWT_SECRET);
    if (userInfo.email === req.body.email) {
      User.find({ email: req.body.email })
        .exec()
        .then(async (user) => {
          if (user.length < 1) {
            return res.status(401).json({
              message: 'Auth failed',
            });
          }
          // update user status is the database
          try {
            const email = user[0].email;
            const updated = await User.findOneAndUpdate(
              { email },
              { status: true },
              { new: true }
            );
            return res.status(200).json({
              message: 'Activation Succesful',
              status: updated.status,
            });
          } catch (err) {
            return res.status(500).json({
              message: err.message,
            });
          }
        })
        .catch((err) => {
          console.log(err);
          return res.status(500).json({
            message: err.message,
          });
        });
    } else {
      return res.status(401).json({
        message: 'Auth failed',
      });
    }
  } catch (error) {
    return res.status(401).json({
      message: 'Auth failed',
    });
  }
});

///////////////////   USER AUTHENTICATION MODULE   ////////////////////

router.post('/login', (req, res) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return res.status(401).json({
          message: 'Authentication failed',
        });
      }
      // Checking if the status of the user is true
      if (user[0].status === true) {
        // checking if entered password is equal to SALTED password
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
          if (err) {
            // for server side error, not password error
            return res.status(401).json({
              message: 'Authentication failed',
            });
          }
          if (result) {
            const token = jwt.sign(
              {
                id: user[0]._id,
                username: user[0].email,
                userType: user[0].userType,
              },
              process.env.JWT_SECRET
            );
            return res.status(200).json({
              message: 'Authentication successful',
              token: token,
            });
          } else {
            // incorrect password entered, not sending extra info to prevent brute force attacks
            return res.status(401).json({
              message: 'Authentication failed',
            });
          }
        });
      } else {
        res.status(401).json({
          message: 'Auth failed',
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.delete('/:userId', (req, res) => {
  User.remove({ _id: req.params.userId })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: 'User deleted',
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
