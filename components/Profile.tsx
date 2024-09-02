import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { User } from '../types';
import ImageUpload from './ImageUpload';
import { validateProfile } from '../lib/validation';

const Profile: React.FC = () => {
  const { data: session } = useSession();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (session?.user) {
      fetchUserData(session.user.id).then(setUser);
    }
  }, [session]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser(prevUser => prevUser ? { ...prevUser, [name]: value } : null);
  };

  const handlePhotoUpload = (photoUrl: string) => {
    setUser(prevUser => prevUser ? { ...prevUser, photos: [...prevUser.photos, photoUrl] } : null);
  };

  const handleBioChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newBio = e.target.value;
    setUser(prevUser => prevUser ? { ...prevUser, bio: newBio } : null);

    // Submit bio for moderation
    try {
      const response = await fetch('/api/moderation/bio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: session?.user.id, bio: newBio }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit bio for moderation');
      }

      alert('Your bio has been updated and is pending moderation.');
    } catch (error) {
      console.error('Error submitting bio for moderation:', error);
      alert('Failed to update bio');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      const errors = validateProfile(user);
      if (Object.keys(errors).length > 0) {
        // Display errors to the user
        console.error(errors);
        return;
      }
      await updateUserProfile(user);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        value={user.name}
        onChange={handleInputChange}
        placeholder="Name"
      />
      <textarea
        name="bio"
        value={user.bio}
        onChange={handleBioChange}
        placeholder="Bio"
      />
      <ImageUpload onUpload={handlePhotoUpload} />
      <div>
        {user.photos.map((photo, index) => (
          <img key={index} src={photo} alt={`User photo ${index + 1}`} style={{ width: 100, height: 100 }} />
        ))}
      </div>
      <button type="submit">Save Profile</button>
    </form>
  );
};

export default Profile;

async function fetchUserData(userId: string): Promise<User> {
  const response = await fetch(`/api/user/${userId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch user data');
  }
  return response.json();
}

async function updateUserProfile(user: User): Promise<void> {
  const response = await fetch(`/api/user/${user.telegramId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });
  if (!response.ok) {
    throw new Error('Failed to update user profile');
  }
}