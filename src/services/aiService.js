import { aiApi } from './api';

export const AIService = {
  async getStatus() {
    try {
      const res = await aiApi.getStatus();
      return res.data;
    } catch (e) {
      return {
        activeProvider: 'rule-engine',
        providerName: 'SkillPath Intelligent Engine (Offline Mode)',
        model: 'Deterministic Semantic Engine',
        isLive: false,
      };
    }
  },

  async generateCareerAdvice(assessmentProfile) {
    try {
      const res = await aiApi.getGuidance(assessmentProfile);
      if (res && res.data) {
        return res.data;
      }
    } catch (err) {
      console.warn('[AIService] Backend AI guidance request failed, using local intelligence:', err.message);
    }

    // High quality client-side fallback
    const { targetRole = 'Software Engineer', weeklyHours = 15, missingSkills = [] } = assessmentProfile || {};
    const keyGaps = (missingSkills || []).slice(0, 3).map((s) => s.name || s).join(', ') || 'Framework architecture and automated testing';

    return {
      source: 'SkillPath Intelligent Engine (Demo / Offline Mode)',
      advice: `Based on your profile and target of ${targetRole}, dedicating ${weeklyHours} hours/week is a solid pace. Your highest-leverage learning investment right now should focus on: ${keyGaps}. Prioritize building 2 complete capstone projects over watching long tutorial playlists.`,
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
      notice: 'Connect your free Google Gemini API key in Settings to activate real-time generative advice.',
    };
  },

  async generateCustomRoadmap(params) {
    try {
      const res = await aiApi.generateRoadmap(params);
      if (res && res.data) {
        return res.data;
      }
    } catch (err) {
      console.warn('[AIService] Backend AI roadmap request failed:', err.message);
    }

    return null;
  },

  async reviewATSResume(cvData, targetRole) {
    try {
      const res = await aiApi.reviewCV(cvData, targetRole);
      if (res && res.data) {
        return res.data;
      }
    } catch (err) {
      console.warn('[AIService] Backend AI resume review failed:', err.message);
    }

    return null;
  },

  async askCareerAssistant(question, context, targetCareer) {
    try {
      const res = await aiApi.askAssistant(question, context, targetCareer);
      if (res && res.data) {
        return res.data;
      }
    } catch (err) {
      console.warn('[AIService] Backend AI chat request failed:', err.message);
    }

    return null;
  },

  async configureKey(apiKey, provider = 'gemini', model = 'gemini-1.5-flash') {
    return aiApi.configure(apiKey, provider, model);
  },
};
