import mongoose from 'mongoose'
import { Project } from '.';

const Language = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  }
})

Language.post("remove", async doc => {
  await Project.update({
    "languages": doc._id
  }, {
    $pull: {
      "languages": doc._id
    }
  })
});

module.exports = mongoose.models.Language || mongoose.model('Language', Language)
