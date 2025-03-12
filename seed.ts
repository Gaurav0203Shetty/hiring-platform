const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Insert a recruiter record for testing
  const recruiter = await prisma.user.create({
    data: {
      email: 'recruiter@example.com',
      password: 'recruiterpassword', // For testing only; in production, hash this!
      role: 'RECRUITER',
      name: 'Recruiter Test',
      skills: '', // Recruiters might not need skills
    },
  });
  console.log('Recruiter seeded successfully:', recruiter);

  // Insert a candidate record for testing
  const candidate = await prisma.user.create({
    data: {
      email: 'candidate@example.com',
      password: 'candidatepassword', // For testing only; in production, hash this!
      role: 'CANDIDATE',
      name: 'Candidate Test',
      skills: 'javascript, react, node.js', // Sample candidate skills
    },
  });
  console.log('Candidate seeded successfully:', candidate);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
