import axios from "axios";
import { getSoilDataApi, openWeatherApi } from "../api";
import { useDispatch } from "react-redux";
import { getWeatherData } from "../features/Weather/weatherSlice";
import { weatherMenu } from "../types/sidebarItems";
import { getTokenFromLocalStorage } from "./localStorage";

// type response{}
const token = getTokenFromLocalStorage();

export const getWeatherInformation = async (
  langtitude: number,
  longitude: number,
) => {
  const resposne = await axios.get(openWeatherApi(langtitude, longitude));
  return resposne.data;
};

export const getSoilDetailsForFarmersLand = async (
  langtitude: number,
  longitude: number,
) => {
  let soilResponse = await axios
    .get(getSoilDataApi(langtitude, longitude))
    .then((response) => {
      return response?.data;
    })
    .catch((error) => {
      return error?.message;
    });
  return soilResponse;
  //    return setterFunction(soilResponse?.data);
};

export const postTheSoilData = async (data: any, BearerToken: string) => {
  let response = await axios
    .post("/api/soilData", data, {
      headers: {
        authorization: `Bearer ${BearerToken}`,
      },
    })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err?.message;
    });
  return response;
};

export const postTheUserDataForRecommendation = async (data: any,BearerToken: string,) => {
  let response = await axios
    .post("/api/recommendations", data, {
      headers: {
        authorization: `Bearer ${BearerToken}`,
      },
    })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err?.message;
    });
  return response;
};

export const postTheUserDataForWarning = async (data: any,BearerToken: string,) => {
  let response = await axios
    .post("/api/warning", data, {
      headers: {
        authorization: `Bearer ${BearerToken}`,
      },
    })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err?.message;
    });
  return response;
};


export const getSeason = (): "Kharif" | "Rabi" | "Zaid" => {
  const month = new Date().getMonth() + 1; // 1-12

  if (month >= 6 && month <= 10) {
    return "Kharif";
  }

  if (month >= 11 || month <= 3) {
    return "Rabi";
  }

  return "Zaid"; // April-May
};