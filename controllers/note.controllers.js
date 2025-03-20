const asyncHandler = require('express-async-handler')

const { Note, validate } = require('../models/note.models')
const { CONS } = require('../utils/Constants')
const {
  glb: { filterAndPaginate },
} = require('../utils/Globals')
const fourOfour = require('../utils/404')
const { Todo } = require('../models/todo.models')

// @desc Fetch subnotes given a note id
// @routes GET /notes/:noteId/subnotes?parentid=noteId
// @access Private

const getSubNotes = asyncHandler(async (req, res) => {
  const { noteId } = req.params

  const note = await Note.findById(noteId)
  if (!note) return res.status(404).send(fourOfour(CONS.NOTE, noteId))

  const { data, count, page, pages } = await filterAndPaginate(req, Note)

  res.status(200).send({
    success: true,
    count,
    page,
    pages,
    data,
  })
})

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

  const note = await Note.create({
    ...req.body,
    createdby: req.user._id,
    parentid: req.body.parentid || null,
  })

  todo.todoNotes.push(note._id)
  await todo.save()

  res.status(201).send({ success: true, data: note })
})

// @desc add subnotes (reply to existing note)
// @route POST /api/notes/

module.exports = {
  addNoteToTask,
  getSubNotes,
}
