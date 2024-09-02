import { User } from '../types';

type Variant = 'A' | 'B';

export function assignVariant(userId: string, experimentName: string): Variant {
  // Use a hash function to consistently assign users to variants
  const hash = hashCode(userId + experimentName);
  return hash % 2 === 0 ? 'A' : 'B';
}

export function trackEvent(userId: string, experimentName: string, eventName: string) {
  // Implement event tracking logic here
  // This could involve sending data to an analytics service or storing it in your database
  console.log(`User ${userId} in experiment ${experimentName} triggered event ${eventName}`);
}

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}