import mongoose from 'mongoose';
import { FileType } from '../types/file.types';

const fileSchema = new mongoose.Schema<FileType>(
    {
        result: {
            type: Object,
            required: true,
        },
        is_deleted: { type: Boolean, default: false },
        created_at: { type: Date, default: Date.now },
        updated_at: { type: Date, default: Date.now },
    },
    {
        collection: 'files',
        timestamps: false,
    },
);

const File: mongoose.Model<FileType> =
    mongoose.models.File ||
    mongoose.model<FileType>('file', fileSchema);

export default File;
