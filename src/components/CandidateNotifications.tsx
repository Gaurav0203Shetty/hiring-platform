'use client';

import { useEffect, useState } from 'react';
import Pusher from 'pusher-js';

export default function CandidateNotifications() {
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    // Initialize Pusher client with public credentials.
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'us2',
    });
    const channel = pusher.subscribe('candidate-channel');
    channel.bind('new-job', (data: any) => {
      setNotification(`New job posted: ${data.title}`);
      // Clear notification after 5 seconds.
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    });
    return () => {
      channel.unbind_all();
      pusher.unsubscribe('candidate-channel');
    };
  }, []);

  if (!notification) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded shadow-lg">
      {notification}
    </div>
  );
}
