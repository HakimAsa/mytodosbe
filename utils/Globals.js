const config = require('config')
const { SYMBOLS, CONS } = require('./Constants')

const GLOBALS = {
  capitalizeFirstLetter: function (str) {
    if (!str || typeof str !== 'string') throw new Error(CONS.INPUT_STRING)
    return (
      this.changeCase(str.trim().charAt(0), false) + str.trim().substring(1)
    )
  },

  changeCase: function (str, isLower = true) {
    if (!str || typeof str !== 'string') throw new Error(CONS.INPUT_STRING)
    return isLower ? str.toLowerCase() : str.toUpperCase()
  },

  isNull: function (param) {
    return !param && typeof param === 'object'
  },

  doSetForwardSlash: function (...endpoint) {
    if (GLOBALS.isEmptyArray(endpoint))
      throw new Error('Your input array should contain at least one element')

    if (endpoint.length === 1) return SYMBOLS.FORWARDSLASH + endpoint[0]

    return SYMBOLS.FORWARDSLASH + endpoint.join(SYMBOLS.FORWARDSLASH)
  },

  isEmptyArray: function (arr) {
    return Array.isArray(arr) && arr.length === 0
  },
  filterAndPaginate: async function (req, Model) {
    //Pagination
    const pageSize = config.get('pageSize')
    const page = Number(req.query.pageNumber) || 1

    //basic filtering
    const queryObj = { ...req.query }
    const excludedFields = ['page', 'sort', 'limit', 'fields']
    excludedFields.forEach((el) => delete queryObj[el])

    //1B) Advanced filtering
    let queryString = JSON.stringify(queryObj)
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    )
    let query = Model.find(JSON.parse(queryString))

    // 2) Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ')
      query = query.sort(sortBy)
    } else {
      query = query.sort('-createdAt')
    }
    const count = await Model.countDocuments({ ...JSON.parse(queryString) })
    const data = await query.limit(pageSize).skip(pageSize * (page - 1))
    const pages = Math.ceil(count / pageSize)
    return { count, data, page, pages }
  },
}

exports.glb = GLOBALS
