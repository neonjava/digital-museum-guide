import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export type UserRole = 'SUPER_ADMIN' | 'MUSEUM_ADMIN' | 'EDITOR';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  museumId?: mongoose.Types.ObjectId;
  isActive: boolean;
  comparePassword(candidatePassword: string): Promise<boolean>;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 6 },
    role: {
      type: String,
      enum: ['SUPER_ADMIN', 'MUSEUM_ADMIN', 'EDITOR'],
      default: 'MUSEUM_ADMIN',
    },
    museumId: { type: Schema.Types.ObjectId, ref: 'Museum' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>('User', UserSchema);
