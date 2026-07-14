import axios from "axios";
import { getSoilDataApi, openWeatherApi } from "../api";
import { useDispatch } from "react-redux";
import { getWeatherData } from "../features/Weather/weatherSlice";
import { weatherMenu } from "../types/sidebarItems";

// type response{}

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
