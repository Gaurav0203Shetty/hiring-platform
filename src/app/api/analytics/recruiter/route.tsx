import { NextResponse } from 'next/server';

const dummyAnalyticsData = [
  { jobTitle: 'Frontend Developer', applications: 10 },
  { jobTitle: 'Backend Developer', applications: 7 },
  { jobTitle: 'Full Stack Developer', applications: 5 },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const recruiterId = searchParams.get('recruiterId');
  if (!recruiterId) {
    return NextResponse.json({ error: 'Missing recruiterId parameter' }, { status: 400 });
  }
  // In a real app, query the database for analytics info here.
  return NextResponse.json(dummyAnalyticsData);
}
