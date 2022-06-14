import MongoDB from '../../lib/mongodb';
import { Language, Project } from '../../lib/models';

export default async function handler(req, res) {
  await MongoDB();

  switch(req.method) {
    case "GET":
      const languages = await Language.find().lean();
      for(const lang of languages) {
        lang.uses = await Project.find({ "languages": lang._id }).count();
      }
      res.json({ success: true, languages });
    break;
    case "POST":
      const data = JSON.parse(req.body);
      const lang = new Language(data);

      try {
        await lang.save();
      } catch (e) {
        return res.json({ success: false, error: e.toString() });
      }

      res.json({ success: true });
    break;
    case "DELETE":
      req.body = JSON.parse(req.body);
      const language = await Language.findOne({ _id: req.body.id });

      try {
        await language.remove();
      } catch(e){
        return res.json({ success: false, error: e.toString() });
      }

      res.json({ success: true });
    break;
    default:
      res.json({ success: false, error: "unsupported method" });
  }
}
