import { Document } from 'mongoose';
import { Types } from 'mongoose';
export interface Kyc extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  sessionId: string;
  url: string;
}
