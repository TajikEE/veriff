import { Document } from 'mongoose';
import { Types } from 'mongoose';

export interface Wallet extends Document {
  _id: Types.ObjectId;
  userId: string;
  network: string;
  balance: number;
}
