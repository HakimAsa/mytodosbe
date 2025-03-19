const express = require('express')

const { ep } = require('../utils/Endpoints')
const {
  glb: { doSetForwardSlash: dsf },
} = require('../utils/Globals')
const auth = require('../middleware/auth')
const { addNoteToTask } = require('../controllers/note.controllers')
const validateObjectId = require('../middleware/validateObjectId')

const router = express.Router()

// Routes
router.post(dsf(ep.TODOID, ep.CONSID), validateObjectId, auth, addNoteToTask)
module.exports = router
