import OpenAI from 'openai';
import { config } from '../config/env.js';

let openaiClient = null;

if (config.openai.apiKey) {
  openaiClient = new OpenAI({
    apiKey: config.openai.apiKey,
  });
}

export const aiService = {
  isConfigured() {
    return Boolean(openaiClient);
  },

  async generateCareerGuidance(profile) {
    const {
      targetRole = 'Software Engineer',
      weeklyHours = 15,
      missingSkills = [],
      existingSkills = [],
      educationLevel = "Bachelor's Degree",
      degree = 'Computer Science',
      interests = [],
    } = profile;

    // 1. If OpenAI API key is configured, use live LLM
    if (openaiClient) {
      try {
        const prompt = `
You are an expert tech career advisor for university students.
Student Profile:
- Target Role: ${targetRole}
- Available Hours: ${weeklyHours} hrs/week
- Degree: ${degree} (${educationLevel})
- Existing Skills: ${(existingSkills || []).map((s) => (s.name || s)).join(', ') || 'Foundational programming'}
- Missing / Skill Gaps: ${(missingSkills || []).map((s) => (s.name || s)).join(', ') || 'Advanced frameworks'}
- Interests: ${(interests || []).join(', ') || 'Software Development'}

Generate JSON response with:
1. "advice": 2-3 sentences of crisp, encouraging, actionable career advice.
2. "keyStrengths": Array of 3 specific positive strengths based on their profile.
3. "suggestedWeeklyRoutine": Array of 3 distinct weekly tasks with hour allocations summing to ${weeklyHours}.
4. "topMilestone": One concrete milestone project to achieve next.

Return ONLY valid JSON.
`;

        const completion = await openaiClient.chat.completions.create({
          model: config.openai.model,
          messages: [{ role: 'user', content: prompt }],
          response_format: { type: 'json_object' },
          temperature: 0.7,
          max_tokens: 600,
        });

        const parsed = JSON.parse(completion.choices[0].message.content);
        return {
          source: 'OpenAI GPT-4o-mini (Live AI Engine)',
          advice: parsed.advice,
          keyStrengths: parsed.keyStrengths,
          suggestedWeeklyRoutine: parsed.suggestedWeeklyRoutine,
          topMilestone: parsed.topMilestone,
          configured: true,
        };
      } catch (error) {
        console.warn('[AI Service Warning] OpenAI call failed, falling back to rule engine:', error.message);
      }
    }

    // 2. High-quality Rule-based Intelligent Engine Fallback
    const keyGaps =
      (missingSkills || []).slice(0, 3).map((s) => s.name || s).join(', ') ||
      'Production system design and automated testing';

    return {
      source: 'SkillPath Intelligent Rule Engine',
      advice: `Based on your target of ${targetRole}, dedicating ${weeklyHours} hours/week is a solid pace. Your highest-leverage learning investment right now should focus on: ${keyGaps}. Prioritize building 2 complete capstone projects over watching long tutorial playlists.`,
      keyStrengths: [
        'Clear learning commitment with realistic weekly allocation',
        'Strong baseline logic and analytical foundations',
        'Direct alignment with current tech market demand',
      ],
      suggestedWeeklyRoutine: [
        `Devote ${Math.round(weeklyHours * 0.4)} hours to focused core concept practice (${keyGaps.split(',')[0] || 'Core principles'}).`,
        `Devote ${Math.round(weeklyHours * 0.35)} hours to hands-on project implementation with Git commits.`,
        `Devote ${Math.max(2, Math.round(weeklyHours * 0.25))} hours to code review, documentation, and technical interview questions.`,
      ],
      topMilestone: `Build and deploy a full-stack portfolio application demonstrating ${keyGaps.split(',')[0] || 'modern tech'}.`,
      configured: Boolean(openaiClient),
      notice: openaiClient
        ? 'Generated with live AI fallback.'
        : 'Running on SkillPath deterministic rule engine. Add OPENAI_API_KEY in server/.env for generative LLM outputs.',
    };
  },
};
