import MongoDB from '../../lib/mongodb';
import { Technology, Project } from '../../lib/models';

export default async function handler(req, res) {
  await MongoDB();

  switch(req.method) {
    case "GET":
      const technologies = await Technology.find().lean();
      for(const tech of technologies) {
        tech.uses = await Project.find({ "technologies": tech._id }).count();
      }
      res.json({ success: true, technologies });
    break;
    case "POST":
      const data = JSON.parse(req.body);
      const tech = new Technology(data);

      try {
        await tech.save();
      } catch (e) {
        return res.json({ success: false, error: e.toString() });
      }

      res.json({ success: true });
    break;
    case "DELETE":
      req.body = JSON.parse(req.body);
      const technology = await Technology.findOne({ _id: req.body.id });

      try {
        await technology.remove();
      } catch(e){
        return res.json({ success: false, error: e.toString() });
      }

      res.json({ success: true });
    break;
    default:
      res.json({ success: false, error: "unsupported method" });
  }
}
