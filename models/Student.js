const mongoose = require ('mongoose');
const Joi = require ('joi');

const Student = mongoose.model (
  'Student',
  new mongoose.Schema ({
    name: {type: String, required: true},
    courses: {type: [String], required: true},
  })
);

function studentError (data) {
  const schema = {
    name: Joi.string ().min (3).required (),
    courses: Joi.array ().items (Joi.string ()).min (2).required (),
  };

  const result = Joi.validate (
    {name: data.name, courses: data.courses},
    schema
  );
  if (result.error) return result.error.details[0].message;
  else return false;
}

exports.Student = Student;
exports.studentError = studentError;
