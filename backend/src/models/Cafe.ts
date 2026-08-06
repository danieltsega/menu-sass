import mongoose, { Schema, Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface ICafe {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  address?: string;
  phone?: string;
  admin: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICafeDocument extends ICafe, Document<string> {}

const cafeSchema = new Schema<ICafeDocument>(
  {
    _id: { type: String, default: () => uuidv4() },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, trim: true },
    logo: { type: String },
    address: { type: String, trim: true },
    phone: { type: String, trim: true },
    admin: { type: String, ref: 'User', required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

cafeSchema.index({ admin: 1 });

const Cafe = mongoose.model<ICafeDocument>('Cafe', cafeSchema);

export default Cafe;