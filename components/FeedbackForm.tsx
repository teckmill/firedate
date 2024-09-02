import React, { useState } from 'react';
import { useSession } from 'next-auth/react';

const FeedbackForm: React.FC = () => {
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);
  const { data: session } = useSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (session?.user) {
      try {
        const response = await fetch('/api/feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: session.user.id, feedback, rating }),
        });
        if (response.ok) {
          alert('Thank you for your feedback!');
          setFeedback('');
          setRating(0);
        }
      } catch (error) {
        console.error('Error submitting feedback:', error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>We'd love to hear your feedback!</h2>
      <textarea
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        placeholder="Your feedback..."
        required
      />
      <div>
        <label>Rate your experience (1-5):</label>
        <input
          type="number"
          min="1"
          max="5"
          value={rating}
          onChange={(e) => setRating(parseInt(e.target.value))}
          required
        />
      </div>
      <button type="submit">Submit Feedback</button>
    </form>
  );
};

export default FeedbackForm;