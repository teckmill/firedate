import mongoose from 'mongoose';

const ModerationTaskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  contentType: { type: String, enum: ['photo', 'bio'], required: true },
  content: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  moderatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  moderatedAt: Date,
  createdAt: { type: Date, default: Date.now },
});

export const ModerationTask = mongoose.model('ModerationTask', ModerationTaskSchema);