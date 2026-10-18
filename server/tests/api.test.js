import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../src/app.js';

describe('SkillPath AI API Test Suite', () => {
  // 1. Health check endpoint
  describe('GET /health', () => {
    it('should return 200 and server health diagnostic status', async () => {
      const res = await request(app).get('/health');
      assert.equal(res.status, 200);
      assert.equal(res.body.status, 'ok');
      assert.equal(res.body.service, 'skillpath-ai-api');
      assert.ok(typeof res.body.uptime === 'number');
      assert.ok(res.body.database);
    });
  });

  // 2. Career Exploration & Recommendations
  describe('Careers Endpoints (/api/careers)', () => {
    it('should list all supported career paths', async () => {
      const res = await request(app).get('/api/careers');
      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      assert.ok(Array.isArray(res.body.data.careers));
      assert.ok(res.body.data.careers.length >= 7);

      const frontend = res.body.data.careers.find((c) => c.id === 'frontend-dev');
      assert.ok(frontend, 'Frontend developer track should exist in catalogue');
      assert.equal(frontend.title, 'Frontend Developer');
      assert.ok(Array.isArray(frontend.requiredSkills));
    });

    it('should fetch a single career track by ID', async () => {
      const res = await request(app).get('/api/careers/frontend-dev');
      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      assert.equal(res.body.data.career.id, 'frontend-dev');
    });

    it('should calculate career assessment recommendations and skill gaps', async () => {
      const payload = {
        educationLevel: "Bachelor's Degree",
        degree: 'Computer Science',
        existingSkills: ['JavaScript', 'HTML & Modern CSS', 'React'],
        interests: ['web development', 'frontend', 'ui/ux'],
        preferredWorkEnvironment: 'Remote',
        weeklyLearningHours: 15,
      };

      const res = await request(app)
        .post('/api/careers/assess')
        .send(payload);

      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      assert.ok(Array.isArray(res.body.data.recommendations));
      assert.ok(res.body.data.recommendations.length > 0);

      const top = res.body.data.topRecommendation || res.body.data.recommendations[0];
      assert.ok(top.matchScore > 50, 'Frontend should score high match');
      assert.ok(top.missingSkills);
    });

    it('should fail assessment validation if existingSkills is empty or invalid', async () => {
      const res = await request(app)
        .post('/api/careers/assess')
        .send({ existingSkills: 'not an array' });

      assert.equal(res.status, 400);
      assert.equal(res.body.success, false);
    });
  });

  // 3. Learning Roadmaps
  describe('Roadmaps Endpoints (/api/roadmaps)', () => {
    it('should return starter roadmaps for all supported tracks', async () => {
      const res = await request(app).get('/api/roadmaps');
      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      assert.ok(res.body.data.roadmaps['frontend-dev']);
      assert.ok(res.body.data.roadmaps['fullstack-dev']);
    });

    it('should return starter roadmap for a specific career track', async () => {
      const res = await request(app).get('/api/roadmaps/frontend-dev');
      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      assert.ok(res.body.data.roadmap.stages.length >= 3);
      assert.equal(res.body.data.roadmap.careerType, 'frontend-dev');
    });
  });

  // 4. Portfolio Projects
  describe('Projects Endpoints (/api/projects)', () => {
    it('should retrieve portfolio project catalogue', async () => {
      const res = await request(app).get('/api/projects');
      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      assert.ok(Array.isArray(res.body.data.projects));
    });
  });

  // 5. Auth validation & security
  describe('Auth Validation Endpoints (/api/auth)', () => {
    it('should reject registration with invalid email format', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Invalid User',
          email: 'not-an-email',
          password: 'Password123!',
        });

      assert.equal(res.status, 400);
      assert.equal(res.body.success, false);
    });

    it('should reject login without password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@university.edu',
        });

      assert.equal(res.status, 400);
      assert.equal(res.body.success, false);
    });

    it('should reject protected route without auth token', async () => {
      const res = await request(app).get('/api/auth/me');
      assert.equal(res.status, 401);
      assert.equal(res.body.success, false);
    });
  });

  // 6. 404 Handler
  describe('Not Found 404 Handler', () => {
    it('should return structured 404 for unknown endpoints', async () => {
      const res = await request(app).get('/api/non-existent-endpoint-xyz');
      assert.equal(res.status, 404);
      assert.equal(res.body.success, false);
      assert.ok(res.body.message.includes('Endpoint not found'));
    });
  });
});
