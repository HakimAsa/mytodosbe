const express = require('express')

const {
  getMyTodos,
  createTodo,
  getTodoById,
  deleteTodo,
  updateTodo,
} = require('../controllers/todo.controllers')
const validateObjectId = require('../middleware/validateObjectId')
const { SYMBOLS } = require('../utils/Constants')
const { ep } = require('../utils/Endpoints')
const {
  glb: { doSetForwardSlash: dsf },
} = require('../utils/Globals')

const router = express.Router()

router.route(dsf(ep.MYTODOS)).get(getMyTodos)
router
  .route(dsf(ep.CONSID))
  .get(validateObjectId, getTodoById)
  .put(validateObjectId, updateTodo)
  .delete(validateObjectId, deleteTodo)
router.post(SYMBOLS.FORWARDSLASH, createTodo)

module.exports = router
