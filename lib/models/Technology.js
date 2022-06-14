import mongoose from 'mongoose';
import { Project } from '.';

const Technology = new mongoose.Schema({
  _id: String,
  name: String
})

Technology.post("remove", async doc => {
  await Project.update({
    "technologies": doc._id
  }, {
    $pull: {
      "technologies": doc._id
    }
  })
});

module.exports = mongoose.models.Technology || mongoose.model('Technology', Technology)
