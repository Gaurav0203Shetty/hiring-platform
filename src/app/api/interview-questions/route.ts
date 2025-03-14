import { NextResponse } from 'next/server';

// Dummy interview questions generator
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const jobId = searchParams.get('jobId');
  // In a real implementation, you'd look up the job details (description, skills, etc.)
  // and call an AI service to generate questions. For now, we return dummy questions.
  const questions = [
    "Tell me about a challenging project you worked on.",
    "How do you stay updated with the latest industry trends?",
    "Can you explain a difficult technical concept to a non-technical person?",
  ];
  return NextResponse.json({ jobId, questions });
}
