const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017';
const dbName = 'userAuthDB';

let db = null;

async function connectToDatabase() {
  if (db) return db;
  
  try {
    const client = new MongoClient(url);
    await client.connect();
    db = client.db(dbName);
    console.log('Connected to MongoDB');
    return db;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

module.exports = { connectToDatabase };