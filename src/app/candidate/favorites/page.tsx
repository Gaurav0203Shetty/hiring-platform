'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CandidateFavorites() {
  const { data: session, status } = useSession();
  const [favorites, setFavorites] = useState<any[]>([]);

  useEffect(() => {
    async function fetchFavorites() {
      if (!session || !session.user?.id) return;
      try {
        const res = await fetch(`/api/favorites?candidateId=${session.user.id}`);
        const data = await res.json();
        setFavorites(data);
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    }
    fetchFavorites();
  }, [session]);

  if (status === 'loading') return <p>Loading...</p>;
  if (!session || session.user?.role !== 'CANDIDATE') return <p>Access Denied</p>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">My Favorite Jobs</h1>
      {favorites.length === 0 ? (
        <p>No favorite jobs yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {favorites.map((fav) => (
            <Card key={fav.id} className="shadow-lg">
              <CardHeader>
                <CardTitle>{fav.job.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">Description: {fav.job.description}</p>
                <p className="text-sm text-gray-600">Required Skills: {fav.job.requiredSkills}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
