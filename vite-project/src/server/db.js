import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const url = process.env.DATABASE_URL;
const dbName = "myDB";

const client = new MongoClient(url);

let db;

export async function connectDb() {
  if (!url) {
    console.error("DATABASE_URL environment variable not set");
    process.exit(1);
  }

  try {
    await client.connect();
    console.log("Connected to MongoDB");
    db = client.db(dbName);
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  }
}

export function getDb() {
  if (!db) {
    throw new Error("Database not connected. Call connectDb() first.");
  }
  return db;
}

export async function addToCollection(collectionName, document) {
  try {
    const db = getDb();
    const result = await db.collection(collectionName).insertOne(document);
    return result;
  } catch (error) {
    console.error(`Error adding document to ${collectionName}:`, error);
    throw error;
  }
}

export async function findDocument(collectionName, query) {
  try {
    const db = getDb();
    const doc = await db.collection(collectionName).findOne(query);
    return doc;
  } catch (error) {
    console.error(`Error finding document in ${collectionName}:`, error);
    throw error;
  }
}

export async function updateDocument(collectionName, id, updatedTodo) {
  try {
    const db = getDb();
    const result = await db
      .collection(collectionName)
      .updateOne({ _id: new ObjectId(id) }, updatedTodo);
    return result;
  } catch (error) {
    console.error(`Error updating document in ${collectionName}:`, error);
    throw error;
  }
}

export async function deleteDocument(collectionName, id) {
  try {
    const db = getDb();
    const result = await db
      .collection(collectionName)
      .deleteOne({ _id: new ObjectId(id) });
    return result;
  } catch (error) {
    console.error(`Error deleting document from ${collectionName}:`, error);
    throw error;
  }
}

export async function closeDb() {
  try {
    await client.close();
    console.log("Disconnected from MongoDB");
  } catch (err) {
    console.error("Error disconnecting from MongoDB:", err);
  }
}
