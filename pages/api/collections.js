import MongoDB from '../../lib/mongodb';
import { Collection, Project } from '../../lib/models';

export default async function handler(req, res) {
  await MongoDB();

  switch(req.method) {
    case "GET":
      const collections = await Collection.find().lean();
      res.json({ success: true, collections });
    break;
    case "POST":
      const data = JSON.parse(req.body);
      const collection = new Collection(data);

      try {
        await collection.save();
      } catch (e) {
        return res.json({ success: false, error: e.toString() });
      }

      res.json({ success: true });
    break;
    case "PUT": {
      const data = JSON.parse(req.body);

      const collection = await Collection.findOne({ _id: data._id });
      Object.keys(data).forEach(k => {
        collection[k] = data[k];
      });

      try {
        collection.save();
      } catch(e) {
        return res.json({ success: false, error: e.toString() });
      }

      res.json({ success: true });
    break;
    }
    case "DELETE":
      req.body = JSON.parse(req.body);
      const collection2 = await Collection.findOne({ _id: req.body.id });

      try {
        await collection2.remove();
      } catch(e){
        return res.json({ success: false, error: e.toString() });
      }

      res.json({ success: true });
    break;
    default:
      res.json({ success: false, error: "unsupported method" });
  }
}
