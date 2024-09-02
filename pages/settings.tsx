import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { User } from '../types';
import TwoFactorSetup from '../components/TwoFactorSetup';

const Settings: React.FC = () => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      await updateUserSettings(user);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <h1>User Settings</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Age Range:
          <input
            type="number"
            name="preferences.ageRange.min"
            value={user.preferences.ageRange.min}
            onChange={handleInputChange}
          />
          -
          <input
            type="number"
            name="preferences.ageRange.max"
            value={user.preferences.ageRange.max}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Preferred Gender:
          <select
            name="preferences.gender"
            value={user.preferences.gender}
            onChange={handleInputChange}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </label>
        <label>
          Maximum Distance:
          <input
            type="number"
            name="preferences.distance"
            value={user.preferences.distance}
            onChange={handleInputChange}
          />
          km
        </label>
        <button type="submit">Save Settings</button>
      </form>
      <TwoFactorSetup />
    </div>
  );
};

export default Settings;

async function fetchUserData(userId: string): Promise<User> {
  const response = await fetch(`/api/user/${userId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch user data');
  }
  return response.json();
}

async function updateUserSettings(user: User): Promise<void> {
  const response = await fetch(`/api/user/${user.telegramId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });
  if (!response.ok) {
    throw new Error('Failed to update user settings');
  }
}