import mongoose from 'mongoose';
import { Collection, SourceCodeType } from './models';

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  )
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function ensureDefaults() {
  if(!await Collection.findOne({ _id: "home" })) {
    await (new Collection({
      "_id": "home",
      "name": "Home",
      "header": "/images/taiki-ishikawa-BJSh0jeZnIA-unsplash.jpg",
      "projects": []
    })).save();
  }

  const sourcecode = [
    {
      "_id": "public",
      "name": "Public"
    },
    {
      "_id": "private",
      "name": "Private (available under request)"
    },
    {
      "_id": "proprietary",
      "name": "Proprietary"
    }
  ];

  for(const sc of sourcecode) {
    if(!await SourceCodeType.findOne({ _id: sc._id })) {
      await (new SourceCodeType(sc)).save();
    }
  }
}

async function dbConnect () {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      bufferCommands: false
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts).then(mongoose => {
      return mongoose;
    })
  }
  cached.conn = await cached.promise;

  await ensureDefaults();

  return cached.conn
}

export default dbConnect
