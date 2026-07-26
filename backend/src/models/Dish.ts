import mongoose, { Schema, Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface IDish {
  _id: string;
  name: string;
  description?: string;
  ingredients: string[];
  price: number;
  image?: string;
  category: string;
  cafe: string;
  isAvailable: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IDishDocument extends IDish, Document<string> {}

const dishSchema = new Schema<IDishDocument>(
  {
    _id: { type: String, default: () => uuidv4() },
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    ingredients: [{ type: String, trim: true }],
    price: { type: Number, required: true, min: 0 },
    image: { type: String },
    category: { type: String, ref: 'Category', required: true },
    cafe: { type: String, ref: 'Cafe', required: true },
    isAvailable: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

dishSchema.index({ cafe: 1, category: 1 });
dishSchema.index({ cafe: 1, isAvailable: 1 });

const Dish = mongoose.model<IDishDocument>('Dish', dishSchema);

export default Dish;