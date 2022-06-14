import mongoose from 'mongoose'

const Project = new mongoose.Schema({
  _id: {
    type: String,
    required: [true, "You need a project ID"],
    minLength: [2, "Project ID needs to be at least 2 characters long"]
  },
  name: {
    type: String,
    required: [true, "You need a project name"]
  },
  tagline: String,
  description: String,
  image: String,
  languages: [
    {
      type: String,
      ref: "Language"
    }
  ],
  technologies: [
    {
      type: String,
      ref: "Technology"
    }
  ],
  demo: String,
  sourceCode: {
    type: {
      type: String,
      ref: "SourceCodeType",
      default: "private"
    },
    location: String
  },
  timeframe: [
    {
      date: Date,
      format: {},
      text: String,
      details: String
    }
  ],

  pinned: Boolean,
  ongoing: Boolean

  // private listing
})

module.exports = mongoose.models.Project || mongoose.model('Project', Project)
