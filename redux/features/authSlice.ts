import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthResponse } from "@/types/auth";

const initialState: Partial<AuthResponse> = {
  token: null,
  user: null,
  message: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<AuthResponse>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.message = action.payload.message;
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.message = "";
    },
  },
});

export const { setAuth, logout } = authSlice.actions;
export default authSlice.reducer;
