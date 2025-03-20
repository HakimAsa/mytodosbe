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
    parentid: { type: Schema.Types.ObjectId, default: null, ref: COL.NOTE },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, setters: true },
    toObject: { virtuals: true, setters: true },
  }
)

noteSchema.index({ todo: 1 }) // optimization fetching notes by todo
noteSchema.index({ parentid: 1 })

/**
 * A pre-save hook function for the noteSchema.
 * This function updates the 'lastmodifiedat' field to the current date and time before saving the note document.
 *
 * @function preSaveHook
 * @param {Function} next - The callback function to be invoked after updating the 'lastmodifiedat' field.
 *
 * @returns {void}
 */
noteSchema.pre('save', function (next) {
  this.lastmodifiedat = new Date()
  next()
})

const Note = mongoose.model(COL.NOTE, noteSchema)

function validateNote(req, isRequired = true) {
  const schema = Joi.object({
    content: isRequired
      ? Joi.string().min(1).max(2000).required()
      : Joi.string().min(1).max(2000),
    todo: Joi.objectId().required(),
    parentid: Joi.objectId(),
  })
  return schema.validate(req)
}

exports.Note = Note
exports.validate = validateNote
