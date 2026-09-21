import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'store.json');

let isMongoConnected = false;

// Ensure local data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Ensure initial store structure
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(
    DATA_FILE,
    JSON.stringify({
      users: [],
      student_profiles: [],
      industry_profiles: [],
      academician_profiles: [],
      institution_profiles: []
    }, null, 2)
  );
}

export const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;
  if (mongoUri && mongoUri.trim() !== '') {
    try {
      await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 5000
      });
      isMongoConnected = true;
      console.log('✅ Connected to MongoDB Atlas');
      return true;
    } catch (err) {
      console.warn('⚠️ MongoDB Atlas connection failed. Falling back to local persistent store:', err.message);
      isMongoConnected = false;
      return false;
    }
  } else {
    console.log('ℹ️ No MONGODB_URI provided. Running with local persistent file store at server/data/store.json');
    isMongoConnected = false;
    return false;
  }
};

export const getStore = () => {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    return {
      users: [],
      student_profiles: [],
      industry_profiles: [],
      academician_profiles: [],
      institution_profiles: []
    };
  }
};

export const saveStore = (data) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

export { isMongoConnected };
