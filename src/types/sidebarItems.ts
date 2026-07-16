import { StaticImageData } from "next/image";
import strict from "node:assert/strict";

export interface FarmItem {
  name: string;
  link: string;
  icon:StaticImageData
}

export interface CurrentWeather {
  time: string;
  interval: number;
  temperature_2m: number;
  relative_humidity_2m: number;
  wind_speed_10m: number;
  rain: number;
} 

export interface HourlyWeather {
  time: string[];
  precipitation_probability: number[];
}

export interface WeatherResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  elevation: number;
  timezone: string;
  timezone_abbreviation: string;
  utc_offset_seconds: number;
  current: CurrentWeather;
  hourly: HourlyWeather;
} 

export interface WeatherItem {
  name: string;
  value: string | number | undefined;
  unit: string;
  icon: StaticImageData;
}

export type menu = FarmItem[];
export type weatherMenu = WeatherItem[];

export type CropData = {
  id: number;
  name: string;
  suitability: number; // percentage
  marketPrice: number; // in rupees
  unit: string;        // e.g., "kg" or "qtl"
};

export type FarmerProfileState = {
  id: string;
  name: string;
  mobile: string;
  email?: string | null;

  // Geographic Information
  state?: string | null;
  district?: string | null;
  pincode?: string | null;

  // Agriculture Information
  farmerType?: string | null;
  landHolding?: number | null;
  primaryCrop?: string | null;

  // Government ID (Hashed)
  aadharHash?: string | null;

  createdAt: Date;
  updatedAt: Date;
};

export type RegisterForm = {
  name: string;
  mobile: string;
  email?: string;

  state: string;
  district: string;
  pincode: string;

  farmerType: string;
  landHolding?: number;
  primaryCrop?: string;

  aadharHash: string;

  password: string;
  confirmPassword: string;

  // Location
  latitude?: number;
  longtitude?: number;

  // Soil
  
};

export type LoginForm = {
  email: string;
  mobile: number;
  password: string;
  // token:string
};