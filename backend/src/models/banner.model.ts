import mongoose from 'mongoose';
import { BannerType } from '@/types/banner.types';

const bannerSchema = new mongoose.Schema<BannerType>(
    {
        banner_url: { type: String, required: true },
        product_id: { type: mongoose.Types.ObjectId },
        category_id: { type: mongoose.Types.ObjectId },
        banner_text: { type: String, required: true },
        description: { type: String, required: true },
        home_slider: { type: Boolean, default: false },
        home_sub: { type: Boolean, default: false },
        category_listing: { type: Boolean, default: false },
        is_deleted: { type: Boolean, default: false },
    },
    {
        collection: 'banners',
        timestamps: true,
    },
);

const Banner: mongoose.Model<BannerType> =
    mongoose.models.Banner || mongoose.model<BannerType>('banner', bannerSchema);

export default Banner;
