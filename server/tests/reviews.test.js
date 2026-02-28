import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../server.js';
import Product from '../models/Product.js';
import Review from '../models/Review.js';
import { connectDB, disconnectDB, clearDB, createTestUser, createTestAdmin } from './setup.js';

process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret-key';
process.env.NODE_ENV = 'test';

let userToken, userId, adminToken, productId;

beforeAll(async () => await connectDB());
afterAll(async () => await disconnectDB());

beforeEach(async () => {
  await clearDB();

  const user = await createTestUser({ email: 'reviewer@techpulse.com' });
  const admin = await createTestAdmin();
  userToken = user.token;
  userId = user.user._id;
  adminToken = admin.token;

  const product = await Product.create({
    name: 'Test Product',
    brand: 'Samsung',
    category: 'Smartphone',
    price: 999,
    description: 'A test product for reviews testing.',
    inStock: true,
  });
  productId = product._id;
});

describe('Reviews API', () => {
  // ── POST /api/reviews/:productId ──
  describe('POST /api/reviews/:productId', () => {
    it('should create a review for a product', async () => {
      const res = await request(app)
        .post(`/api/reviews/${productId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ rating: 5, comment: 'Excellent produit, je recommande vivement !' });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('rating', 5);
      expect(res.body).toHaveProperty('comment');
    });

    it('should update product rating after review', async () => {
      await request(app)
        .post(`/api/reviews/${productId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ rating: 4, comment: 'Très bon produit avec quelques défauts mineurs.' });

      const product = await Product.findById(productId);
      expect(product.rating).toBe(4);
      expect(product.numReviews).toBe(1);
    });

    it('should prevent duplicate review from same user', async () => {
      await request(app)
        .post(`/api/reviews/${productId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ rating: 5, comment: 'Premier avis sur ce produit génial !' });

      const res = await request(app)
        .post(`/api/reviews/${productId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ rating: 3, comment: 'Deuxième avis pas possible normalement.' });

      // API returns 409 Conflict for duplicate review
      expect(res.status).toBe(409);
    });

    it('should reject review without auth', async () => {
      const res = await request(app)
        .post(`/api/reviews/${productId}`)
        .send({ rating: 5, comment: 'Tentative sans connexion sur le produit.' });

      expect(res.status).toBe(401);
    });

    it('should reject invalid rating (out of 1-5 range)', async () => {
      const res = await request(app)
        .post(`/api/reviews/${productId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ rating: 6, comment: 'Note trop élevée mais commentaire valide.' });

      expect(res.status).toBeGreaterThanOrEqual(400);
    });
  });

  // ── GET /api/reviews/:productId ──
  describe('GET /api/reviews/:productId', () => {
    it('should return reviews for a product', async () => {
      await Review.create({
        user: userId,
        product: productId,
        rating: 4,
        comment: 'Bon produit, bon rapport qualité prix.',
      });

      const res = await request(app).get(`/api/reviews/${productId}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(1);
      expect(res.body[0]).toHaveProperty('rating', 4);
    });

    it('should return empty array for product with no reviews', async () => {
      const res = await request(app).get(`/api/reviews/${productId}`);

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(0);
    });
  });

  // ── PUT /api/reviews/:id ──
  describe('PUT /api/reviews/:id', () => {
    it('should update own review', async () => {
      const review = await Review.create({
        user: userId,
        product: productId,
        rating: 3,
        comment: 'Avis initial avant modification du commentaire.',
      });

      const res = await request(app)
        .put(`/api/reviews/${review._id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ rating: 5, comment: 'Avis modifié après quelques semaines utilisation.' });

      expect(res.status).toBe(200);
      expect(res.body.rating).toBe(5);
    });

    it('should reject update from different user', async () => {
      const { token: otherToken } = await createTestUser({ email: 'other@techpulse.com' });

      const review = await Review.create({
        user: userId,
        product: productId,
        rating: 4,
        comment: 'Cet avis appartient à un autre utilisateur.',
      });

      const res = await request(app)
        .put(`/api/reviews/${review._id}`)
        .set('Authorization', `Bearer ${otherToken}`)
        .send({ rating: 1, comment: 'Tentative de modification non autorisée.' });

      expect(res.status).toBe(403);
    });
  });

  // ── DELETE /api/reviews/:id ──
  describe('DELETE /api/reviews/:id', () => {
    it('should delete own review', async () => {
      const review = await Review.create({
        user: userId,
        product: productId,
        rating: 2,
        comment: 'Avis à supprimer par son auteur légitime.',
      });

      const res = await request(app)
        .delete(`/api/reviews/${review._id}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);

      const found = await Review.findById(review._id);
      expect(found).toBeNull();
    });

    it('should allow admin to delete any review', async () => {
      const review = await Review.create({
        user: userId,
        product: productId,
        rating: 1,
        comment: "Avis modéré et supprimé par l'administrateur.",
      });

      const res = await request(app)
        .delete(`/api/reviews/${review._id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
    });

    it('should update product rating after review deletion', async () => {
      const { user: user2, token: token2 } = await createTestUser({ email: 'u2@techpulse.com' });

      await Review.create({ user: userId, product: productId, rating: 5, comment: 'Cinq étoiles mérité pour ce produit !' });
      const review2 = await Review.create({ user: user2._id, product: productId, rating: 1, comment: 'Pas satisfait du tout, très déçu.' });

      await request(app)
        .delete(`/api/reviews/${review2._id}`)
        .set('Authorization', `Bearer ${token2}`);

      const product = await Product.findById(productId);
      expect(product.rating).toBe(5);
      expect(product.numReviews).toBe(1);
    });
  });

  // ── GET /api/reviews/user/me ──
  describe('GET /api/reviews/user/me', () => {
    it('should return current user reviews', async () => {
      await Review.create({
        user: userId,
        product: productId,
        rating: 4,
        comment: 'Mon avis personnel sur ce produit tech.',
      });

      const res = await request(app)
        .get('/api/reviews/user/me')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
    });
  });
});