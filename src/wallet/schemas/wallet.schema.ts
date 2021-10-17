import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';

export const WalletSchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    network: {
      type: String,
      required: true,
    },
    balance: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);
