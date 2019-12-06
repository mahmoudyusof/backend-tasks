/**
 * this file contains all routes for the course api
 * This file uses the Router object approach.
 */

// the following line is just a short cut for
// const express = require("express");
// const router = express.Router();
const courseRouter = require ('express').Router ();
const Joi = require ('joi');
const {Course, courseError} = require ('../models/Course');

// ====================     GENERAL NOTE    ====================
// note the async keyword before every callback

/**
 * this function returns all course data
 * @params none
 * @body none
 */
courseRouter.get ('/', async (req, res) => {
  try {
    let course = await Course.find ();
    res.send (course);
  } catch (err) {
    console.log (err.message);
    return res.status (500).send ('Something went wrong!');
  }
});

// =================    NOTE THIS SECTION   =================

// the second function in the section was commented out
// because it would clash with the first one
// since both of them listen to GET /api/course/:variable

/**
 * This function implements pagenation where each page contains two course
 * @params page_number
 * @body none
 */
courseRouter.get ('/:page_num', async (req, res) => {
  try {
    const pn = req.params.page_num;
    const course = await Course.find ().skip (2 * (pn - 1)).limit (2);
    if (course && course.length) {
      res.send (course);
    } else {
      return res.status (400).send ('Page Out of range, rhyme intended :V');
    }
  } catch (err) {
    console.log (err.message);
    return res.status (500).send ('Something went wrong');
  }
});

/**
 * this function returns a single course given an ID
 * @params id: number
 * @body none
 */
// courseRouter.get("/:id", async (req, res) => {
//     try{
//         const course = await Course.findById(req.params.id);
//         if (!course) return res.status(404).send("Course of ID = " + req.params.id + " does not exist!");
//         res.send(course);
//     }catch(err){
//         console.log(err.message);
//         return res.status(500).send("Something went wrong");
//     }
// });

// =================    END NOTE    =================

/**
 * this function adds a new course
 * @params none
 * @body course data
 */
courseRouter.post ('/', async (req, res) => {
  let err = courseError ({
    name: req.body.name,
    courses: req.body.courses,
  });
  if (err) return res.status (400).send (err);

  try {
    let course = new Course ({name: req.body.name});
    await course.save ();
    res.send ('Course added successfully!');
  } catch (err) {
    console.log (err.message);
    return res.status (500).send ('Something went wrong');
  }
});

/**
 * this function updates an existing course given his ID
 * @params id
 * @body new course data
 */
courseRouter.put ('/:id', async (req, res) => {
  let err = courseError ({
    name: req.body.name,
    courses: req.body.courses,
  });
  if (err) return res.status (400).send (err);

  try {
    const course = await Course.findByIdAndUpdate (req.params.id, {
      name: req.body.name,
    });
    if (!course)
      return res
        .status (404)
        .send ('Course of ID = ' + req.params.id + ' does not exist!');
    res.send ('Course updated successfully!');
  } catch (err) {
    console.log (err.message);
    return res.status (500).send ('Something went wrong');
  }
});

/**
 * this function deletes a course given his ID
 * @params id
 * @body none
 */
courseRouter.delete ('/:id', async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete (req.params.id);
    if (!course)
      return res
        .status (404)
        .send ('Course of ID = ' + req.params.id + ' does not exist!');
    res.send ('Course deleted successfully!');
  } catch (err) {
    console.log (err.message);
    return res.status (500).send ('Something went wrong');
  }
});

// now export the router object so we can require it in the index file.
module.exports = courseRouter;
