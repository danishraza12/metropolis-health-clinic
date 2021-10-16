const express = require('express');
const morgan = require('morgan');
const app = express();
//const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Adding routes
const userRoutes = require('./api/routes/users');
const appointmentRoutes = require('./api/routes/appointments');
const treatmentRoutes = require('./api/routes/treatment');

dotenv.config({ path: './config.env' });

//Middleware to access data sent to req
app.use(express.json());
app.use(morgan('dev'));

// Connecting to the database by using connection link from heroku or local environment variable
mongoose
  .connect(process.env.MONGODB_URI || process.env.CONNECTION_MONGODB_URI_2_2VER)
  .then(() => console.log('Database connected!'))
  .catch((err) => console.log(err));

// Forward requests to their respective route handlers
app.use('/users', userRoutes);
app.use('/appointments', appointmentRoutes);
app.use('/treatment', treatmentRoutes);

// Creating CORS headers to prevent CORS Error
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'),
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    // return as 'OPTIONS' is only used to check the available options
    return res.status(200).json({});
  }
  next();
});

/* These middlewares are for error handling, any request which 
   cannot be handled by above route handlers is handled here */
app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
