
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

interface UploadResponse {
    message: string;
    logo?: { url: string };
    images?: { url: string }[];
}

interface BrandState {
    loading: boolean;
    error: string | null;
}

const initialState: BrandState = {
    loading: false,
    error: null,
};

// image file upload
export const uploadImage = createAsyncThunk<UploadResponse, FormData, { rejectValue: string }>(
    "file/uploadImage",
    async (formData: FormData, { rejectWithValue }) => {
        try {
            const res = await axios.post<UploadResponse>("http://localhost:5005/file/upload", formData, {
                // Update port to match your server (e.g., 5000)
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return res.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.error || "Failed to upload image");
            }
            return rejectWithValue("An unexpected error occurred");
        }
    }
);

const fileSlice = createSlice({
    name: "file",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(uploadImage.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(uploadImage.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
        });
        builder.addCase(uploadImage.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || "Unknown error";
        });
    }
});

// export const {  } = fileSlice.actions;
export default fileSlice.reducer;
