import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const url = process.env.DATABASE_URL;
const dbName = "myDB";

const client = new MongoClient(url);

let db;

export async function connectDb() {
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
  return db;
}
