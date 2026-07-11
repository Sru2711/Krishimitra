import axios from "axios"
import { openWeatherApi } from "../api"
import { useDispatch } from "react-redux"
import { getWeatherData } from "../features/Weather/weatherSlice"
import { weatherMenu } from "../types/sidebarItems"

// type response{}

export const getWeatherInformation = async(langtitude:number, longitude:number) =>{
   const resposne =await axios.get(openWeatherApi(langtitude,longitude))
    return resposne.data
}