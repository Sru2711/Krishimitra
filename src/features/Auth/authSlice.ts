import { createSlice, PayloadAction } from "@reduxjs/toolkit";

console.log("Auth slice loaded");

interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  state: string;  
  district: string;
  pincode: string;
  farmerType: string;
  landHolding: number;
  primaryCrop: string;
}

interface AuthState {
  user: User | null;
  sendUser: Partial<User> | null;
}

const initialState: AuthState = {
  user: null,
  sendUser: null,
};

export const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    getUser: (state, action) => {
      state.user = action.payload;
    },
    sendUser: (state, action) => {
      state.sendUser = action.payload;
    },
    logout(state) {
      state.user = null;
    },
  },
});

export const { getUser, sendUser,logout } = authSlice.actions;
export default authSlice.reducer;
