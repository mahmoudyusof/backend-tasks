"use strict";

// importing modules
const express = require("express");
const mongoose = require("mongoose");
const Joi = require("joi");

// creating app and configuring middlewares
const app = express();
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/playground", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true})
    .then(() => console.log("Connected to mongo DataBase"))
    .catch(err => console.log(err));



const studentsSchema = new mongoose.Schema({
    name: String,
    courses: [ String ]
});

const Student = mongoose.model('Student', studentsSchema);

// // database data equivalent
// var students = [
//     {
//         id: 0,
//         name: "Mahmoud Youssef",
//         courses: ["Physics 2", "Math 3"]
//     },
//     {
//         id: 1,
//         name: "Mohammed Hassan",
//         courses: ["Software engineering", "CO"]
//     },
//     {
//         id: 2,
//         name: "Hossam Mahmoud",
//         courses: ["Distribution", "Power Electronics"]
//     },
// ];

/**
 * this function returns all student data
 * @params none
 * @body none
 */
app.get('/api/students', async (req, res) => {
    const students = await Student.find();
    res.send(students);
});

/**
 * this function returns a single student given an ID
 * @params id: number
 * @body none
 */
app.get("/api/students/:id", async (req, res) => {
    try{
        const student = await Student.findById(req.params.id);
        if(student === null){
            return res.status(404).send("Student with ID = \"" + req.params.id + "\" does not exist!");
        }
        res.send(student);
    }catch(err){
        return res.status(400).send("Bad Request");
    }
    // if (!student) return res.status(404).send("Student of ID = " + req.params.id + " does not exist!");
    
});

/**
 * this function adds a new student
 * @params none
 * @body student data
 */
app.post("/api/students", async (req, res) => {
    const schema = {
        name: Joi.string().min(3).required(),
        courses: Joi.array().min(2).required()
    };

    const result = Joi.validate(req.body, schema);
    if (result.error)
        return res.status(400).send(result.error.details[0].message);

    let student = new Student(req.body);
    await student.save();
    res.send("Student added successfully!");
});

/**
 * this function updates an existing student given his ID
 * @params id
 * @body new student data
 */
app.put("/api/students/:id", async (req, res) => {
    // const student = students.find(s => s.id === parseInt(req.params.id));
    // if (!student) return res.status(404).send("Student of ID = " + req.params.id + " does not exist!");

    const schema = {
        name: Joi.string().required().min(3),
        courses: Joi.array().min(2).required()
    };

    const result = Joi.validate(req.body, schema);
    if (result.error)
        return res.status(400).send(result.error.details[0].message);
    try{
        const student = await Student.findByIdAndUpdate(req.params.id, req.body);
        if(student === null){
            return res.status(404).send("Student of ID = " + req.params.id + " does not exist!");
        }
        res.send("Student updated successfully!");
    }catch(error){
        return res.status(400).send("Bad request");
    }
    // var idx = students.indexOf(student);
    // students[idx] = {id: students[idx].id, ...req.body};
});

/**
 * this function deletes a student given his ID
 * @params id
 * @body none
 */
app.delete("/api/students/:id", async (req, res) => {
    try{
        const student = await Student.findByIdAndDelete(req.params.id);
        if(student === null){
            return res.status(404).send("Student of ID = " + req.params.id + " does not exist!");
        }else{
            res.send("Student deleted successfully!")
        }
    }catch(err){
        return res.status(400).send("Bad request!");
    }
});

// now it's time to listen to some port
// I mean, what's the point of creating endpoints if they don't listen
// rights ??
app.listen(8000, () => console.log("Listening on localhost:8000"));
