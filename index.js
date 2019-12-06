'use strict';

// importing modules
const express = require ('express');
const mongoose = require ('mongoose');

mongoose
  .connect ('mongodb://localhost/playground', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then (() => console.log ('Connected to database....'))
  .catch (err => console.log (err));

// creating app and configuring middlewares
const app = express ();
app.use (express.json ());

// -----------------IMPORTING ROUTES-----------------
// functional approach
// this doesn't have database integration
const coursesRouter = require ('./routes/courses.js');
app.use ('/api/courses', coursesRouter);

// router object approach
// this has database integration
const studentsRouter = require ('./routes/students.js');
app.use ('/api/students', studentsRouter);

// NOW THE INDEX FILE IS SO CLEAN AND NICE.

// now it's time to listen to some port
// I mean, what's the point of creating endpoints if they don't listen
// rights ??
app.listen (8000, () => console.log ('Listening on localhost:8000'));
