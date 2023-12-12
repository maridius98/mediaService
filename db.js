import { MongoClient } from "mongodb";
const connectionString = "mongodb://localhost:27018"
const client = new MongoClient(connectionString);
let conn;

try {
    conn = await client.connect();
} catch (e) {
    console.error(e);
}

let db = conn.db("sample");
export default db;