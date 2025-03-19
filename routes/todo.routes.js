const express = require('express')

const {
  getMyTodos,
  createTodo,
  getTodoById,
  deleteTodo,
  updateTodo,
  patchTodo,
  addAssignee,
  removeAssignee,
} = require('../controllers/todo.controllers')
const validateObjectId = require('../middleware/validateObjectId')
const { SYMBOLS } = require('../utils/Constants')
const { ep } = require('../utils/Endpoints')
const {
  glb: { doSetForwardSlash: dsf },
} = require('../utils/Globals')
const auth = require('../middleware/auth')
const role = require('../middleware/role')

const router = express.Router()

router.route(dsf(ep.MYTODOS)).get(auth, getMyTodos)
router
  .route(dsf(ep.CONSID))
  .get(validateObjectId, auth, getTodoById)
  .patch(validateObjectId, patchTodo)
  .put(validateObjectId, auth, updateTodo)
  .delete(validateObjectId, auth, role(['admin']), deleteTodo)
router.put(dsf(ep.CONSID, ep.ADDASSIGNEE), validateObjectId, addAssignee)
router.put(dsf(ep.CONSID, ep.REMOVEASSIGNEE), auth, removeAssignee)
router.post(SYMBOLS.FORWARDSLASH, auth, createTodo)

module.exports = router
