import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';

export const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: 2,
      maxlength: 255,
      required: true,
    },
    email: {
      type: String,
      minlength: 5,
      maxlength: 255,
      required: [true, 'EMAIL_IS_BLANK'],
    },
    password: {
      type: String,
      minlength: 8,
      maxlength: 255,
      required: [true, 'PASSWORD_IS_BLANK'],
    },
    verification: {
      type: String,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    verifiedAge: {
      type: Boolean,
      default: false,
    },
    verificationExpires: {
      type: Date,
      default: Date.now,
    },
    loginAttempts: {
      type: Number,
      default: 0,
    },
    blockExpires: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

UserSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('password')) {
      return next();
    }
    const hashed = await bcrypt.hash(this['password'], 10);

    this['password'] = hashed;
    return next();
  } catch (err) {
    return next(err);
  }
});
