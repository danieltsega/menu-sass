import mongoose, { Schema, Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface ICategory {
  _id: string;
  name: string;
  description?: string;
  displayOrder: number;
  cafe: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICategoryDocument extends ICategory, Document<string> {}

const categorySchema = new Schema<ICategoryDocument>(
  {
    _id: { type: String, default: () => uuidv4() },
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    displayOrder: { type: Number, default: 0 },
    cafe: { type: String, ref: 'Cafe', required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

categorySchema.index({ cafe: 1, displayOrder: 1 });

const Category = mongoose.model<ICategoryDocument>('Category', categorySchema);

export default Category;