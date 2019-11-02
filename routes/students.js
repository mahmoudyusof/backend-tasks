const Joi = require("joi");
const studentsRouter = require("express").Router();

const mongoose = require("mongoose");

const studentsSchema = new mongoose.Schema({
    name: String,
    courses: [String],
});

const Student = mongoose.model('Student', studentsSchema);

/**
 * this function returns all student data
 * @params none
 * @body none
 */
studentsRouter.get('/', async (req, res) => {
    const students = await Student.find();
    res.render('index', {students});
});

/**
 * this function returns a single student given an ID
 * @params id: number
 * @body none
 */
studentsRouter.get("/:id", async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (student === null) {
            return res.status(404).send("Student with ID = \"" + req.params.id + "\" does not exist!");
        }
        res.send(student);
    } catch (err) {
        return res.status(400).send("Bad Request");
    }
    // if (!student) return res.status(404).send("Student of ID = " + req.params.id + " does not exist!");

});

/**
 * this function adds a new student
 * @params none
 * @body student data
 */
studentsRouter.post("/", async (req, res) => {
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
studentsRouter.put("/:id", async (req, res) => {
    // const student = students.find(s => s.id === parseInt(req.params.id));
    // if (!student) return res.status(404).send("Student of ID = " + req.params.id + " does not exist!");

    const schema = {
        name: Joi.string().required().min(3),
        courses: Joi.array().min(2).required()
    };

    const result = Joi.validate(req.body, schema);
    if (result.error)
        return res.status(400).send(result.error.details[0].message);
    try {
        const student = await Student.findByIdAndUpdate(req.params.id, req.body);
        if (student === null) {
            return res.status(404).send("Student of ID = " + req.params.id + " does not exist!");
        }
        res.send("Student updated successfully!");
    } catch (error) {
        return res.status(400).send("Bad request");
    }
});

/**
 * this function deletes a student given his ID
 * @params id
 * @body none
 */
studentsRouter.delete("/:id", async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);
        if (student === null) {
            return res.status(404).send("Student of ID = " + req.params.id + " does not exist!");
        } else {
            res.send("Student deleted successfully!")
        }
    } catch (err) {
        return res.status(400).send("Bad request!");
    }
});

module.exports = studentsRouter;
