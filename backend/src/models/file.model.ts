import mongoose from 'mongoose';
import { FileType } from '../types/file.types';

const fileSchema = new mongoose.Schema<FileType>(
    {
        result: {
            type: Object,
            required: true,
        },
        is_deleted: { type: Boolean, default: false },
    },
    {
        collection: 'files',
        timestamps: true,
    },
);

const File: mongoose.Model<FileType> =
    mongoose.models.File ||
    mongoose.model<FileType>('file', fileSchema);

export default File;
