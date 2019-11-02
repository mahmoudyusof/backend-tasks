"use strict";

// importing modules
const express = require("express");
const mongoose = require("mongoose");
const studentsRouter = require("./routes/students.js");
const config = require("config");

// connecting to database
mongoose.connect(config.get('db_connection_string'), { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true })
    .then(() => console.log("Connected to mongo DataBase"))
    .catch(err => console.log(err));


// creating app
const app = express();

// setting properties
app.set('view engine', 'pug');
app.set('views', './views') // default

// using middlewares
app.use(express.json());


// using routers
app.use('/api/students', studentsRouter);


// now it's time to listen to some port
// I mean, what's the point of creating endpoints if they don't listen
// rights ??
app.listen(8000, () => console.log("Listening on http://localhost:8000"));
