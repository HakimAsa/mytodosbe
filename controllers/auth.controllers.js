const asyncHandler = require('express-async-handler')
const config = require('config')
const bcrypt = require('bcryptjs')
const Joi = require('joi')

const { User, validate } = require('../models/user.models')

// @desc register a user
// @route POST /api/v1/auth/register
// @access Public
const registerUser = asyncHandler(async (req, res) => {
  const {
    username,
    firstname,
    lastname,
    email,
    password,
    language,
    confirmpassword,
  } = req.body

  // validate request body
  const { error } = validate(req.body, true)
  if (error)
    return res
      .status(400)
      .send({ success: false, message: error.details[0].message })

  // check if password and confirm password match
  if (password !== confirmpassword) {
    return res.status(400).send({
      success: false,
      message:
        language === 'fr'
          ? 'Mots de passe incompatibles'
          : 'Passwords do not match.',
    })
  }
  // check if email or username already exists
  const existingUser = await User.findOne({ $or: [{ email }, { username }] })

  if (existingUser) {
    const emailMessage =
      existingUser.language === 'en'
        ? 'Email already exists.'
        : `L'e-mail existe déjà.`
    const usernameMessage =
      existingUser.language === 'en'
        ? 'Username already exists.'
        : `Le nom d'utilisateur existe déjà.`
    if (existingUser.email === email)
      return res.status(400).send({ success: false, message: emailMessage })
    if (existingUser.username === username)
      return res.status(400).send({ success: false, message: usernameMessage })
  }

  // hashing the password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  // create user
  const user = new User({
    firstname,
    lastname,
    username,
    email,
    password: hashedPassword,
    language,
    confirmpassword: hashedPassword,
  })

  await user.save()
  sendTokenResponse(user, 201, res)
})

// @desc login a user
// @route POST /api/v1/auth/login
// @access Public
const authUser = asyncHandler(async (req, res) => {
  // validate request body
  const { error } = validateOnLogin(req.body)
  if (error)
    return res
      .status(400)
      .send({ success: false, message: error.details[0].message })

  const { email, password, username } = req.body
  // check if user exists and password matches
  const orQuery = []
  if (email) orQuery.push({ email })
  if (username) orQuery.push({ username })

  const user = await User.findOne({ $or: orQuery }).select('+password language')
  if (!user || !(await user.matchPassword(password))) {
    const message =
      user?.language === 'fr'
        ? `Informations d'identification invalides`
        : 'Invalid credentials'
    return res.status(400).send({ success: false, message })
  }
  // send token response
  sendTokenResponse(user, 200, res)
})

// @desc   Logout user and clear cookie
// @route  GET /api/v1/auth/logout
// @access Private
const logout = asyncHandler(async (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0), // Immediately expires the cookie
    secure: process.env.NODE_ENV === 'production', // Ensures secure cookies in production
    sameSite: 'Strict', // Helps prevent CSRF attacks
  })

  const message =
    req.user.language === 'fr'
      ? 'Déconnexion réussie'
      : 'Logged out successfully'

  res.status(200).json({ success: true, message })
})

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.generateAuthToken()
  const exp = Date.now() + config.get('jwtCookieExpire') * 24 * 60 * 60 * 1000
  const options = {
    expires: new Date(exp),
    httpOnly: true,
    sameSite: 'Strict', // Helps prevent CSRF attacks
  }

  if (process.env.NODE_ENV === 'production') {
    options.secure = true
  }

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token_type: 'Bearer',
    message: 'successfully authenticated',
    token,
    expiresIn: exp,
  })
}

function validateOnLogin(req) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).email(),
    username: Joi.string().min(3).max(30),
    password: Joi.string().min(5).max(30).required(), //min password = 8
  }).or('username', 'email')
  return schema.validate(req)
}

module.exports = { authUser, logout, registerUser }
