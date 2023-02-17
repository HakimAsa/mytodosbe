const asyncHandler = require('express-async-handler');

const { Todo, validate } = require('../models/todo');

// @desc get my todos
// @route GET /api/v1/todos/mytodos
// @access Private
const getMyTodos = asyncHandler(async (req, res) => {
  const myTodos = await Todo.find({});
  res.send({
    count: myTodos.length,
    data: myTodos,
  });
});

// @desc create a todo
// @route POST /api/v1/todos
// @access Private -> only logged in user can create a todo
const createTodo = asyncHandler(async (req, res) => {
  const { error } = validate(req.body);
  console.log(error);
  if (error) return res.status(400).send(error.details[0].message);

  const todo = await Todo.create(req.body);

  res.status(201).send({
    success: true,
    data: todo,
  });
});

module.exports = { getMyTodos, createTodo };
