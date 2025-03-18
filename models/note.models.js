const Joi = require('joi')
const mongoose = require('mongoose')

Joi.objectId = require('joi.objectId')(Joi)

const { COL } = require('../utils/Collections')

const Schema = mongoose.Schema

const noteSchema = new Schema(
  {
    content: String,
    owner: {
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

exports.Note = Note
