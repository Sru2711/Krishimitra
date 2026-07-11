import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { WeatherResponse } from "../../types/sidebarItems";

interface WeatherState {
  weatherData: WeatherResponse | null;
}

const initialState: WeatherState = {
  weatherData: null,
};

export const weatherSlice = createSlice({
  name: "weatherDashboard",
  initialState,

  reducers: {
    getWeatherData: (
      state,
      action: PayloadAction<WeatherResponse>
    ) => {
      state.weatherData = action.payload;
    },
  },
});

export const { getWeatherData } = weatherSlice.actions;

export default weatherSlice.reducer;