const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  path: String,
  response: Object
})

module.exports = mongoose.model('Cache', schema)
