const mongoose = require('mongoose')
module.exports = function (req, res, next) {
  // Check if id in params is valid ObjectId
  for (const key in req.params) {
    if (mongoose.Types.ObjectId.isValid(req.params[key]) === false) {
      return res.status(400).send(`Invalid ID in parameter: ${key}`)
    }
  }

  next()
}
