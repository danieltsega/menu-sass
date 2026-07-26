import mongoose, { Schema, Model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { Role } from '../types/enums';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserDocument extends IUser, Document<string> {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

interface IUserModel extends Model<IUserDocument> {}

const userSchema = new Schema<IUserDocument, IUserModel>(
  {
    _id: { type: String, default: () => uuidv4() },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: Object.values(Role), required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const hash = await bcrypt.hash(this.password, 12);
  this.set('password', hash);
});

userSchema.methods.comparePassword = async function (
  this: IUserDocument,
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.set('toJSON', {
  transform: (_doc: IUserDocument, ret: Partial<IUser>) => {
    delete ret.password;
    return ret;
  },
});

const User = mongoose.model<IUserDocument, IUserModel>('User', userSchema);

export default User;