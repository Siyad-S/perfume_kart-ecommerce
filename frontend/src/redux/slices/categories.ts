import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
    category: string | null;
}

const initialState: AuthState = {
    category: null,
};

const categoriesSlice = createSlice({
    name: "categories",
    initialState,
    reducers: {
        setCategory: (state, action: PayloadAction<string | null>) => {
            state.category = action.payload;
        },
    },
});

export const { setCategory } = categoriesSlice.actions;
export default categoriesSlice.reducer;
