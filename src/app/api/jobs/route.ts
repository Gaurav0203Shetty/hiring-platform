import { NextResponse } from 'next/server';

const dummyJobs = [
  { id: 'job1', title: 'Frontend Developer', requiredSkills: 'javascript, react, html, css' },
  { id: 'job2', title: 'Backend Developer', requiredSkills: 'node.js, express, mongodb' },
];

export async function GET() {
  return NextResponse.json(dummyJobs);
}
