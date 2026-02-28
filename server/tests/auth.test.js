import { describe, it, expect, beforeAll, afterAll, afterEach, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../server.js';
import { connectDB, disconnectDB, clearDB, createTestUser } from './setup.js';

process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret-key';
process.env.NODE_ENV = 'test';

beforeAll(async () => await connectDB());
afterEach(async () => await clearDB());
afterAll(async () => await disconnectDB());

describe('Auth API', () => {
  // ── POST /api/auth/signup ──
  describe('POST /api/auth/signup', () => {
    const validUser = {
      firstName: 'Mathieu',
      lastName: 'Fenouil',
      email: 'mathieu@techpulse.com',
      password: 'Password123!',
    };

    it('should register a new user and return token', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send(validUser);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('email', validUser.email);
      expect(res.body.user).toHaveProperty('firstName', validUser.firstName);
      expect(res.body.user).not.toHaveProperty('password');
    });

    it('should reject duplicate email', async () => {
      await request(app).post('/api/auth/signup').send(validUser);

      const res = await request(app)
        .post('/api/auth/signup')
        .send(validUser);

      expect(res.status).toBe(409);
    });

    it('should reject missing fields', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({ email: 'test@test.com' });

      expect(res.status).toBeGreaterThanOrEqual(400);
    });

    it('should reject invalid email format', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({ ...validUser, email: 'not-an-email' });

      expect(res.status).toBeGreaterThanOrEqual(400);
    });

    it('should set default role to user', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send(validUser);

      expect(res.body.user.role).toBe('user');
    });
  });

  // ── POST /api/auth/login ──
  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await request(app).post('/api/auth/signup').send({
        firstName: 'Mathieu',
        lastName: 'Fenouil',
        email: 'mathieu@techpulse.com',
        password: 'Password123!',
      });
    });

    it('should login with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'mathieu@techpulse.com', password: 'Password123!' });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('email', 'mathieu@techpulse.com');
    });

    it('should reject wrong password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'mathieu@techpulse.com', password: 'WrongPass!' });

      expect(res.status).toBe(401);
    });

    it('should reject non-existent email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'nobody@techpulse.com', password: 'Password123!' });

      expect(res.status).toBeGreaterThanOrEqual(400);
    });
  });

  // ── GET /api/auth/me ──
  describe('GET /api/auth/me', () => {
    it('should return current user profile', async () => {
      const { token } = await createTestUser({ email: 'me@techpulse.com' });

      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('email', 'me@techpulse.com');
    });

    it('should reject request without token', async () => {
      const res = await request(app).get('/api/auth/me');
      expect(res.status).toBe(401);
    });

    it('should reject invalid token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token-here');

      expect(res.status).toBe(401);
    });
  });

  // ── PUT /api/auth/me ──
  describe('PUT /api/auth/me', () => {
    it('should update user profile', async () => {
      const { token } = await createTestUser();

      const res = await request(app)
        .put('/api/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .send({ firstName: 'Updated', lastName: 'Name' });

      expect(res.status).toBe(200);
      expect(res.body.firstName).toBe('Updated');
    });

    it('should reject update without auth', async () => {
      const res = await request(app)
        .put('/api/auth/me')
        .send({ firstName: 'Hacker' });

      expect(res.status).toBe(401);
    });
  });
});