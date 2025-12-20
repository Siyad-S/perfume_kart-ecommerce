import { UserType } from "@/src/types/user";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  user: UserType | null,
}

const initialState: AuthState = {
  user: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state: AuthState, action: PayloadAction<object | null>) => {
      state.user = action.payload as UserType;
    },
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
