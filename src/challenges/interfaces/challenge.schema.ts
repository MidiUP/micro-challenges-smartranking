import mongoose from 'mongoose';

export const ChallengeSchema = new mongoose.Schema(
  {
    dateHourChallenge: { type: Date },
    status: { type: String },
    dateHourRequest: { type: Date },
    dateHourResponse: { type: Date },
    requester: { type: mongoose.Schema.Types.ObjectId },
    category: { type: mongoose.Schema.Types.ObjectId },
    players: [{ type: mongoose.Schema.Types.ObjectId }],
    match: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Match',
    },
  },
  { timestamps: true, collection: 'Challenges' },
);
