import React, { useState } from 'react';
import { useSession } from 'next-auth/react';

const SubscriptionManager: React.FC = () => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!session?.user) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: session.user.id, subscriptionType: 'premium' }),
      });

      if (response.ok) {
        alert('Successfully subscribed to premium!');
        // Refresh the session or update the user state as needed
      } else {
        throw new Error('Failed to subscribe');
      }
    } catch (error) {
      console.error('Error subscribing:', error);
      alert('Failed to subscribe. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>Subscription</h2>
      <p>Current plan: {session?.user.subscription || 'Free'}</p>
      {session?.user.subscription !== 'premium' && (
        <button onClick={handleSubscribe} disabled={isLoading}>
          {isLoading ? 'Processing...' : 'Upgrade to Premium'}
        </button>
      )}
      <ul>
        <li>Unlimited swipes</li>
        <li>See who liked you</li>
        <li>Advanced filters</li>
        {/* Add more premium features */}
      </ul>
    </div>
  );
};

export default SubscriptionManager;