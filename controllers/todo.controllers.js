const asyncHandler = require('express-async-handler')

const { Todo, validate } = require('../models/todo.models')
const fourOfour = require('../utils/404')
const { CONS } = require('../utils/Constants')
const {
  glb: { filterAndPaginate },
} = require('../utils/Globals')
const del = require('../utils/DeleteMsg')

// @desc Fetch my own todos
// @route GET /api/v1/todos/mytodos
// @access Private
const getMyTodos = asyncHandler(async (req, res) => {
  // filter, sort and pagination function
  const { data, count, page, pages } = await filterAndPaginate(req, Todo)
  return res.status(200).send({
    success: true,
    count,
    page,
    pages,
    data,
  })
})

// @desc Fetch a single todo by id
// @route GET /api/v1/todos/:id
// @access Private -> allowed for logged in user
const getTodoById = asyncHandler(async (req, res) => {
  const { id } = req.params

  const todo = await Todo.findById(id)
  if (!todo) return res.status(404).send(fourOfour(CONS.TODO, id))

  res.status(200).send({
    success: true,
    data: todo,
  })
})

// @desc create a todo
// @route POST /api/v1/todos
// @access Private -> only logged in user can create a todo
const createTodo = asyncHandler(async (req, res) => {
  const { error } = validate(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  // Validate assigned users
  const { assignees } = req.body
  const validUsers = await User.find({ _id: { $in: assignees } })
  if (validUsers.length !== assignees.length) {
    const message =
      req.user.language === 'fr'
        ? 'Un ou plusieurs utilisateurs non trouvés'
        : 'One or more users not found'
    return res.status(400).json({ success: false, message })
  }

  const todo = await Todo.create({ ...req.body, createdby: req.user._id })

  res.status(201).send({
    success: true,
    data: todo,
  })
})

// @desc add assignees to todo
// @route PUT /api/v1/todos/:id/add-assignee
// @access Private
const addAssignee = asyncHandler(async (req, res) => {
  const { id } = req.params
  const todo = await Todo.findById(id)
  if (!todo) return res.status(404).send(fourOfour(CONS.TODO, id))

  // Add user to assignees if not already assigned
  const { userId } = req.body
  if (!todo.assignees.includes(userId)) {
    todo.assignees.push(userId)
    await todo.save()
  }

  res.status(200).json({ message: 'User added to task', todo })
})

// @desc remode assignee from todo
// @route PUT /api/v1/todos/:id/remove-assignee
// @access Private
const removeAssignee = asyncHandler(async (req, res) => {
  const { id } = req.params
  const todo = await Todo.findById(id)
  if (!todo) return res.status(404).send(fourOfour(CONS.TODO, id))

  // de-assign a user from a todo
  const { userId } = req.body
  if (todo.assignees.includes(userId)) {
    todo.assignees = todo.assignees.filter(
      (assigneeId) => assigneeId.toString() !== userId
    )
    await todo.save()
  }

  res.status(200).json({ message: 'User removed from the task', todo })
})

// @desc edit a todo
// @route PUT /api/v1/todos/:id
// @access Private -> only owner/admin can edit a todo
const updateTodo = asyncHandler(async (req, res) => {
  const { error } = validate(req.body, false)
  if (error) return res.status(400).send(error.details[0].message)
  const { text, status, startdate, enddate } = req.body

  const id = req.params.id

  let todo = await Todo.findById(id)
  if (!todo) return res.status(404).send(fourOfour(CONS.TODO, id))

  const fieldToUpdate = {
    //owner: req.user._id.toString(),
    text: text || todo.text,
    status: status || todo.status,
    startdate: startdate || todo.startdate,
    enddate: enddate || todo.enddate,
  }

  todo = await Todo.findByIdAndUpdate(
    id,
    {
      $set: fieldToUpdate,
    },
    { new: true }
  )

  res.status(200).send({ success: true, data: todo })
})

// @desc edit a todo partially
// @route PATCH /api/v1/todos/:id
// @access Private -> only owner/admin can edit a todo
const patchTodo = asyncHandler(async (req, res) => {
  const { error } = validate(req.body, false)
  if (error) return res.status(400).send(error.details[0].message)

  const id = req.params.id

  let todo = await Todo.findById(id)
  if (!todo) return res.status(404).send(fourOfour(CONS.TODO, id))

  const fieldToUpdate = req.body

  todo = await Todo.updateOne(id, {
    $set: fieldToUpdate,
  })

  res.status(200).send({ success: true, data: todo })
})

// @desc delete a todo
// @route DELETE /api/v1/todos/id
// @access Private -> only owner/admin can delete a todo
const deleteTodo = asyncHandler(async (req, res) => {
  const { id } = req.params

  const todo = await Todo.findById(id)
  if (!todo) return res.status(404).send(fourOfour(CONS.TODO, id))

  if (
    req.user._id.toString() !== todo.user.toString() ||
    req.user.role !== 'admin'
  )
    return res.status(401).send({
      success: false,
      error: 'Unthorized',
      message: 'You can only delete your own todo',
    })

  todo.remove()

  res.send(del(id, todo, CONS.TODO))
})

module.exports = {
  addAssignee,
  createTodo,
  deleteTodo,
  getMyTodos,
  getTodoById,
  patchTodo,
  removeAssignee,
  updateTodo,
}
