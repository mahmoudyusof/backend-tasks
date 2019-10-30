/**
 * this file contains all routes for the courses api
 * This file uses the function approach.
 */

// import modules
const Joi = require("joi");

// data
let courses = [
    {id: 0, name: "CO"},
    {id: 1, name: "Data Structure"},
    {id: 2, name: "Algorithms"},
    {id: 3, name: "Neural networks"},
    {id: 4, name: "Operating systems"},
];

// routes

/**
 * this function will be called with the app parameter to define all the routes in it
 * @params app object
 * @return none
 */
function coursesRoutes(app){

    /**
     * this function returns all student data
     * @params none
     * @body none
     */
    app.get("/api/courses", (req, res) => {
        res.send(courses);
    });

    /**
     * this function returns a single student given an ID
     * @params id: number
     * @body none
     */
    app.get("/api/courses/:id", (req, res) => {
        const course = courses.find(c => c.id === parseInt(req.params.id));
        if(!course) return res.status(404).send(`Course of ID ${req.params.id} does not exist`);
        res.send(course);
    });

    /**
     * this function adds a new student
     * @params none
     * @body student data
     */
    app.post("/api/courses", (req, res) => {
        const schema = {
            name: Joi.string().min(3).required()
        };
    
        const result = Joi.validate(req.body, schema);
        if (result.error)
            return res.status(400).send(result.error.details[0].message);
        
        // NOTE: ID is automatically generated so don't worry about it
        var obj = { id: courses.length, ...req.body };
        courses.push(obj);
        res.send("Course added successfully!");
    });

    /**
     * this function updates an existing course given his ID
     * @params id
     * @body new student data
     */
    app.put("/api/courses/:id", (req, res) => {
        const course = courses.find(s => s.id === parseInt(req.params.id));
        if (!course) return res.status(404).send("course of ID = " + req.params.id + " does not exist!");

        const schema = {
            name: Joi.string().required().min(3),
        };

        const result = Joi.validate(req.body, schema);
        if (result.error)
            return res.status(400).send(result.error.details[0].message);

        var idx = courses.indexOf(course);
        courses[idx] = { id: courses[idx].id, ...req.body };
        res.send("Course updated successfully!");
    });

    /**
     * this function deletes a course given his ID
     * @params id
     * @body none
     */
    app.delete("/api/courses/:id", (req, res) => {
        const course = courses.find(s => s.id === parseInt(req.params.id));
        if (!course) return res.status(404).send("course of ID = " + req.params.id + " does not exist!");

        const idx = courses.indexOf(course);
        courses.splice(idx, 1);
        res.send("course deleted successfully!")
    });
}

// now we need to export the function in order to require it in the index file
module.exports = coursesRoutes;
