const Joi = require('joi');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    index: true,
    trim: true,
    sparse: true,
    minlength: 5,
    maxlength: 255,
  },
  passowrd: {
    type: String,
  },

  isadmin: {
    type: Boolean,
    default: false,
  },
});
