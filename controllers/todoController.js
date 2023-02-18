const asyncHandler = require('express-async-handler');

const { Todo, validate } = require('../models/todo');
const fourOfour = require('../utils/404');
const { CONS } = require('../utils/Constants');
const del = require('../utils/DeleteMsg');

// @desc Fetch my own todos
// @route GET /api/v1/todos/mytodos
// @access Private
const getMyTodos = asyncHandler(async (req, res) => {
  const myTodos = await Todo.find({});
  res.send({
    count: myTodos.length,
    data: myTodos,
  });
});

// @desc Fetch a single todo by id
// @route GET /api/v1/todos/:id
// @access Private -> allowed for logged in user
const getTodoById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const todo = await Todo.findById(id);
  if (!todo) return res.status(404).send(fourOfour(CONS.TODO, id));

  res.status(200).send({
    success: true,
    data: todo,
  });
});

// @desc create a todo
// @route POST /api/v1/todos
// @access Private -> only logged in user can create a todo
const createTodo = asyncHandler(async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const todo = await Todo.create(req.body);

  res.status(201).send({
    success: true,
    data: todo,
  });
});

// @desc edit a todo
// @route PUT /api/v1/todos/:id
// @access Private -> only owner/admin can edit a todo
const updateTodo = asyncHandler(async (req, res) => {
  const { text, status, startdate, enddate } = req.body;

  const { error } = validate(req.body, false);
  if (error) return res.status(400).send(error.details[0].message);

  const id = req.params.id;

  let todo = await Todo.findById(id);
  if (!todo) return res.status(404).send(fourOfour(CONS.TODO, id));

  const fieldToUpdate = {
    //owner: req.user._id.toString(),
    text: text || todo.text,
    status: status || todo.status,
    startdate: startdate || todo.startdate,
    enddate: enddate || todo.enddate,
  };

  todo = await Todo.findByIdAndUpdate(
    id,
    {
      $set: fieldToUpdate,
    },
    { new: true }
  );

  res.status(200).send({ success: true, data: todo });
});

// @desc delete a todo
// @route DELETE /api/v1/todos/id
// @access Private -> only owner/admin can delete a todo
const deleteTodo = asyncHandler(async (req, res) => {
  const { id } = req.params;

  let todo = await Todo.findById(id);
  if (!todo) return res.status(404).send(fourOfour(CONS.TODO, id));

  // if (req.user._id.toString() !== todo.user.toString())
  //   return res.status(404).send({
  //     error: 'Unthorized',
  //     message: 'You can only delete your own todo',
  //   });

  todo = await Todo.findByIdAndRemove(id);

  res.send(del(id, todo, CONS.TODO));
});

module.exports = { getMyTodos, createTodo, deleteTodo, updateTodo, getTodoById };
