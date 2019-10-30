/**
 * this file contains all routes for the students api
 * This file uses the Router object approach.
 */

// the following line is just a short cut for
// const express = require("express");
// const router = express.Router();
const studentsRouter = require("express").Router();

// data
var students = [
    {
        id: 0,
        name: "Mahmoud Youssef",
        courses: ["Physics 2", "Math 3"]
    },
    {
        id: 1,
        name: "Mohammed Hassan",
        courses: ["Software engineering", "CO"]
    },
    {
        id: 2,
        name: "Hossam Mahmoud",
        courses: ["Distribution", "Power Electronics"]
    },
];

/**
 * this function returns all student data
 * @params none
 * @body none
 */
studentsRouter.get('/', (req, res) => {
    res.send(students);
});

/**
 * this function returns a single student given an ID
 * @params id: number
 * @body none
 */
studentsRouter.get("/:id", (req, res) => {
    const student = students.find(s => s.id === parseInt(req.params.id));
    if (!student) return res.status(404).send("Student of ID = " + req.params.id + " does not exist!");
    res.send(student);
});

/**
 * this function adds a new student
 * @params none
 * @body student data
 */
studentsRouter.post("/", (req, res) => {
    const schema = {
        name: Joi.string().min(3).required(),
        courses: Joi.array().min(2).required()
    };

    const result = Joi.validate(req.body, schema);
    if (result.error)
        return res.status(400).send(result.error.details[0].message);

    var obj = { id: students.length, ...req.body };
    students.push(obj);
    res.send("Student added successfully!");
});

/**
 * this function updates an existing student given his ID
 * @params id
 * @body new student data
 */
studentsRouter.put("/:id", (req, res) => {
    const student = students.find(s => s.id === parseInt(req.params.id));
    if (!student) return res.status(404).send("Student of ID = " + req.params.id + " does not exist!");

    const schema = {
        name: Joi.string().required().min(3),
        courses: Joi.array().min(2).required()
    };

    const result = Joi.validate(req.body, schema);
    if (result.error)
        return res.status(400).send(result.error.details[0].message);

    var idx = students.indexOf(student);
    students[idx] = { id: students[idx].id, ...req.body };
    res.send("Student updated successfully!");
});

/**
 * this function deletes a student given his ID
 * @params id
 * @body none
 */
studentsRouter.delete("/:id", (req, res) => {
    const student = students.find(s => s.id === parseInt(req.params.id));
    if (!student) return res.status(404).send("Student of ID = " + req.params.id + " does not exist!");

    const idx = students.indexOf(student);
    students.splice(idx, 1);
    res.send("Student deleted successfully!")
});

// now export the router object so we can require it in the index file.
module.exports = studentsRouter;
