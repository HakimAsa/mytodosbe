const asyncHandler = require('express-async-handler')

const { Note, validate } = require('../models/note.models')
const { CONS } = require('../utils/Constants')
const fourOfour = require('../utils/404')
const { Todo } = require('../models/todo.models')
const { request } = require('express')

// @desc add a note to a give task(todo)
// @route POST /api/v1/notes/todoId/:id
// @access Private

const addNoteToTask = asyncHandler(async (req, res) => {
  const { id } = req.params
  req.body.todo = id

  const { error } = validate(req.body)
  if (error)
    return res
      .status(400)
      .send({ success: false, error: error.details[0].message })

  const todo = await Todo.findById(id)
  if (!todo) return res.status(404).send(fourOfour(CONS.TODO, id))

  const note = await Note.create({ ...req.body, createdby: req.user._id })

  todo.todoNotes.push(note._id)
  await todo.save()

  res.status(201).send({ success: true, data: note })
})

module.exports = {
  addNoteToTask,
}
