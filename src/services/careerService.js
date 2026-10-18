import { CAREERS } from '../data/careers';

export const CareerService = {
  getAllCareers() {
    return CAREERS;
  },

  getCareerById(id) {
    return CAREERS.find(c => c.id === id) || CAREERS[0];
  },

  // Calculate career recommendation matches based on user assessment input
  evaluateAssessment(formData = {}, userSkills = []) {
    const {
      educationLevel = '',
      degreeField = '',
      existingSkills = [],
      interests = [],
      preferredWorkEnv = '',
      careerGoal = '',
      weeklyHours = 15
    } = formData;

    const userSkillNames = (existingSkills || []).map(s =>
      (typeof s === 'string' ? s.toLowerCase().trim() : (s.name || '').toLowerCase().trim())
    ).filter(Boolean);

    const userInterestList = (interests || []).map(i =>
      (typeof i === 'string' ? i.toLowerCase().trim() : '')
    ).filter(Boolean);

    const degreeLower = (degreeField || '').toLowerCase();

    const scoredCareers = CAREERS.map(career => {
      // Dynamic baseline: starts low (15%) so every skill selected visibly boosts the score
      let score = 15;
      const matchReasons = [];

      // 1. Education Stage (+5 pts if chosen)
      if (educationLevel) {
        score += 5;
      }

      // 2. Degree Alignment (+8 to +15 pts)
      if (degreeLower) {
        const titleLower = career.title.toLowerCase();
        const catLower = career.category.toLowerCase();
        const isCsSoftware = degreeLower.includes('computer science') || degreeLower.includes('software') || degreeLower.includes('programming') || degreeLower.includes('cs') || degreeLower.includes('it');
        const isDataAi = degreeLower.includes('data') || degreeLower.includes('ai') || degreeLower.includes('artificial intelligence') || degreeLower.includes('machine learning') || degreeLower.includes('stat');
        const isDesign = degreeLower.includes('design') || degreeLower.includes('ui') || degreeLower.includes('ux') || degreeLower.includes('graphic') || degreeLower.includes('multimedia') || degreeLower.includes('arts');
        const isDevopsCloud = degreeLower.includes('cloud') || degreeLower.includes('devops') || degreeLower.includes('network') || degreeLower.includes('system') || degreeLower.includes('security');

        if (
          (isCsSoftware && (catLower.includes('software') || titleLower.includes('developer') || titleLower.includes('engineer'))) ||
          (isDataAi && (catLower.includes('data') || titleLower.includes('data') || titleLower.includes('ai'))) ||
          (isDesign && (titleLower.includes('designer') || titleLower.includes('ui/ux'))) ||
          (isDevopsCloud && (titleLower.includes('cloud') || titleLower.includes('devops')))
        ) {
          score += 15;
          matchReasons.push(`Your background in ${degreeField} directly aligns with ${career.title}.`);
        } else {
          score += 8;
          matchReasons.push(`Skills from ${degreeField} provide a transferable technical foundation.`);
        }
      }

      // 3. Technical Interests Match (up to 16 pts)
      const matchedInterests = career.matchFactors.interests.filter(int =>
        userInterestList.some(userInt => userInt && (userInt.includes(int.toLowerCase()) || int.toLowerCase().includes(userInt)))
      );
      if (matchedInterests.length > 0) {
        const interestPoints = Math.min(16, matchedInterests.length * 8);
        score += interestPoints;
        matchReasons.push(`Strong alignment with your interest in ${matchedInterests.join(', ')}.`);
      }

      // 4. Existing Skills Match (PRIMARY FACTOR - up to 52 pts!)
      const matchedSkills = [];
      const missingSkills = [];

      career.requiredSkills.forEach(req => {
        const reqLower = req.name.toLowerCase();
        const found = userSkillNames.some(userSk => userSk && (reqLower.includes(userSk) || userSk.includes(reqLower)));
        if (found) {
          matchedSkills.push(req);
        } else {
          missingSkills.push(req);
        }
      });

      const skillMatchRatio = matchedSkills.length / Math.max(1, career.requiredSkills.length);
      const skillPoints = Math.round(skillMatchRatio * 52);
      score += skillPoints;

      // Bonus points for keyword matches in custom skills
      const keywordMatches = (career.matchFactors.keyKeywords || []).filter(kw =>
        userSkillNames.some(userSk => userSk && (userSk.includes(kw) || kw.includes(userSk)))
      );
      if (keywordMatches.length > 0) {
        score += Math.min(8, keywordMatches.length * 2);
      }

      if (matchedSkills.length > 0) {
        matchReasons.push(`You already possess ${matchedSkills.length} core skill${matchedSkills.length > 1 ? 's' : ''}: ${matchedSkills.slice(0, 3).map(s => s.name).join(', ')}.`);
      }

      // 5. Work Environment Match (up to 6 pts)
      if (preferredWorkEnv && career.matchFactors.workEnv.some(env => env.toLowerCase().includes(preferredWorkEnv.toLowerCase()))) {
        score += 6;
        matchReasons.push(`Matches your preferred ${preferredWorkEnv} setup.`);
      }

      // Weekly Hours Feasibility
      const hours = Number(weeklyHours) || 15;
      let estimatedWeeksToReady = Math.round((missingSkills.length * 24) / Math.max(5, hours));
      if (estimatedWeeksToReady < 4) estimatedWeeksToReady = 4;
      if (estimatedWeeksToReady > 52) estimatedWeeksToReady = 52;

      // Dynamic percentage scale: 15% (unselected) to 98% (strong match)
      const finalScore = Math.min(98, Math.max(15, Math.round(score)));

      return {
        ...career,
        matchScore: finalScore,
        matchReasons: matchReasons.length > 0 ? matchReasons : [`Select your education and skills to calculate your exact readiness score.`],
        matchedSkills,
        missingSkills,
        estimatedWeeksToReady,
        hoursPerWeek: hours
      };
    });

    // Sort by match score descending
    scoredCareers.sort((a, b) => b.matchScore - a.matchScore);
    return scoredCareers;
  },

  // Calculate student career readiness score (0-100)
  calculateReadiness(targetCareerId, skills = [], roadmaps = {}) {
    const career = this.getCareerById(targetCareerId);
    if (!career) return { overall: 65, skillsRatio: 60, roadmapRatio: 70, gapCount: 3 };

    // 1. Skill coverage score
    const required = career.requiredSkills || [];
    let acquiredPoints = 0;
    let totalTargetPoints = 0;
    let missingCount = 0;

    required.forEach(req => {
      const found = skills.find(s => s.name.toLowerCase().includes(req.name.toLowerCase()) || req.name.toLowerCase().includes(s.name.toLowerCase()));
      totalTargetPoints += req.level * 20; // 1-5 scale mapped to 100
      if (found) {
        acquiredPoints += (found.currentLevel || 1) * 20;
        if ((found.currentLevel || 1) < req.level) {
          missingCount++;
        }
      } else {
        missingCount++;
      }
    });

    const skillsScore = totalTargetPoints > 0 ? Math.round((acquiredPoints / totalTargetPoints) * 100) : 60;

    // 2. Roadmap completion ratio
    let roadmapScore = 40;
    const roadmap = roadmaps[targetCareerId] || roadmaps['frontend-dev'];
    if (roadmap && roadmap.stages) {
      let totalTasks = 0;
      let completedTasks = 0;
      roadmap.stages.forEach(st => {
        (st.tasks || []).forEach(t => {
          totalTasks++;
          if (t.completed) completedTasks++;
        });
      });
      if (totalTasks > 0) {
        roadmapScore = Math.round((completedTasks / totalTasks) * 100);
      }
    }

    // Weighted Overall
    const overall = Math.min(99, Math.max(25, Math.round(skillsScore * 0.55 + roadmapScore * 0.45)));

    return {
      overall,
      skillsScore,
      roadmapScore,
      missingCount,
      targetCareerTitle: career.title
    };
  }
};
