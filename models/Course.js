const mongoose = require ('mongoose');
const Joi = require ('joi');

const Course = mongoose.model (
  'Course',
  new mongoose.Schema ({
    name: {type: String, required: true},
    applicants: {type: Number, default: 0},
  })
);

function courseError (data) {
  const schema = {
    name: Joi.string ().min (3).required (),
  };

  const result = Joi.validate ({name: data.name}, schema);
  if (result.error) return result.error.details[0].message;
  else return false;
}

exports.Course = Course;
exports.courseError = courseError;
