import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Dummy suggestions data for demonstration
  const suggestions = [
    "Consider adding more details about your project experience.",
    "Update your skills section to include the latest technologies.",
    "Reformat your resume for better readability.",
  ];
  return NextResponse.json({ suggestions });
}
