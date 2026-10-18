import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../src/app.js';
import { DataStorageService } from '../src/services/dataStorage.service.js';

describe('SkillPath AI - Persistent Data Storage & Export Verification Suite', () => {
  const timestamp = Date.now();
  const testUser1 = {
    name: 'Ayesha Khan',
    email: `ayesha.student.${timestamp}@example.edu`,
    password: 'SecurePassword123!',
    degree: 'Software Engineering',
    university: 'NUST Islamabad',
    targetCareer: 'frontend-dev'
  };

  const testUser2 = {
    name: 'Bilal Ahmed',
    email: `bilal.dev.${timestamp}@example.edu`,
    password: 'BilalPassword123!',
    degree: 'Data Science',
    university: 'FAST Lahore',
    targetCareer: 'ai-engineer'
  };

  let token1 = '';
  let user1Id = '';
  let token2 = '';
  let user2Id = '';

  // 1. User Registration & Password Hashing
  it('1. Should register User 1 and store securely in persistent database', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser1);

    assert.equal(res.status, 201);
    assert.equal(res.body.success, true);
    assert.ok(res.body.token, 'Should return JWT token');
    assert.equal(res.body.data.user.email, testUser1.email.toLowerCase());
    assert.equal(res.body.data.user.password, undefined, 'Password should never be exposed');
    assert.equal(res.body.data.user.passwordHash, undefined, 'Password hash should never be exposed');

    token1 = res.body.token;
    user1Id = res.body.data.user._id || res.body.data.user.id;
    assert.ok(user1Id, 'User 1 ID must exist');
  });

  // 2. Login verification
  it('2. Should log out and log back in verifying credentials against persistent database', async () => {
    // Attempt invalid password
    const failRes = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser1.email, password: 'WrongPasswordXYZ' });
    assert.equal(failRes.status, 401);

    // Correct password
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser1.email, password: testUser1.password });

    assert.equal(loginRes.status, 200);
    assert.equal(loginRes.body.success, true);
    assert.ok(loginRes.body.token);
    assert.equal(loginRes.body.data.user.email, testUser1.email.toLowerCase());
    token1 = loginRes.body.token;
  });

  // 3. Save Private User Data (Skills, Roadmaps, Jobs, CV)
  it('3. Should save skills, job applications, and CV details in the database', async () => {
    // Add custom skill
    const skillRes = await request(app)
      .post('/api/skills')
      .set('Authorization', `Bearer ${token1}`)
      .send({
        name: 'TypeScript Advanced',
        category: 'programming',
        currentLevel: 3,
        targetLevel: 5,
        progress: 65,
        hoursSpent: 28,
        notes: 'Generics and union types mastered'
      });

    assert.equal(skillRes.status, 201);
    assert.equal(skillRes.body.data.skill.name, 'TypeScript Advanced');

    // Add job application
    const jobRes = await request(app)
      .post('/api/jobs')
      .set('Authorization', `Bearer ${token1}`)
      .send({
        company: 'Systems Limited',
        position: 'Associate Frontend Engineer',
        location: 'Lahore (Hybrid)',
        type: 'Full-time',
        salary: 'PKR 120,000 / mo',
        status: 'Applied',
        notes: 'Submitted customized ATS CV and GitHub portfolio'
      });

    assert.equal(jobRes.status, 201);
    assert.equal(jobRes.body.data.job.company, 'Systems Limited');

    // Update CV details
    const cvRes = await request(app)
      .put('/api/cv')
      .set('Authorization', `Bearer ${token1}`)
      .send({
        personalInfo: {
          fullName: 'Ayesha Khan',
          email: testUser1.email,
          title: 'Frontend React Developer',
          location: 'Islamabad, Pakistan',
          summary: 'Driven undergraduate engineer with strong React and TypeScript experience.'
        },
        skills: {
          technical: ['JavaScript', 'TypeScript', 'HTML5', 'CSS3'],
          frameworks: ['React', 'Next.js', 'Redux Toolkit'],
          tools: ['Git', 'VS Code', 'Figma'],
          soft: ['Problem Solving', 'Teamwork', 'Communication']
        }
      });

    assert.equal(cvRes.status, 200);
    assert.equal(cvRes.body.data.cv.personalInfo.fullName, 'Ayesha Khan');
  });

  // 4. Register User 2 and Test Private Data Isolation
  it('4. Should strictly isolate private user data (User 2 cannot see User 1 data)', async () => {
    const reg2 = await request(app)
      .post('/api/auth/register')
      .send(testUser2);

    assert.equal(reg2.status, 201);
    token2 = reg2.body.token;
    user2Id = reg2.body.data.user._id || reg2.body.data.user.id;

    // User 2 queries skills
    const user2Skills = await request(app)
      .get('/api/skills')
      .set('Authorization', `Bearer ${token2}`);

    assert.equal(user2Skills.status, 200);
    const hasUser1Skill = user2Skills.body.data.skills.some(s => s.name === 'TypeScript Advanced');
    assert.equal(hasUser1Skill, false, 'User 2 should NOT see User 1 private skill');

    // User 2 queries jobs
    const user2Jobs = await request(app)
      .get('/api/jobs')
      .set('Authorization', `Bearer ${token2}`);

    assert.equal(user2Jobs.status, 200);
    const hasUser1Job = user2Jobs.body.data.jobs.some(j => j.company === 'Systems Limited');
    assert.equal(hasUser1Job, false, 'User 2 should NOT see User 1 private job application');
  });

  // 5. Export My Data Endpoint Verification
  it('5. Should export complete private data as valid JSON without sensitive credentials', async () => {
    const exportRes = await request(app)
      .get('/api/user/export')
      .set('Authorization', `Bearer ${token1}`);

    assert.equal(exportRes.status, 200);
    assert.equal(exportRes.body.success, true);
    assert.ok(exportRes.body.data, 'Export must have a data payload');

    const exported = exportRes.body.data;

    // Check structure
    assert.equal(exported.version, '1.0');
    assert.ok(exported.exportedAt);
    assert.ok(exported.user);
    assert.ok(Array.isArray(exported.skills));
    assert.ok(Array.isArray(exported.savedJobs));
    assert.ok(exported.cv);

    // Verify User 1's saved data is present
    const hasSkill = exported.skills.some(s => s.name === 'TypeScript Advanced');
    assert.equal(hasSkill, true, 'Export must contain user-saved skill');

    const hasJob = exported.savedJobs.some(j => j.company === 'Systems Limited');
    assert.equal(hasJob, true, 'Export must contain user-saved job');

    assert.equal(exported.cv.personalInfo.fullName, 'Ayesha Khan');

    // Requirement 6: Check that passwords and secret tokens are NOT present
    assert.equal(exported.user.password, undefined);
    assert.equal(exported.user.passwordHash, undefined);
    assert.equal(exported.user.token, undefined);
    assert.equal(exported.user.resetPasswordToken, undefined);

    const jsonString = JSON.stringify(exported);
    assert.equal(jsonString.includes('SecurePassword123!'), false, 'Password must not appear in exported JSON');
    assert.equal(jsonString.includes('passwordHash'), false, 'Password hash must not appear in exported JSON');
  });

  // 6. Test Persistence Across Server Restart Simulation
  it('6. Should preserve all data from disk after restarting persistent storage instance', async () => {
    // Re-instantiate DataStorageService (simulating server reboot)
    DataStorageService.loadFromDisk();

    const storedUser = await DataStorageService.findUserByEmail(testUser1.email);
    assert.ok(storedUser, 'User 1 must exist in reloaded storage');
    assert.equal(storedUser.name, testUser1.name);

    // Verify skills survived restart
    const skills = await DataStorageService.getSkills(user1Id);
    const tsSkill = skills.find(s => s.name === 'TypeScript Advanced');
    assert.ok(tsSkill, 'Skill must survive server restart');

    // Verify job applications survived restart
    const jobs = await DataStorageService.getJobApplications(user1Id);
    const jobApp = jobs.find(j => j.company === 'Systems Limited');
    assert.ok(jobApp, 'Job application must survive server restart');

    // Verify CV survived restart
    const cv = await DataStorageService.getCV(user1Id);
    assert.ok(cv, 'CV must survive server restart');
    assert.equal(cv.personalInfo.fullName, 'Ayesha Khan');
  });
});
