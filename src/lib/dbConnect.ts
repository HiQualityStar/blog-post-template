import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI = process.env.MONGO_URI as string;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGO_URI environment variable in .env.local");
}

// Extend the global object to include a mongoose cache
interface GlobalMongooseCache {
  mongoose: {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
  };
}

declare const global: typeof globalThis & GlobalMongooseCache;

// Initialize the global cache if it doesn't exist
const globalCache = global.mongoose ??= { conn: null, promise: null };

async function dbConnect(): Promise<Mongoose> {
  if (globalCache.conn) return globalCache.conn;

  if (!globalCache.promise) {
    globalCache.promise = mongoose.connect(MONGODB_URI).then((mongoose) => mongoose);
  }

  globalCache.conn = await globalCache.promise;
  return globalCache.conn;
}

export default dbConnect;





// import mongoose from 'mongoose';

// const MONGODB_URI = process.env.MONGO_URI as string;

// if (!MONGODB_URI) {
//   throw new Error("Please define the MONGO_URI environment variable in .env.local");
// }

// let cached = (global as any).mongoose;

// if (!cached) {
//   cached = (global as any).mongoose = { conn: null, promise: null };
// }

// async function dbConnect() {
//   if (cached.conn) return cached.conn;

//   if (!cached.promise) {
//     cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => mongoose);
//   }

//   cached.conn = await cached.promise;
//   return cached.conn;
// }

// export default dbConnect;
