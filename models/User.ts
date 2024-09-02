import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  telegramId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  bio: { type: String },
  interests: [String],
  photos: [String],
  preferences: {
    ageRange: { min: Number, max: Number },
    gender: String,
    distance: Number,
  },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] },
  },
  swipes: [{
    userId: { type: String, required: true },
    liked: { type: Boolean, required: true },
    timestamp: { type: Date, default: Date.now }
  }],
  blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  subscription: {
    type: String,
    enum: ['free', 'premium'],
    default: 'free'
  },
  subscriptionExpiresAt: Date
});

UserSchema.index({ location: '2dsphere' });

export const User = mongoose.model('User', UserSchema);