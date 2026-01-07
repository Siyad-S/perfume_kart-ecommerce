import mongoose from "mongoose";

export interface FileType {
  _id: mongoose.Types.ObjectId;
  result: {
    type: Object,
    required: true,
  },
  is_deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
