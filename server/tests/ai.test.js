import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../src/app.js';
import { aiService } from '../src/services/ai.service.js';

describe('SkillPath AI — Google Gemini & Multi-Provider AI Engine Test Suite', () => {
  test('1. GET /api/ai/status should return provider information and supported models', async () => {
    const res = await request(app).get('/api/ai/status');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(res.body.data.activeProvider);
    assert.ok(Array.isArray(res.body.data.supportedModels));
    assert.ok(res.body.data.supportedModels.includes('gemini-1.5-flash'));
  });

  test('2. POST /api/ai/guidance should generate actionable career advice and study routine', async () => {
    const payload = {
      targetRole: 'Full-Stack Developer',
      weeklyHours: 15,
      educationLevel: "Bachelor's Degree",
      degree: 'Computer Science',
      existingSkills: ['JavaScript', 'HTML', 'CSS'],
      missingSkills: ['Node.js', 'PostgreSQL', 'Docker'],
      interests: ['Web Development', 'Cloud Architecture'],
    };

    const res = await request(app).post('/api/ai/guidance').send(payload);
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(res.body.data.advice);
    assert.ok(Array.isArray(res.body.data.keyStrengths));
    assert.ok(Array.isArray(res.body.data.suggestedWeeklyRoutine));
    assert.ok(res.body.data.topMilestone);
  });

  test('3. POST /api/ai/roadmap should generate a structured 3-stage learning roadmap', async () => {
    const payload = {
      targetRole: 'AI & Machine Learning Engineer',
      experienceLevel: 'Undergraduate Student',
      weeklyHours: 18,
      currentSkills: ['Python', 'Linear Algebra'],
      focusAreas: ['PyTorch', 'Data Processing', 'Transformer Models'],
    };

    const res = await request(app).post('/api/ai/roadmap').send(payload);
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(res.body.data.stages);
    assert.ok(res.body.data.stages.length >= 3);
    assert.ok(res.body.data.roadmapTitle);

    const firstStage = res.body.data.stages[0];
    assert.ok(firstStage.title);
    assert.ok(Array.isArray(firstStage.milestones));
    assert.ok(firstStage.milestones.length > 0);
  });

  test('4. POST /api/ai/cv-review should analyze ATS compatibility score and provide actionable feedback', async () => {
    const mockCV = {
      personal: {
        fullName: 'Hamza Khan',
        headline: 'Aspiring Full-Stack Software Engineer',
        email: 'hamza@example.com',
        phone: '+92 300 1234567',
        location: 'Karachi, Pakistan',
      },
      summary: 'Passionate computer science student looking for opportunities.',
      skills: ['React', 'JavaScript', 'Node.js', 'MongoDB', 'Git'],
      experience: [
        {
          company: 'Tech Solutions PK',
          position: 'Frontend Intern',
          period: 'Jun 2025 - Aug 2025',
          description: 'Worked on web pages and fixed bugs.',
        },
      ],
      projects: [
        {
          title: 'Campus Food Delivery Platform',
          description: 'Developed an order tracking app using React and Node.js.',
          technologies: ['React', 'Node.js', 'Express', 'MongoDB'],
        },
      ],
      education: [
        {
          degree: 'BS Computer Science',
          institution: 'FAST-NUCES',
          year: '2022 - 2026',
        },
      ],
    };

    const res = await request(app).post('/api/ai/cv-review').send({
      cvData: mockCV,
      targetRole: 'Full-Stack Developer',
    });

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(typeof res.body.data.atsScore === 'number');
    assert.ok(res.body.data.atsScore >= 0 && res.body.data.atsScore <= 100);
    assert.ok(res.body.data.ratingLabel);
    assert.ok(Array.isArray(res.body.data.strengths));
    assert.ok(Array.isArray(res.body.data.criticalGaps));
    assert.ok(Array.isArray(res.body.data.missingKeywords));
    assert.ok(res.body.data.improvedSummary);
  });

  test('5. POST /api/ai/chat should answer career and interview preparation queries', async () => {
    const payload = {
      question: 'What technical skills are most important for fresh graduate interviews at Systems Limited and Contour Software?',
      targetCareer: 'Software Engineer',
      context: {
        skills: ['JavaScript', 'React', 'Python'],
      },
    };

    const res = await request(app).post('/api/ai/chat').send(payload);
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(res.body.data.answer);
    assert.ok(res.body.data.answer.length > 50);
  });

  test('6. POST /api/ai/chat should reject requests with empty questions', async () => {
    const res = await request(app).post('/api/ai/chat').send({ question: '' });
    assert.equal(res.status, 400);
    assert.equal(res.body.success, false);
  });

  test('7. POST /api/ai/config should update runtime AI configuration safely', async () => {
    const res = await request(app).post('/api/ai/config').send({
      apiKey: 'test-demo-gemini-key',
      provider: 'gemini',
      model: 'gemini-1.5-flash',
    });

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.activeProvider, 'gemini');

    // Clean up runtime key back to normal
    aiService.setRuntimeKey({ apiKey: null, provider: 'gemini' });
  });
});
