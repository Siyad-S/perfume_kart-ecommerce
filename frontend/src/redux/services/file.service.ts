
import axios from "axios";

export interface UploadResponse {
    message: string;
    data?: {
        logo?: { url: string };
        images?: { url: string }[];
        banner?: {url: string}
        image?: { url: string };
    }
}

const baseUrl = process.env.NEXT_PUBLIC_API_URL

export const uploadFile = async (formData: FormData): Promise<UploadResponse> => {
    const res = await axios.post<UploadResponse>(`${baseUrl}/file/upload`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return res.data;
};
