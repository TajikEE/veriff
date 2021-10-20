import { Document } from 'mongoose';
import { Types } from 'mongoose';

export interface User extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  verification: string;
  verified: boolean;
  verifiedAge: boolean;
  verificationExpires: Date;
  loginAttempts?: number;
  blockExpires?: Date;
}
