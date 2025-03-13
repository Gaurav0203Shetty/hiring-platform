'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function RecruiterAnalytics() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const recruiterId = session?.user?.id;
  const [analyticsData, setAnalyticsData] = useState<any[]>([]);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session || session.user?.role !== 'RECRUITER') {
      router.push('/auth');
      return;
    }
    async function fetchAnalytics() {
      try {
        const res = await fetch(`/api/analytics/recruiter?recruiterId=${recruiterId}`);
        const data = await res.json();
        setAnalyticsData(data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      }
    }
    fetchAnalytics();
  }, [session, status, recruiterId, router]);

  // Fallback dummy data if API returns no analytics data
  const dummyData = [
    { jobTitle: 'Frontend Developer', applications: 10 },
    { jobTitle: 'Backend Developer', applications: 7 },
    { jobTitle: 'Full Stack Developer', applications: 5 },
  ];

  const dataToShow = analyticsData.length > 0 ? analyticsData : dummyData;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <Card className="shadow-lg max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Recruiter Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-gray-600">
            Overview of job applications for your postings.
          </p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dataToShow}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="jobTitle" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="applications" fill="#3182ce" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
