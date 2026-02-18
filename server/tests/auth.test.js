import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import mongoose from 'mongoose';
import request from 'supertest';
import app from '../server.js';
import User from '../models/User.js';

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/techpulse-test');
  await User.deleteMany({ email: 'test@auth.com' });
});

afterAll(async () => {
  await User.deleteMany({ email: 'test@auth.com' });
  await mongoose.connection.close();
});

let token;

describe('Auth API', () => {
  it('POST /api/auth/signup — should create a new user', async () => {
    const res = await request(app).post('/api/auth/signup').send({
      firstName: 'Test',
      lastName: 'User',
      email: 'test@auth.com',
      password: 'Test1234',
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.email).toBe('test@auth.com');
    expect(res.body.user.role).toBe('user');
    token = res.body.token;
  });

  it('POST /api/auth/signup — should reject duplicate email', async () => {
    const res = await request(app).post('/api/auth/signup').send({
      firstName: 'Test',
      lastName: 'Duplicate',
      email: 'test@auth.com',
      password: 'Test1234',
    });

    expect(res.status).toBe(409);
  });

  it('POST /api/auth/login — should login with valid credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'test@auth.com',
      password: 'Test1234',
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.firstName).toBe('Test');
  });

  it('POST /api/auth/login — should reject wrong password', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'test@auth.com',
      password: 'WrongPass1',
    });

    expect(res.status).toBe(401);
  });

  it('GET /api/auth/me — should return user with valid token', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.email).toBe('test@auth.com');
  });

  it('GET /api/auth/me — should reject without token', async () => {
    const res = await request(app).get('/api/auth/me');

    expect(res.status).toBe(401);
  });
});