const asyncHandler = require('express-async-handler')
const config = require('config')
const bcrypt = require('bcryptjs')

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
  console.log(user)
  sendTokenResponse(user, 201, res)
})

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.generateAuthToken()
  const exp = Date.now() + config.get('jwtCookieExpire') * 24 * 60 * 60 * 1000
  const options = {
    expires: new Date(exp),
    httpOnly: true,
  }

  if (process.env.NODE_ENV === 'production') {
    options.secure = true
  }

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token_type: 'Bearer',
    message: 'successfully authenticated',
    token,
    _id: user._id,
    expiresIn: exp,
  })
}

module.exports = { registerUser }
