const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');

const { COL } = require('../utils/Collections');
const { glb } = require('../utils/Globals');

const Schema = mongoose.Schema;

const todoSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
      maxlength: 4000,
    },
    status: {
      type: String,
      enum: ['suspended', 'finish', 'waiting', 'plan', 'new', 'working'],
      default: 'new',
    },
    note: {
      type: String,
      maxlength: 250,
    },
    enddate: Date,
    startdate: Date,
    duration: String,
    durationmin: String,
    // owner: {
    //     type: Schema.Types.ObjectId,
    //     ref: glb.capitalizeFirstLetter(COL.USER)
    // }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, setters: true },
    toObject: { virtuals: true, setters: true },
  }
);

const Todo = mongoose.model(glb.capitalizeFirstLetter(COL.TODO), todoSchema);

function validateTodo(todo, isRequired = true) {
  const schema = Joi.object({
    text: isRequired ? Joi.string().min(5).max(2000).required() : Joi.string().min(5).max(2000),
    note: Joi.string().min(2).max(2000),
    status: Joi.string().valid('suspended', 'finish', 'waiting', 'plan', 'new', 'working'),
    startdate: Joi.date(),
    enddate: Joi.date(),
    duration: Joi.string(),
  });

  return schema.validate(todo);
}

exports.Todo = Todo;
exports.validate = validateTodo;
