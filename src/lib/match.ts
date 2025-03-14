export interface WeightedSkill {
  skill: string;
  weight: number;
}

export interface MatchBreakdown {
  weightedScore: number;
  textScore: number;
  finalScore: number;
}

export function calculateWeightedMatch(
  candidateSkills: WeightedSkill[],
  jobSkills: WeightedSkill[]
): number {
  if (jobSkills.length === 0) return 0;
  let totalWeight = 0;
  let matchedWeight = 0;
  for (const jobSkill of jobSkills) {
    totalWeight += jobSkill.weight;
    const candidateSkill = candidateSkills.find(
      (cs) => cs.skill.toLowerCase() === jobSkill.skill.toLowerCase()
    );
    if (candidateSkill) {
      matchedWeight += Math.min(candidateSkill.weight, jobSkill.weight);
    }
  }
  return (matchedWeight / totalWeight) * 100;
}

export function calculateTextSimilarity(
  candidateText: string,
  jobText: string
): number {
  const candidateWords = candidateText.toLowerCase().split(/\s+/);
  const jobWords = jobText.toLowerCase().split(/\s+/);
  const candidateFreq: Record<string, number> = {};
  const jobFreq: Record<string, number> = {};
  
  candidateWords.forEach(word => {
    candidateFreq[word] = (candidateFreq[word] || 0) + 1;
  });
  jobWords.forEach(word => {
    jobFreq[word] = (jobFreq[word] || 0) + 1;
  });
  
  let dotProduct = 0;
  const allWords = new Set([...Object.keys(candidateFreq), ...Object.keys(jobFreq)]);
  allWords.forEach(word => {
    dotProduct += (candidateFreq[word] || 0) * (jobFreq[word] || 0);
  });
  
  const magCandidate = Math.sqrt(
    Object.values(candidateFreq).reduce((sum, val) => sum + val * val, 0)
  );
  const magJob = Math.sqrt(
    Object.values(jobFreq).reduce((sum, val) => sum + val * val, 0)
  );
  
  if (magCandidate === 0 || magJob === 0) return 0;
  return (dotProduct / (magCandidate * magJob)) * 100;
}

export function calculateAdvancedMatchBreakdown(
  candidateSkills: WeightedSkill[],
  jobSkills: WeightedSkill[],
  candidateText: string,
  jobText: string
): MatchBreakdown {
  const weightedScore = calculateWeightedMatch(candidateSkills, jobSkills);
  const textScore = calculateTextSimilarity(candidateText, jobText);
  const finalScore = weightedScore * 0.7 + textScore * 0.3;
  return { weightedScore, textScore, finalScore };
}
