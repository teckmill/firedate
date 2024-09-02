import { User } from '../types';

export function validateProfile(user: User): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!user.name || user.name.trim().length === 0) {
    errors.name = 'Name is required';
  }

  if (user.bio && user.bio.length > 500) {
    errors.bio = 'Bio must be 500 characters or less';
  }

  if (user.interests && user.interests.length > 10) {
    errors.interests = 'You can have a maximum of 10 interests';
  }

  if (user.photos && user.photos.length > 5) {
    errors.photos = 'You can upload a maximum of 5 photos';
  }

  // Add more validation rules as needed

  return errors;
}