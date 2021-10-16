import { Document } from 'mongoose';
import { Types } from 'mongoose';
import { User } from 'src/users/interfaces/user.interface';

export interface Kyc extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  sessionId: string;
  url: string;
}
