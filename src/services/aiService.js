/**
 * SkillPath AI - AI Integration Service
 * Pre-configured for client-side rule evaluation with pluggable backend LLM endpoint.
 * Never stores or exposes secrets in client-side code.
 */

const BACKEND_AI_URL = import.meta.env.VITE_AI_BACKEND_URL || null;

export const AIService = {
  // Check if live AI backend is configured
  isLiveBackendAvailable() {
    return Boolean(BACKEND_AI_URL);
  },

  /**
   * Request deep career guidance analysis
   * Falls back to intelligent client-side synthesis if backend is offline/unconfigured
   */
  async generateCareerAdvice(assessmentProfile) {
    if (this.isLiveBackendAvailable()) {
      try {
        const response = await fetch(`${BACKEND_AI_URL}/api/career-advice`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(assessmentProfile)
        });

        if (!response.ok) {
          throw new Error(`AI service responded with HTTP ${response.status}`);
        }

        const data = await response.json();
        return {
          source: 'Live AI Service',
          advice: data.advice,
          suggestedFocus: data.suggestedFocus
        };
      } catch (err) {
        console.warn('Live AI Backend request failed, falling back to local intelligence:', err.message);
        // Fall through to local simulation
      }
    }

    // High quality client-side synthesized intelligence
    await new Promise(res => setTimeout(res, 900)); // simulated realistic thinking latency

    const { targetRole = 'Software Engineer', weeklyHours = 15, missingSkills = [] } = assessmentProfile;

    const keyGaps = (missingSkills || []).slice(0, 3).map(s => s.name || s).join(', ') || 'Framework architecture and automated testing';

    return {
      source: 'SkillPath Intelligent Engine (Demo / Offline Mode)',
      advice: `Based on your profile and target of ${targetRole}, dedicating ${weeklyHours} hours/week is a solid pace. Your highest-leverage learning investment right now should focus on: ${keyGaps}. Prioritize building 2 complete capstone projects over watching long tutorial playlists.`,
      keyStrengths: [
        'Clear learning commitment with realistic weekly allocation',
        'Strong baseline logic and analytical foundations',
        'Direct alignment with current tech market demand'
      ],
      suggestedWeeklyRoutine: [
        `Devote 6 hours to focused core concept practice (${keyGaps.split(',')[0] || 'Core principles'}).`,
        'Devote 5 hours to hands-on project implementation with Git commits.',
        'Devote 4 hours to code review, documentation, and technical interview questions.'
      ],
      notice: 'Note: SkillPath AI operates in local offline intelligence mode. Connect an optional backend endpoint to enable live generative LLM responses.'
    };
  }
};
