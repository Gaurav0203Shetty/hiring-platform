interface WeightedSkill {
  skill: string;
  weight: number;
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
    // Check if candidate has this skill
    const candidateSkill = candidateSkills.find(
      (cs) => cs.skill.toLowerCase() === jobSkill.skill.toLowerCase()
    );
    if (candidateSkill) {
      // Use min of jobSkill.weight & candidateSkill.weight, or a more advanced approach
      matchedWeight += Math.min(candidateSkill.weight, jobSkill.weight);
    }
  }

  return (matchedWeight / totalWeight) * 100;
}

export function calculateTextSimilarity(candidateText: string, jobText: string): number {
  const candidateWords = candidateText.toLowerCase().split(/\s+/);
  const jobWords = jobText.toLowerCase().split(/\s+/);

  // Create frequency maps
  const candidateFreq: Record<string, number> = {};
  for (const word of candidateWords) {
    candidateFreq[word] = (candidateFreq[word] || 0) + 1;
  }
  const jobFreq: Record<string, number> = {};
  for (const word of jobWords) {
    jobFreq[word] = (jobFreq[word] || 0) + 1;
  }

  // Dot product
  let dotProduct = 0;
  const allWords = new Set([...Object.keys(candidateFreq), ...Object.keys(jobFreq)]);
  for (const w of allWords) {
    const cVal = candidateFreq[w] || 0;
    const jVal = jobFreq[w] || 0;
    dotProduct += cVal * jVal;
  }

  // Magnitudes
  const magCandidate = Math.sqrt(
    Object.values(candidateFreq).reduce((sum, val) => sum + val * val, 0)
  );
  const magJob = Math.sqrt(
    Object.values(jobFreq).reduce((sum, val) => sum + val * val, 0)
  );

  if (magCandidate === 0 || magJob === 0) return 0;

  return (dotProduct / (magCandidate * magJob)) * 100;
}

export function calculateAdvancedMatch(
  candidateSkills: WeightedSkill[],
  jobSkills: WeightedSkill[],
  candidateText: string,
  jobText: string
): number {
  const weightedScore = calculateWeightedMatch(candidateSkills, jobSkills); // 0-100
  const textScore = calculateTextSimilarity(candidateText, jobText); // 0-100

  // Weighted combination (e.g., 70% skill-based, 30% text-based)
  return weightedScore * 0.7 + textScore * 0.3;
}

export function calculateSkillGap(candidateSkills: string[], jobSkills: string[]): string[] {
  // Return skills that are required by the job but missing from the candidate’s skill set.
  return jobSkills.filter(skill => !candidateSkills.includes(skill));
}
