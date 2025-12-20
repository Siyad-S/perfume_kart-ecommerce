import { FileUploadConfig } from "@/utils/cloudinary";
import mongoose from "mongoose";

export interface FileType {
  _id: mongoose.Types.ObjectId;
  result: {
    type: Object,
    required: true,
  },
  is_deleted: boolean;
  created_at: Date;
  updated_at: Date;
  uploadConfig?: FileUploadConfig
}
