"use strict";

// importing modules
const express = require("express");
const Joi = require("joi");

// creating app and configuring middlewares
const app = express();
app.use(express.json());

// -----------------IMPORTING ROUTES-----------------
// functional approach
const coursesRoutes = require("./routes/courses.js");
coursesRoutes(app);
// router object approach
const studentsRouter = require("./routes/students.js");
app.use("/api/students", studentsRouter);



// NOW THE INDEX FILE IS SO CLEAN AND NICE.



// now it's time to listen to some port
// I mean, what's the point of creating endpoints if they don't listen
// rights ??
app.listen(8000, () => console.log("Listening on localhost:8000"));
