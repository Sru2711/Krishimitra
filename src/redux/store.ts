import { configureStore } from '@reduxjs/toolkit'
import WeatherReducer from "@/src/features/Weather/weatherSlice"
import authReducer from "@/src/features/Auth/authSlice";
import farmHistoryReducer from "@/src/features/FarmHistory/FarmHistrySlice";

export const store = configureStore({
  reducer: {
    weather:WeatherReducer,
    auth:authReducer,
    farmHistory:farmHistoryReducer
  }
})
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

