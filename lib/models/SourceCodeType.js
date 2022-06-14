import mongoose from 'mongoose'

const SourceCodeType = new mongoose.Schema({
  _id: String,
  name: String
})

module.exports = mongoose.models.SourceCodeType || mongoose.model('SourceCodeType', SourceCodeType)
