import MongoDB from '../../lib/mongodb';
import { Project } from '../../lib/models';

export default async function handler(req, res) {
  await MongoDB();
  switch(req.method){
    case "GET": {
      const projects = (await Project.find({}).lean()).map(project => {
        if(project.sourceCode?.type != "public") {
          delete project.sourceCode.location;
        }
        project.timeframe = project.timeframe.map(tf => ({
          ...tf,
          _id: null,
          date: tf.date.toString()
        }))
        return project;
      });

      res.json({ success: true, projects });
    break;
    }
    case "POST": {
      const data = JSON.parse(req.body);
      const project = new Project(data);

      try {
        await project.save();
      } catch (e) {
        return res.json({ success: false, error: e.toString() });
      }

      res.json({ success: true });
    break;
    }
    case "PUT": {
      const data = JSON.parse(req.body);

      const project = await Project.findOne({ _id: data._id });
      Object.keys(data).forEach(k => {
        project[k] = data[k];
      });

      try {
        project.save();
      } catch(e) {
        return res.json({ success: false, error: e.toString() });
      }

      res.json({ success: true });
    break;
    }
    case "DELETE": {
      const data = JSON.parse(req.body);

      const project = await Project.findOne({ _id: data.id });

      try {
        project.remove();
      } catch(e) {
        return res.json({ success: false, error: e.toString() });
      }

      res.json({ success: true });
    break;
    }
    default:
      return res.json({ success: false, error: "unsupported method" });
  }
}
