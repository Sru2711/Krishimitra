"use client";

import MapComponent from "@/src/components/GoogleMapComponent";
import Rain from "@/src/assets/Rain.png";
import RainProb from "@/src/assets/RainProb.png";
import Sun from "@/src/assets/Sun.png";
import Wind from "@/src/assets/Wind.png";
import waterproof from "@/src/assets/waterdrop.png";
import Warning from "@/src/assets/Warning.png";
import Alert from "@/src/assets/Alert.png";
import AllClear from "@/src/assets/Allclear.png";
import { weatherMenu } from "@/src/types/sidebarItems";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import SuitableCrops from "@/src/components/SuitableCrops";
import dynamic from "next/dynamic";
import { useDispatch, useSelector } from "react-redux";
import { getWeatherInformation } from "@/src/services/Dashboard";
import { getWeatherData } from "@/src/features/Weather/weatherSlice";
import { getCoords } from "@/src/components/CurrentLocation";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import authSlice from "../../../features/Auth/authSlice";
import { getUser } from "@/src/features/Auth/authSlice";
import Plant from "@/src/assets/Plant.gif";
import Flower from "@/src/assets/Flower.gif";

export default function Dashboard() {
  const [modal, setModal] = useState(false);
  // const [cords, setCords] = useState({ latitude: 0, longitude: 0 });
  // const [error, setError] = useState({});
  const [user, setUser] = useState({});
  const [recommendationState, setRecommendationState] = useState(false);
  const [fieldState, setFieldState] = useState(false);

  const dispatch = useDispatch();
  const userData = useAppSelector((state) => {
    return state?.auth?.user;
  });

  const weatherDataa = useAppSelector((state) => state.weather.weatherData);

  const MapComponent = dynamic(
    () => import("@/src/components/GoogleMapComponent"),
    {
      ssr: false,
    },
  );

  // to get the coords
  // useEffect(() => {
  //   getCoords(setCords, setError);
  // }, []);

  //to get data
  useEffect(() => {
    if (!userData?.latitude && userData?.longtitude) return;
    const fetchWeather = async () => {
      try {
        const data = await getWeatherInformation(
          userData?.latitude,
          userData?.longtitude,
        );
        dispatch(getWeatherData(data));
      } catch (error) {
        console.error(error);
      }
    };

    fetchWeather();
  }, [userData?.longtitude, userData?.latitude, dispatch]);

  const weatherData: weatherMenu = [
    {
      name: "Temperature",
      value: weatherDataa?.current?.temperature_2m,
      unit: "°C",
      icon: Sun,
    },
    {
      name: "Wind Speed",
      value: weatherDataa?.current?.wind_speed_10m,
      unit: "km/h",
      icon: Wind,
    },
    {
      name: "Humidity",
      value: weatherDataa?.current?.relative_humidity_2m,
      unit: "%",
      icon: waterproof,
    },
    {
      name: "Rain Prob",
      value: weatherDataa?.hourly?.precipitation_probability?.[0],
      unit: "%",
      icon: RainProb,
    },
    {
      name: "Rain",
      value: weatherDataa?.current?.rain,
      unit: "mm",
      icon: Rain,
    },
  ];

  const alerts = [
    {
      type: "danger",
      message: "Heavy rain expected in next 2 hours",
      icons: Warning,
    },
    {
      type: "warning",
      message: "Flooding risk in low-lying areas",
      icons: Alert,
    },
    {
      type: "info",
      message: "Wind speeds reaching 40km/h",
      icons: AllClear,
    },
  ];

  const handleModalOpen = () => {
    setModal((prev) => !prev);
  };

  return (
    <div className="p-4 md:p-8">
      <div>
        <div className="flex flex-col">
          <span className="font-bold text-2xl md:text-3xl text-recommendation">
            Good Morning! {userData?.name}
          </span>
          <span className="font-medium text-sm md:text-md text-gray-600">
            Location: {userData?.state}, District :{userData?.district}| Date:
            Oct 26, 2023 | Lang: English | Latitude: {userData?.latitude} |
            Longitutde :{userData?.longtitude}
          </span>
        </div>
      </div>

      <div className="py-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Map Section */}
          <div className="md:col-span-2 rounded-xl border-2 border-gray-200 h-auto">
            <div className="w-full h-full">
              <div className="w-full text-xl md:text-2xl p-2 font-semibold h-auto">
                <h1> Your Farm Location </h1>
              </div>
              <div className="w-full  p-2">
                <MapComponent />
              </div>
            </div>
          </div>
          <div className="md:col-span-1 p-4 rounded-xl border-none bg-recommendation">
            {recommendationState ? (
              <div className="w-full h-full max-h-screen flex items-center justify-center">
              <Image src={Plant} alt={"Loading..."} width={100} height={100} />
              </div>
            ) : (
              <div className="w-full border border-white p-2 rounded-lg">
                <div className="w-full text-white text-md sm:text-lg md:text-xl lg:text-3xl font-semibold ">
                  <h1 className="p-2 md:p-5">
                    Best Crops for Today
                  </h1>
                </div>

                <div className="w-full  p-4 flex flex-col ">
                  <div className="w-full p-2 flex flex-col md:flex-row lg:flex-col xl:flex-row justify-start lg:justify-between md:items-center lg:items-start">
                    <div className="w-auto mr-0 sm:mr-4 whitespace-normal sm:whitespace-nowrap text-white text-md sm:text-lg md:text-xl lg:text-2xl font-semibold underline underline-offset-4">
                      Best Crops:
                    </div>
                    <div className="w-2/3 sm:text-md md:text-xl lg:text-2xl xl:text-2xl font-normal text-white">
                      {" "}
                      Soyabean
                    </div>
                  </div>
                  <div className="w-full p-2 flex flex-col md:flex-row lg:flex-col xl:flex-row justify-start lg:justify-between md:items-center lg:items-start">
                    <div className="w-auto mr-0 sm:mr-4 whitespace-normal sm:whitespace-nowrap text-white text-md sm:text-lg md:text-xl lg:text-2xl font-semibold underline underline-offset-4">
                      Confidence:
                    </div>
                    <div className="w-2/3 sm:text-md md:text-xl lg:text-2xl xl:text-2xl font-normal text-white">
                      High
                    </div>
                  </div>
                  <div className="w-full p-2 flex flex-col md:flex-row lg:flex-col xl:flex-row justify-start lg:justify-between md:items-center lg:items-start">
                    <div className="w-auto mr-0 sm:mr-4 whitespace-normal sm:whitespace-nowrap text-white text-md sm:text-lg md:text-xl lg:text-2xl font-semibold underline underline-offset-4">
                      Best Score:
                    </div>
                    <div className="w-2/3 sm:text-md md:text-xl lg:text-2xl xl:text-2xl font-normal text-white">
                      98%
                    </div>
                  </div>
                  <div className="w-full p-2 flex flex-col justify-start lg:justify-between md:items-start lg:items-start">
                    <div className="w-auto mr-0 sm:mr-4 whitespace-normal sm:whitespace-nowrap text-white text-md sm:text-lg md:text-xl lg:text-2xl font-semibold underline underline-offset-4">
                      Why?
                    </div>

                    <div className="w-full  text-white text-sm sm:text-md md:text-lg lg:text-xl font-normal">
                      <ul className="w-full list-disc list-inside space-y-2">
                        <li>Suitable soil for soybean cultivation.</li>
                        <li>
                          Favorable weather conditions for the current season.
                        </li>
                        <li>High expected market demand and better profit.</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="w-full mt-4 flex justify-center items-center">
                  <button
                    className="text-recommendation text-lg md:text-xl bg-amber-50 p-3 md:p-4 w-full md:w-96 rounded-md font-medium hover:bg-amber-100 transition-colors"
                    onClick={() => {
                      handleModalOpen();
                    }}
                  >
                    Other Suitable Crops
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="w-full grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className=" sm:col-span-2 col-span-1  border-2 border-gray-200 rounded-md p-4">
          <div className="w-full">
            <div className="w-full text-xl md:text-2xl p-2 font-semibold mb-2">
              <h1> Today's Weather </h1>
            </div>
            <div className="flex flex-wrap lg:flex-nowrap gap-4 w-full items-stretch">
              {weatherData.map((item) => (
                <div
                  key={item?.name}
                  className="flex-1 basis-0 min-w-[110px] lg:min-w-0 text-black bg-weather-card rounded-md p-4 flex flex-col items-center justify-center font-medium text-lg text-center shadow-sm"
                >
                  <h3 className="text-md md:text-xl font-medium text-slate-950 mb-2 truncate w-full">
                    {item?.name}
                  </h3>

                  <div className="mb-2">
                    <Image
                      src={item?.icon}
                      alt={item?.name}
                      width={45}
                      height={35}
                      style={{
                        width: "50px",
                        height: "auto",
                      }}
                      className="object-contain"
                    />
                  </div>

                  <div className="text-md md:text-lg font-bold">
                    {item?.value}
                    <span className="text-md md:text-lg font-medium text-gray-500 ml-1">
                      {item?.unit}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="sm:col-span-2 lg:col-span-1  border-2 border-gray-200 rounded-md p-4">
          <div className="w-full text-xl md:text-2xl p-2 font-semibold">
            <h1> Field Alert </h1>
          </div>
          {fieldState ? (
            <div className="flex max-h-screen items-center justify-center">
            <Image src={Flower} alt={"Loading..."} width={100} height={100} />
            </div>
          ) : (
            <div className="flex flex-col gap-4 max-h-64 overflow-y-auto pr-2">
              {alerts?.map((alert, index) => {
                const alterType =
                  alert.type === "danger"
                    ? "bg-red-50 border-red-500 text-red-700"
                    : alert.type === "warning"
                      ? "bg-amber-50 border-amber-500 text-amber-700"
                      : "bg-blue-50 border-blue-500 text-blue-700";

                return (
                  <div
                    key={index} // Using index is safer here
                    className={`p-3 rounded-lg border flex items-center gap-3 ${alterType}`}
                  >
                    <Image
                      src={alert?.icons}
                      alt={alert?.type}
                      width={25}
                      height={20}
                    />
                    {/* <span className="font-bold uppercase text-xs">
                    {alert.type}
                  </span> */}
                    <p className="text-sm font-medium">{alert.message}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      {modal && (
        <SuitableCrops modalOpen={modal} onClose={() => setModal(false)} />
      )}
    </div>
  );
}
