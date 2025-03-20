const express = require('express')

const { ep } = require('../utils/Endpoints')
const {
  glb: { doSetForwardSlash: dsf },
} = require('../utils/Globals')
const auth = require('../middleware/auth')
const {
  addNoteToTask,
  getSubNotes,
} = require('../controllers/note.controllers')
const validateObjectId = require('../middleware/validateObjectId')

const router = express.Router()

// Routes
router.post(dsf(ep.TODOID, ep.CONSID), validateObjectId, auth, addNoteToTask)
router.get(dsf(ep.NOTEID, ep.SUBNOTES), validateObjectId, auth, getSubNotes)
module.exports = router
