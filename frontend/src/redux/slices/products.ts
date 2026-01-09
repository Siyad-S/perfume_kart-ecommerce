import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ProductsState {
    filter: {
        best_seller: boolean;
        trending: boolean;
        new_launch: boolean;
    };
}

const initialState: ProductsState = {
    filter: {
        best_seller: false,
        trending: false,
        new_launch: false,
    },
};

const productsSlice = createSlice({
    name: "products",
    initialState,
    reducers: {
        setFilter: (state, action: PayloadAction<{ best_seller: boolean; trending: boolean; new_launch: boolean }>) => {
            state.filter = action.payload;
        },
    },
});

export const { setFilter } = productsSlice.actions;
export default productsSlice.reducer;
