import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

let mongoServer;

// Start in-memory MongoDB before all tests
export const connectDB = async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
};

// Drop DB and close connection after all tests
export const disconnectDB = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
};

// Clear all collections between tests
export const clearDB = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
};

// Create a test user and return { user, token }
export const createTestUser = async (overrides = {}) => {
  const userData = {
    firstName: 'Test',
    lastName: 'User',
    email: `test-${Date.now()}@techpulse.com`,
    password: 'Password123!',
    role: 'user',
    ...overrides,
  };

  const user = await User.create(userData);
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET || 'test-secret-key',
    { expiresIn: '1h' }
  );

  return { user, token };
};

// Create an admin user and return { user, token }
export const createTestAdmin = async () => {
  return createTestUser({
    firstName: 'Admin',
    lastName: 'TechPulse',
    email: `admin-${Date.now()}@techpulse.com`,
    role: 'admin',
  });
};