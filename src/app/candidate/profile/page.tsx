'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export default function CandidateProfile() {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState('');
  const [skills, setSkills] = useState('');

  useEffect(() => {
    if (session && session.user) {
      setProfile(session.user);
      setName(session.user.name || '');
      setSkills(session.user.skills || '');
    }
  }, [session]);

  async function handleSave() {
    try {
      const res = await fetch('/api/candidate/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidateId: session?.user?.id, name, skills }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to update profile');
      }
      const updatedProfile = await res.json();
      setProfile(updatedProfile);
      setEditMode(false);
    } catch (error: any) {
      console.error(error);
    }
  }

  if (status === 'loading') return <p>Loading...</p>;
  if (!session || session.user?.role !== 'CANDIDATE') return <p>Access Denied</p>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <Card className="max-w-lg mx-auto shadow-lg">
        <CardHeader>
          <CardTitle>My Profile</CardTitle>
        </CardHeader>
        <CardContent>
          {editMode ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full"
                />
              </div>
              <div>
                <Label htmlFor="skills" className="block text-sm font-medium text-gray-700">
                  Skills (comma-separated)
                </Label>
                <Input
                  id="skills"
                  type="text"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="mt-1 block w-full"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <Button onClick={handleSave}>Save</Button>
                <Button
                  onClick={() => setEditMode(false)}
                  variant="destructive"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p>
                <span className="font-medium">Name:</span> {profile?.name || 'Not set'}
              </p>
              <p>
                <span className="font-medium">Email:</span> {profile?.email}
              </p>
              <p>
                <span className="font-medium">Skills:</span> {profile?.skills || 'Not set'}
              </p>
              <Button onClick={() => setEditMode(true)} className="mt-4">
                Edit Profile
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
