
import { FarmHistory } from "@/src/types/farmer";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FarmHistoryState {
  farmHistoryDataArray: FarmHistory[];
}

const initialState: FarmHistoryState = {
  farmHistoryDataArray: [],
};

const FarmHistorySlice = createSlice({
  name: "FarmHistory",
  initialState,
  reducers: {
    setFarmHistory: (state, action: PayloadAction<FarmHistory[]>) => {
      state.farmHistoryDataArray = action.payload;
    },
  },
});

export const { setFarmHistory } = FarmHistorySlice.actions;
export default FarmHistorySlice.reducer;