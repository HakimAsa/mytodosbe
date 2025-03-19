const Joi = require('joi')
const mongoose = require('mongoose')

Joi.objectId = require('joi-objectid')(Joi)

const { COL } = require('../utils/Collections')

const Schema = mongoose.Schema

const noteSchema = new Schema(
  {
    content: String,
    createdby: {
      type: Schema.Types.ObjectId,
      ref: COL.USER,
      required: true,
    },
    todo: { type: Schema.Types.ObjectId, ref: COL.TODO, required: true },
    lastmodifiedby: { type: Schema.Types.ObjectId, ref: COL.USER },
    lastmodifiedat: { type: Date, default: Date.now },
    isdone: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, setters: true },
    toObject: { virtuals: true, setters: true },
  }
)

const Note = mongoose.model(COL.NOTE, noteSchema)

function validateNote(req, isRequired = true) {
  const schema = Joi.object({
    content: isRequired
      ? Joi.string().min(1).max(2000).required()
      : Joi.string().min(1).max(2000),
    todo: Joi.objectId().required(),
  })
  return schema.validate(req)
}

exports.Note = Note
exports.validate = validateNote
