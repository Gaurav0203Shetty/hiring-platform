'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function MessagingPage() {
  const { data: session, status } = useSession();
  const [otherUserId, setOtherUserId] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    async function fetchMessages() {
      if (!session || !session.user?.id || !otherUserId) return;
      try {
        const res = await fetch(
          `/api/messages?senderId=${session.user.id}&receiverId=${otherUserId}`
        );
        const data = await res.json();
        setMessages(data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    }
    fetchMessages();
  }, [session, otherUserId, refresh]);

  async function sendMessage() {
    if (!session || !session.user?.id || !otherUserId || !newMessage) return;
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: session.user.id,
          receiverId: otherUserId,
          content: newMessage,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to send message');
      }
      setNewMessage('');
      setRefresh(!refresh); // trigger refresh of messages
    } catch (error: any) {
      console.error(error);
    }
  }

  if (status === 'loading') return <p>Loading...</p>;
  if (!session) return <p>Access Denied</p>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <Card className="max-w-3xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle>Messaging</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Label htmlFor="otherUserId" className="block text-sm font-medium text-gray-700">
              Other User ID:
            </Label>
            <Input
              id="otherUserId"
              type="text"
              value={otherUserId}
              onChange={(e) => setOtherUserId(e.target.value)}
              placeholder="Enter the other user's ID"
              className="mt-1 block w-full"
            />
          </div>
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Conversation:</h2>
            <div className="max-h-80 overflow-y-auto border p-4 rounded bg-white">
              {messages.length === 0 ? (
                <p>No messages yet.</p>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} className="mb-2">
                    <p>
                      <span className="font-bold">{msg.senderId === session.user.id ? 'You' : 'Them'}:</span>{' '}
                      {msg.content}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(msg.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="flex space-x-2">
            <Input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-grow"
            />
            <Button onClick={sendMessage}>Send</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
