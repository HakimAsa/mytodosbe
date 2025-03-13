const Joi = require('joi')
const mongoose = require('mongoose')
const { glb } = require('../utils/Globals')
const { COL } = require('../utils/Collections')

const Schema = mongoose.Schema

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
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

    role: {
      type: String,
      enum: ['user', 'admin', 'premium'],
      default: 'user',
    },
    language: {
      type: String,
      enum: ['en', 'fr'], //'es', 'de', 'it', 'pt'
      default: 'en',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, setters: true },
    toObject: { virtuals: true, setters: true },
  }
)

const User = mongoose.model(glb.capitalizeFirstLetter(COL.USER), userSchema)
function validateUser(user, isRequired) {
  const schema = Joi.object({
    username: isRequired
      ? Joi.string().min(5).max(50).required()
      : Joi.string().min(5).max(50),
    email: Joi.string().min(5).max(255).email().required(),
    passowrd: Joi.string().min(5).max(255).required(),
    role: Joi.string().valid('user', 'admin', 'premium'),
    language: Joi.string().valid('en', 'fr'), //'es', 'de', 'it', 'pt'
  })

  return schema.validate(user)
}

exports.User = User
exports.validate = validateUser
