import mongoose from 'mongoose'
import { Project } from '.';

const Collection = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  header: String,
  projects: [
    {
      type: String,
      ref: "Project"
    }
  ]
})

module.exports = mongoose.models.Collection || mongoose.model('Collection', Collection)
