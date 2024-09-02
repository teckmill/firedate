import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { User } from '../types';
import SwipeCard from './SwipeCard';
import { assignVariant, trackEvent } from '../lib/abTesting';

const SwipeInterface: React.FC = () => {
  const { data: session } = useSession();
  const [potentialMatches, setPotentialMatches] = useState<User[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [variant, setVariant] = useState<'A' | 'B'>('A');

  useEffect(() => {
    if (session?.user) {
      fetchPotentialMatches();
      const experimentVariant = assignVariant(session.user.id, 'swipe-card-layout');
      setVariant(experimentVariant);
    }
  }, [session]);

  const fetchPotentialMatches = async () => {
    const response = await fetch('/api/matches');
    if (response.ok) {
      const data = await response.json();
      setPotentialMatches(data);
    }
  };

  const handleSwipe = async (liked: boolean) => {
    if (currentIndex < potentialMatches.length) {
      const matchedUser = potentialMatches[currentIndex];
      await recordSwipe(session?.user.id, matchedUser.id, liked);
      setCurrentIndex(prevIndex => prevIndex + 1);
    }
  };

  if (currentIndex >= potentialMatches.length) {
    return <div>No more potential matches at the moment.</div>;
  }

  return (
    <div>
      {currentIndex < potentialMatches.length ? (
        <SwipeCard
          user={potentialMatches[currentIndex]}
          onSwipe={handleSwipe}
          onReport={(userId) => {/* Implement report logic */}}
          variant={variant}
        />
      ) : (
        <div>No more potential matches at the moment.</div>
      )}
    </div>
  );
};

export default SwipeInterface;

async function recordSwipe(userId: string, matchedUserId: string, liked: boolean): Promise<void> {
  await fetch('/api/swipe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, matchedUserId, liked }),
  });
}