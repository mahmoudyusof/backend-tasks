/**
 * this file contains all routes for the students api
 * This file uses the Router object approach.
 */

// the following line is just a short cut for
// const express = require("express");
// const router = express.Router();
const studentsRouter = require("express").Router();
const Joi = require("joi");

const mongoose = require("mongoose");

const studentSchema = mongoose.Schema({
    name: {type: String, required: true},
    courses: {type: [String], required: true}
});

const Student = mongoose.model('Student', studentSchema);


// ====================     GENERAL NOTE    ====================
// note the async keyword before every callback


/**
 * this function returns all student data
 * @params none
 * @body none
 */
studentsRouter.get('/', async (req, res) => {
    try{
        let students = await Student.find();
        res.send(students);
    }catch(err){
        console.log(err.message);
        return res.status(500).send("Something went wrong!");
    }
});


// =================    NOTE THIS SECTION   =================

// the second function in the section was commented out
// because it would clash with the first one
// since both of them listen to GET /api/students/:variable

/**
 * This function implements pagenation where each page contains two students
 * @params page_number
 * @body none
 */
studentsRouter.get("/:page_num", async (req, res) => {
    try{
        const pn = req.params.page_num;
        const students = await Student.find().skip(2*(pn-1)).limit(2);
        if(students && students.length){
            res.send(students);
        }else{
            return res.status(400).send("Page Out of range, rhyme intended :V");
        }
    }catch(err){
        console.log(err.message);
        return res.status(500).send("Something went wrong");
    }
});


/**
 * this function returns a single student given an ID
 * @params id: number
 * @body none
 */
// studentsRouter.get("/:id", async (req, res) => {
//     try{
//         const student = await Student.findById(req.params.id);
//         if (!student) return res.status(404).send("Student of ID = " + req.params.id + " does not exist!");
//         res.send(student);
//     }catch(err){
//         console.log(err.message);
//         return res.status(500).send("Something went wrong");
//     }
// });


// =================    END NOTE    =================


/**
 * this function adds a new student
 * @params none
 * @body student data
 */
studentsRouter.post("/", async (req, res) => {
    const schema = {
        name: Joi.string().min(3).required(),
        courses: Joi.array().items(Joi.string()).min(2).required()
    };

    const result = Joi.validate(req.body, schema);
    if (result.error)
        return res.status(400).send(result.error.details[0].message);

    try{
        let student = new Student(req.body);
        await student.save();
        res.send("Student added successfully!");
    }catch(err){
        console.log(err.message);
        return res.status(500).send("Something went wrong");
    }
});

/**
 * this function updates an existing student given his ID
 * @params id
 * @body new student data
 */
studentsRouter.put("/:id", async (req, res) => {

    const schema = {
        name: Joi.string().required().min(3),
        courses: Joi.array().items(Joi.string()).min(2).required()
    };
    console.log(req.body);

    const result = Joi.validate(req.body, schema);
    if (result.error)
        return res.status(400).send(result.error.details[0].message);

    try{
        const student = await Student.findByIdAndUpdate(req.params.id, req.body);
        if(!student) return res.status(404).send("Student of ID = " + req.params.id + " does not exist!");
        res.send("Student updated successfully!");
    }catch(err){
        console.log(err.message);
        return res.status(500).send("Something went wrong");
    }
});

/**
 * this function deletes a student given his ID
 * @params id
 * @body none
 */
studentsRouter.delete("/:id", async (req, res) => {
    try{
        const student = await Student.findByIdAndDelete(req.params.id);
        if (!student) return res.status(404).send("Student of ID = " + req.params.id + " does not exist!");
        res.send("Student deleted successfully!")
    }catch(err){
        console.log(err.message);
        return res.status(500).send("Something went wrong");
    }
});

// now export the router object so we can require it in the index file.
module.exports = studentsRouter;
