import mongoose from 'mongoose';
import { RoleType } from '../types/role.types';

const roleSchema = new mongoose.Schema<RoleType>(
  {
    name: { type: String, required: true },
    permissions: [{ type: String, required: true }],
    is_deleted: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  },
  {
    collection: 'roles',
    timestamps: true,
  },
);

export const Role: mongoose.Model<RoleType> =
  mongoose.models.Role || mongoose.model<RoleType>('role', roleSchema);
