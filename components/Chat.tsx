import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { db } from '../lib/firebase';
import { collection, addDoc, onSnapshot, query, where, orderBy } from 'firebase/firestore';

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
}

const Chat: React.FC<{ matchId: string }> = ({ matchId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user) {
      const q = query(
        collection(db, 'messages'),
        where('matchId', '==', matchId),
        orderBy('timestamp')
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const newMessages = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Message));
        setMessages(newMessages);
      });

      return () => unsubscribe();
    }
  }, [session, matchId]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() && session?.user) {
      await addDoc(collection(db, 'messages'), {
        content: inputMessage,
        senderId: session.user.id,
        matchId,
        timestamp: new Date()
      });
      setInputMessage('');
    }
  };

  return (
    <div>
      <div style={{ height: '400px', overflowY: 'scroll' }}>
        {messages.map((message) => (
          <div key={message.id}>
            <strong>{message.senderId === session?.user.id ? 'You' : 'Match'}:</strong> {message.content}
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chat;