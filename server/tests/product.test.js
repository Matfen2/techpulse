import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import mongoose from 'mongoose';
import request from 'supertest';
import app from '../server.js';
import User from '../models/User.js';
import Product from '../models/Product.js';

let adminToken;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/techpulse-test');

  // Create admin user for protected routes
  await User.deleteMany({ email: 'admin@test.com' });
  const admin = await User.create({
    firstName: 'Admin',
    lastName: 'Test',
    email: 'admin@test.com',
    password: 'Admin1234',
    role: 'admin',
  });

  const res = await request(app).post('/api/auth/login').send({
    email: 'admin@test.com',
    password: 'Admin1234',
  });
  adminToken = res.body.token;
});

afterAll(async () => {
  await User.deleteMany({ email: 'admin@test.com' });
  await Product.deleteMany({ name: /^Test Product/ });
  await mongoose.connection.close();
});

describe('Products API', () => {
  it('GET /api/products — should return products with pagination', async () => {
    const res = await request(app).get('/api/products');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('products');
    expect(res.body).toHaveProperty('total');
    expect(res.body).toHaveProperty('page');
    expect(res.body).toHaveProperty('totalPages');
  });

  it('GET /api/products?category=Smartphone — should filter by category', async () => {
    const res = await request(app).get('/api/products?category=Smartphone');

    expect(res.status).toBe(200);
    res.body.products.forEach((p) => {
      expect(p.category).toBe('Smartphone');
    });
  });

  it('GET /api/products?sort=price_asc — should sort by price', async () => {
    const res = await request(app).get('/api/products?sort=price_asc');

    expect(res.status).toBe(200);
    const prices = res.body.products.map((p) => p.price);
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  it('GET /api/products/:slug — should return a single product', async () => {
    // Create a product first to guarantee it exists
    await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Test Product Slug',
        brand: 'Sony',
        category: 'Smartphone',
        price: 799,
        description: 'Produit de test pour vérifier la route slug',
      });

    const res = await request(app).get('/api/products/test-product-slug');

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Test Product Slug');
    expect(res.body.brand).toBe('Sony');
  });

  it('GET /api/products/:slug — should 404 for unknown slug', async () => {
    const res = await request(app).get('/api/products/produit-inexistant');

    expect(res.status).toBe(404);
  });

  it('POST /api/products — should create product (admin)', async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Test Product Creation',
        brand: 'Samsung',
        category: 'Smartphone',
        price: 999,
        description: 'Un produit de test pour vérifier la création via API',
      });

    expect(res.status).toBe(201);
    expect(res.body.slug).toBe('test-product-creation');
  });

  it('POST /api/products — should reject without admin role', async () => {
    const userRes = await request(app).post('/api/auth/signup').send({
      firstName: 'Normal',
      lastName: 'User',
      email: 'normaluser@test.com',
      password: 'Test1234',
    });

    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${userRes.body.token}`)
      .send({
        name: 'Test Product Unauthorized',
        brand: 'Apple',
        category: 'Laptop',
        price: 1999,
        description: 'Ce produit ne devrait pas être créé par un user normal',
      });

    expect(res.status).toBe(403);

    await User.deleteMany({ email: 'normaluser@test.com' });
  });

  it('GET /api/products/brands — should return brands with count', async () => {
    const res = await request(app).get('/api/products/brands');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    res.body.forEach((b) => {
      expect(b).toHaveProperty('name');
      expect(b).toHaveProperty('count');
    });
  });
});