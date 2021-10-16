import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';

export const KycSchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    sessionId: {
      type: String,
      required: true,
    },
    url: {
      type: String,
    }
  },
  {
    timestamps: true,
  },
);
