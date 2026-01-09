
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { create } from "domain";

interface BrandState {
    brands: [];
    brand: string | null;
}

const initialState: BrandState = {
    brands: [],
    brand: null,
};

const brandSlice = createSlice({
    name: "brand",
    initialState,
    reducers: {
        setBrand: (state, action: PayloadAction<string | null>) => {
            state.brand = action.payload;
        },
    },
});

export const { setBrand } = brandSlice.actions;
export default brandSlice.reducer;
