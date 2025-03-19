const express = require('express')

const {
  glb: { doSetForwardSlash: dsf },
} = require('../utils/Globals')
const { ep } = require('../utils/Endpoints')
const {
  registerUser,
  authUser,
  logout,
} = require('../controllers/auth.controllers')
const auth = require('../middleware/auth')

const router = express.Router()

// Routes
router.post(dsf(ep.LOGIN), authUser)
router.post(dsf(ep.LOGOUT), auth, logout)
router.post(dsf(ep.REGISTER), registerUser)

module.exports = router
