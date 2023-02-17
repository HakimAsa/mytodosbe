const express = require('express');

const { getMyTodos, createTodo } = require('../controllers/todoController');
const { SYMBOLS } = require('../utils/Constants');
const { ep } = require('../utils/Endpoints');
const { glb } = require('../utils/Globals');

const router = express.Router();

router.route(glb.doSetForwardSlash(ep.MYTODOS)).get(getMyTodos);
router.post(SYMBOLS.FORWARDSLASH, createTodo);

module.exports = router;
