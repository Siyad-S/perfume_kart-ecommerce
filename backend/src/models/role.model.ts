import mongoose from 'mongoose';
import { RoleType } from '../types/role.types';

const roleSchema = new mongoose.Schema<RoleType>(
  {
    name: { type: String, required: true },
    permissions: [{ type: String, required: true }],
  },
  {
    collection: 'roles',
    timestamps: true,
  },
);

export const Role: mongoose.Model<RoleType> =
  mongoose.models.Role || mongoose.model<RoleType>('role', roleSchema);
