const Joi = require('joi')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const config = require('config')

const { glb } = require('../utils/Globals')
const { COL } = require('../utils/Collections')

const Schema = mongoose.Schema

const userSchema = new Schema(
  {
    firstname: String,
    lastname: String,
    dateofbirth: Date,
    address: {
      additionalinformation: String,
      city: String,
      country: String,
      district: String,
      postalCode: String,
      housenumber: String,
      isocountrycode: String,
      latitude: String,
      longitude: String,
      street: String,
    },
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      sparse: true,
      minlength: 3,
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
    confirmpassword: {
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
    resetpasswordtoken: String,
    resetpasswordexpire: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, setters: true },
    toObject: { virtuals: true, setters: true },
  }
)
userSchema.createIndex({ username: 1 }, { unique: true })

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, role: this.role, language: this.language },
    config.get('jwtPrivateKey'),
    { expiresIn: config.get('jwtExpiresIn') }
  )
  return token
}

//Match user entered password with the hashed password in db
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.passowrd)
}

const User = mongoose.model(glb.capitalizeFirstLetter(COL.USER), userSchema)
function validateUser(user, isRequired) {
  const schema = Joi.object({
    firstname: isRequired
      ? Joi.string().min(2).max(50)
      : Joi.string().min(2).max(50),
    lastname: isRequired
      ? Joi.string().min(2).max(50)
      : Joi.string().min(2).max(50),
    dateofbirth: Joi.date(),
    address: Joi.object({
      additionalinformation: Joi.string(),
      city: Joi.string(),
      country: Joi.string(),
      district: Joi.string(),
      postalCode: Joi.string(),
      housenumber: Joi.string(),
      isocountrycode: Joi.string(),
      latitude: Joi.string(),
      longitude: Joi.string(),
      street: Joi.string(),
    }),
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
