import { Role } from './enums';

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