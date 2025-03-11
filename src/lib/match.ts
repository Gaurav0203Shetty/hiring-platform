export function calculateMatchScore(candidateSkills: string[], jobSkills: string[]): number {
  if (jobSkills.length === 0) return 0;
  const matches = candidateSkills.filter(skill => jobSkills.includes(skill));
  return (matches.length / jobSkills.length) * 100;
}
