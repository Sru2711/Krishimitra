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
import { useEffect, useMemo, useRef, useState } from "react";
import SuitableCrops from "@/src/components/SuitableCrops";
import dynamic from "next/dynamic";
import { useDispatch, useSelector } from "react-redux";
import {
  collectAndSaveSoil,
  getSeason,
  getWeatherInformation,
  postTheUserDataForRecommendation,
  postTheUserDataForWarning,
} from "@/src/services/Dashboard";
import { getWeatherData } from "@/src/features/Weather/weatherSlice";
import { getCoords } from "@/src/components/CurrentLocation";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import authSlice from "../../../features/Auth/authSlice";
import { getUser } from "@/src/features/Auth/authSlice";
import Plant from "@/src/assets/Plant.gif";
import Flower from "@/src/assets/Flower.gif";
import { getSoilDataApi } from "@/src/api";
import { recommendDataType, SoilData } from "@/src/types/dasboard";
import toast from "react-hot-toast";
import axios from "axios";
import message from "@/src/assets/Message.png";

export default function Dashboard() {
  const [modal, setModal] = useState(false);
  const [user, setUser] = useState({});
  const [recommendationState, setRecommendationState] = useState(false);
  const [fieldState, setFieldState] = useState(false);
  const [reccomenData, setRecommendData] = useState<recommendDataType[]>([]);
  const [warningData, setWarningData] = useState<any[]>([]);
  const hasFetched = useRef(false);

  const dispatch = useDispatch();

  const userData = useAppSelector((state) => {
    return state?.auth?.user;
  });

  const [soilDataCollected, setSoilDataCollected] = useState(false);
  const weatherDataa = useAppSelector((state) => state.weather.weatherData);
  console.log("userData", userData);

  const MapComponent = dynamic(
    () => import("@/src/components/GoogleMapComponent"),
    {
      ssr: false,
    },
  );

  useEffect(() => {
    let cancelled = false;

    const initializeSoil = async () => {
      try {
        const token = localStorage.getItem("CurrentToken");

        if (!token) {
          console.error("❌ AUTH TOKEN NOT FOUND");
          return;
        }

        /*
         * ========================================================
         * GET LATEST USER
         * ========================================================
         */

        console.log("👤 GETTING LATEST USER...");

        const userResponse = await axios.get("/api/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const latestUser = userResponse.data;

        console.log("👤 LATEST USER:", latestUser);

        if (cancelled) return;

        /*
         * ========================================================
         * IF SOIL ALREADY EXISTS
         * DO NOT CALL SOILGRIDS AGAIN
         * ========================================================
         */

        if (latestUser?.soilData) {
          console.log("✅ SOIL ALREADY EXISTS");

          dispatch(getUser(latestUser));

          setSoilDataCollected(true);

          return;
        }

        /*
         * ========================================================
         * SOIL DOES NOT EXIST
         * ========================================================
         */

        console.log("⚠️ SOIL DATA IS MISSING");

        if (
          !Number.isFinite(latestUser?.latitude) ||
          !Number.isFinite(latestUser?.longtitude)
        ) {
          throw new Error("Farm location is missing.");
        }

        toast.loading("Collecting your soil data...", {
          id: "soil-retry",
        });

        /*
         * ========================================================
         * SOILGRIDS → SAVE DATABASE
         * ========================================================
         */

        await collectAndSaveSoil(
          latestUser.latitude,
          latestUser.longtitude,
          token,
        );

        if (cancelled) return;

        /*
         * ========================================================
         * VERY IMPORTANT
         *
         * GET USER AGAIN
         *
         * The previous user object still had:
         *
         * soilData: null
         *
         * We MUST NOT dispatch that old object.
         * ========================================================
         */

        console.log("🔄 REFRESHING USER AFTER SOIL SAVE...");

        const refreshedResponse = await axios.get("/api/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const refreshedUser = refreshedResponse.data;

        console.log("👤 REFRESHED USER:", refreshedUser);

        if (cancelled) return;

        /*
         * ========================================================
         * VERIFY SOIL REALLY EXISTS
         * ========================================================
         */

        if (!refreshedUser?.soilData) {
          throw new Error(
            "Soil was saved, but soil data is still missing from the user profile.",
          );
        }

        /*
         * ========================================================
         * PUT FRESH USER INTO REDUX
         * ========================================================
         */

        dispatch(getUser(refreshedUser));

        setSoilDataCollected(true);

        toast.success("Soil data collected successfully!", {
          id: "soil-retry",
        });

        console.log("🌱 SOIL INITIALIZATION COMPLETE");
      } catch (error: any) {
        console.error("❌ SOIL INITIALIZATION FAILED:", error);

        if (cancelled) return;

        setSoilDataCollected(false);

        toast.error(
          error?.response?.data?.message ||
            error?.message ||
            "We could not collect your soil data. Please try again.",
          {
            id: "soil-retry",
            duration: 6000,
          },
        );
      }
    };

    initializeSoil();

    return () => {
      cancelled = true;
    };
  }, []);

  // useEffect(() => {
  //   if (userData?.latitude == null && userData?.longtitude == null) return;
  //   const fetchWeather = async () => {
  //     try {
  //       const data = await getWeatherInformation(
  //         userData?.latitude,
  //         userData?.longtitude,
  //       );
  //       dispatch(getWeatherData(data));
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

  //   fetchWeather();
  // }, [userData?.longtitude, userData?.latitude, dispatch]);

  useEffect(() => {
    if (userData?.latitude == null || userData?.longtitude == null) {
      return;
    }

    const fetchWeather = async () => {
      try {
        const data = await getWeatherInformation(
          userData.latitude ?? 0,
          userData.longtitude ?? 0,
        );

        dispatch(getWeatherData(data));
      } catch (error) {
        console.error("❌ WEATHER ERROR:", error);
      }
    };

    fetchWeather();
  }, [userData?.latitude, userData?.longtitude, dispatch]);

  // useEffect(() => {
  //   if (hasFetched.current) return;

  //   if (!userData?.soilData || !weatherDataa || !soilDataCollected) return;
  //   const soilProperties: SoilProperties = {
  //     soilType: userData?.soilData?.soilType,
  //     season: getSeason(),
  //     temperature: weatherDataa?.current?.temperature_2m ?? 0,
  //     humidity: weatherDataa?.current?.relative_humidity_2m ?? 0,
  //     rainfall: weatherDataa?.current?.rain ?? 0,

  //     fertilityLevel: userData?.soilData?.fertilityLevel ?? undefined,
  //     soilPH: userData?.soilData?.soilPH
  //       ? Number(userData?.soilData.soilPH)
  //       : undefined,
  //     organicCarbon: userData?.soilData?.organicCarbon
  //       ? Number(userData?.soilData.organicCarbon)
  //       : undefined,
  //     clayPercentage: userData?.soilData?.clayPercentage
  //       ? Number(userData?.soilData.clayPercentage)
  //       : undefined,
  //     sandPercentage: userData?.soilData?.sandPercentage
  //       ? Number(userData?.soilData.sandPercentage)
  //       : undefined,
  //     siltPercentage: userData?.soilData?.siltPercentage
  //       ? Number(userData?.soilData.siltPercentage)
  //       : undefined,
  //     cationExchangeCapacity: userData?.soilData?.cationExchangeCapacity
  //       ? Number(userData?.soilData.cationExchangeCapacity)
  //       : undefined,
  //     nitrogen: userData?.soilData?.nitrogen
  //       ? Number(userData?.soilData.nitrogen)
  //       : undefined,
  //     bulkDensity: userData?.soilData?.bulkDensity
  //       ? Number(userData?.soilData.bulkDensity)
  //       : undefined,
  //     coarseFragments: userData?.soilData?.coarseFragments
  //       ? Number(userData?.soilData.coarseFragments)
  //       : undefined,
  //   };
  //   hasFetched.current = true;

  //   const fetchRecommendationData = async () => {
  //     try {
  //       setRecommendationState(true);

  //       const recommendationData = await postTheUserDataForRecommendation(
  //         soilProperties,
  //         userData.token,
  //       );

  //       setRecommendData(recommendationData.data);
  //     } finally {
  //       setRecommendationState(false);
  //     }
  //   };

  //   const fetchWarningData = async () => {
  //     console.log("###3");
  //     try {
  //       setFieldState(true);

  //       const recommendationData = await postTheUserDataForWarning(
  //         soilProperties,
  //         userData.token,
  //       );
  //       setWarningData(recommendationData.data);
  //     } finally {
  //       setFieldState(false);
  //     }
  //   };

  //   fetchWarningData();
  //   fetchRecommendationData();
  // }, [userData, weatherDataa, soilDataCollected]);

  useEffect(() => {
    if (hasFetched.current) {
      return;
    }

    /*
     * We need BOTH:
     *
     * 1. Soil
     * 2. Weather
     */

    if (!soilDataCollected) {
      console.log("⏳ AI WAITING FOR SOIL");
      return;
    }

    if (!userData?.soilData) {
      console.log("⏳ AI WAITING FOR USER SOIL DATA");
      return;
    }

    if (!weatherDataa) {
      console.log("⏳ AI WAITING FOR WEATHER");
      return;
    }

    /*
     * ============================================================
     * PREPARE AI DATA
     * ============================================================
     */

    const soil = userData.soilData;

    const soilProperties: SoilData = {
      soilType: soil.soilType,

      season: getSeason(),

      temperature: weatherDataa?.current?.temperature_2m ?? 0,

      humidity: weatherDataa?.current?.relative_humidity_2m ?? 0,

      rainfall: weatherDataa?.current?.rain ?? 0,

      fertilityLevel: soil.fertilityLevel ?? undefined,

      soilPH: soil.soilPH != null ? Number(soil.soilPH) : undefined,

      organicCarbon:
        soil.organicCarbon != null ? Number(soil.organicCarbon) : undefined,

      clayPercentage:
        soil.clayPercentage != null ? Number(soil.clayPercentage) : undefined,

      sandPercentage:
        soil.sandPercentage != null ? Number(soil.sandPercentage) : undefined,

      siltPercentage:
        soil.siltPercentage != null ? Number(soil.siltPercentage) : undefined,

      cationExchangeCapacity:
        soil.cationExchangeCapacity != null
          ? Number(soil.cationExchangeCapacity)
          : undefined,

      nitrogen: soil.nitrogen != null ? Number(soil.nitrogen) : undefined,

      bulkDensity:
        soil.bulkDensity != null ? Number(soil.bulkDensity) : undefined,

      coarseFragments:
        soil.coarseFragments != null ? Number(soil.coarseFragments) : undefined,
    };

    console.log("🤖 FINAL AI INPUT:", soilProperties);

    /*
     * Prevent duplicate AI calls.
     */
    hasFetched.current = true;

    /*
     * ============================================================
     * RECOMMENDATION
     * ============================================================
     */

    const fetchRecommendationData = async () => {
      try {
        setRecommendationState(true);

        const response = await postTheUserDataForRecommendation(
          soilProperties,
          userData?.token,
        );

        console.log("🤖 RECOMMENDATION RESPONSE:", response);

        setRecommendData(response.data);
      } catch (error) {
        toast.error(
          "For today, recommendations currently are unavailable, please check tomorrow.",
        );
        console.error("❌ RECOMMENDATION ERROR:", error);
      } finally {
        setRecommendationState(false);
      }
    };

    /*
     * ============================================================
     * WARNING
     * ============================================================
     */

    const fetchWarningData = async () => {
      try {
        setFieldState(true);

        const response = await postTheUserDataForWarning(
          soilProperties,
          userData.token,
        );

        console.log("⚠️ WARNING RESPONSE:", response);

        setWarningData(response.data);
      } catch (error) {
        toast.error(
          "For today, warnings currently are unavailable, please check tomorrow.",
        );
        console.error("❌ WARNING ERROR:", error);
      } finally {
        setFieldState(false);
      }
    };

    fetchRecommendationData();
    fetchWarningData();
  }, [soilDataCollected, userData?.soilData, userData?.token, weatherDataa]);

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
                <MapComponent
                  latitude={userData?.latitude ?? 0}
                  longitude={userData?.longtitude ?? 0}
                />
              </div>
            </div>
          </div>
          <div className="md:col-span-1 p-4 rounded-xl border-none bg-recommendation">
            {recommendationState ? (
              <div className="w-full h-full max-h-screen flex items-center justify-center">
                <Image
                  src={Plant}
                  alt={"Loading..."}
                  width={100}
                  height={100}
                />
              </div>
            ) : (
              <div className="w-full h-full border border-white p-2 rounded-lg">
                <div className="w-full text-white text-md sm:text-lg md:text-xl lg:text-3xl font-semibold ">
                  <h1 className="p-2 md:p-5">Best Crops for Today</h1>
                </div>

                <div className="w-full p-4 flex flex-col ">
                  {reccomenData?.length == 0 ? (
                    <>
                      <div className="flex items-center justify-center text-white text-xl">
                        No crops for today
                      </div>
                    </>
                  ) : (
                    reccomenData?.slice(0, 1).map((ele) => (
                      <div key={ele.cropName}>
                        <div className="w-full p-2 flex flex-col md:flex-row lg:flex-col xl:flex-row justify-start lg:justify-between md:items-center lg:items-start">
                          <div className="w-auto mr-0 sm:mr-4 whitespace-nowrap text-white text-md sm:text-lg md:text-xl lg:text-2xl font-semibold underline underline-offset-4">
                            Best Crop:
                          </div>

                          <div className="w-2/3 text-white sm:text-md md:text-xl lg:text-2xl">
                            {ele.cropName}
                          </div>
                        </div>

                        <div className="w-full p-2 flex flex-col md:flex-row lg:flex-col xl:flex-row justify-start lg:justify-between md:items-center lg:items-start">
                          <div className="w-auto mr-0 sm:mr-4 whitespace-nowrap text-white text-md sm:text-lg md:text-xl lg:text-2xl font-semibold underline underline-offset-4">
                            Confidence:
                          </div>

                          <div className="w-2/3 text-white">
                            {ele.confidence}
                          </div>
                        </div>

                        <div className="w-full p-2 flex flex-col md:flex-row lg:flex-col xl:flex-row justify-start lg:justify-between md:items-center lg:items-start">
                          <div className="w-auto mr-0 sm:mr-4 whitespace-nowrap text-white text-md sm:text-lg md:text-xl lg:text-2xl font-semibold underline underline-offset-4">
                            Best Score:
                          </div>

                          <div className="w-2/3 text-white">
                            {" "}
                            {((ele.score / 500) * 100).toFixed(1)}%
                          </div>
                        </div>

                        <div className="w-full p-2">
                          <div className="text-white text-md sm:text-lg md:text-xl lg:text-2xl font-semibold underline underline-offset-4">
                            Why?
                          </div>

                          <ul className="list-disc list-inside space-y-2 text-white mt-2">
                            {ele.why.map((reason, index) => (
                              <li key={index}>{reason}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))
                  )}
                  {/* <div className="w-full p-2 flex flex-col md:flex-row lg:flex-col xl:flex-row justify-start lg:justify-between md:items-center lg:items-start">
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
                  </div> */}
                </div>

                <div className="w-full mt-4 flex justify-center items-center">
                  {(reccomenData?.length ?? 0) > 0 && (
                    <button
                      type="button"
                      className="
      block
      text-recommendation
      text-lg
      md:text-xl
      bg-amber-50
      p-3
      md:p-4
      w-full
      md:w-96
      rounded-md
      font-medium
      border
      border-amber-300
      hover:bg-amber-100
      transition-colors
      opacity-100
      visible
    "
                      onClick={handleModalOpen}
                    >
                      Other Suitable Crops
                    </button>
                  )}
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
              {warningData?.map((alert, index) => {
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
                    {/* <Image
                      src={alert?.icons}
                      alt={alert?.type}
                      width={25}
                      height={20}
                    /> */}
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
        <SuitableCrops
          modalOpen={modal}
          onClose={() => setModal(false)}
          data={reccomenData.slice(1, 4)}
        />
      )}
    </div>
  );
}
