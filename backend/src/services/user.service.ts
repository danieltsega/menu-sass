import { User } from '../models';
import { Role } from '../types/enums';
import { getPaginationParams, getPaginationMeta } from '../utils/pagination';

export const getUsers = async (page?: number, limit?: number) => {
  const pagination = getPaginationParams(page, limit);
  const [users, total] = await Promise.all([
    User.find().sort({ createdAt: -1 }).skip(pagination.skip).limit(pagination.limit),
    User.countDocuments(),
  ]);
  return { users, pagination: getPaginationMeta(total, pagination) };
};

export const getUserById = async (id: string) => {
  const user = await User.findById(id);
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

export const createUser = async (data: {
  name: string;
  email: string;
  password: string;
  role: Role;
  isActive?: boolean;
}) => {
  const existing = await User.findOne({ email: data.email });
  if (existing) {
    throw new Error('Email already in use');
  }

  const user = await User.create(data);
  return user;
};

export const updateUser = async (
  id: string,
  data: Partial<{ name: string; email: string; password: string; role: Role; isActive: boolean }>
) => {
  const user = await User.findById(id);
  if (!user) {
    throw new Error('User not found');
  }

  if (data.email && data.email !== user.email) {
    const existing = await User.findOne({ email: data.email, _id: { $ne: id } });
    if (existing) {
      throw new Error('Email already in use');
    }
  }

  Object.assign(user, data);
  await user.save();

  return user;
};

export const deleteUser = async (id: string) => {
  const user = await User.findByIdAndDelete(id);
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};