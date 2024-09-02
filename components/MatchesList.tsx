import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { User } from '../types';
import Link from 'next/link';

const MatchesList: React.FC = () => {
  const { data: session } = useSession();
  const [matches, setMatches] = useState<User[]>([]);

  useEffect(() => {
    if (session?.user) {
      fetchMatches();
    }
  }, [session]);

  const fetchMatches = async () => {
    const response = await fetch('/api/matches');
    if (response.ok) {
      const data = await response.json();
      setMatches(data);
    }
  };

  return (
    <div>
      <h2>Your Matches</h2>
      {matches.map(match => (
        <div key={match.id}>
          <img src={match.photos[0]} alt={match.name} style={{ width: 50, height: 50 }} />
          <span>{match.name}</span>
          <Link href={`/chat/${match.id}`}>
            <a>Chat</a>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default MatchesList;