import { ChallengeStatus } from './challenge-status.enum';
import { Document } from 'mongoose';

export interface Challenge extends Document {
  dateHourChallenge: Date;
  status: ChallengeStatus;
  dateHourRequest: Date;
  dateHourResponse: Date;
  requester: string;
  category: string;
  players: string[];
  match?: string;
}
