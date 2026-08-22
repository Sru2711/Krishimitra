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

// export const getSoilDetailsForFarmersLand = async (
//   langtitude: number,
//   longitude: number,
// ) => {
//   let soilResponse = await axios
//     .get(getSoilDataApi(langtitude, longitude))
//     .then((response) => {
//       return response?.data;
//     })
//     .catch((error) => {
//       return error?.message;
//     });
//   return soilResponse;
//   //    return setterFunction(soilResponse?.data);
// };

export const getSoilDetailsForFarmersLand = async (
  latitude: number,
  longitude: number,
) => {
  try {
    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude)
    ) {
      throw new Error("Invalid latitude or longitude.");
    }

    const url = getSoilDataApi(
      latitude,
      longitude
    );

    console.log("🌱 SoilGrids request:", {
      latitude,
      longitude,
      url,
    });

    const response = await axios.get(
      url,
      {
        timeout: 90000,
        headers: {
          Accept: "application/json",
        },
      }
    );

    console.log(
      "✅ SoilGrids response:",
      response.status
    );

    return response.data;

  } catch (error: any) {

    console.error(
      "❌ SoilGrids request failed:",
      {
        message: error?.message,
        code: error?.code,
        status: error?.response?.status,
        data: error?.response?.data,
      }
    );

    if (
      error?.response?.status === 503
    ) {
      throw new Error(
        "SoilGrids is temporarily unavailable."
      );
    }

    if (
      error?.code === "ECONNABORTED" ||
      error?.code === "ETIMEDOUT"
    ) {
      throw new Error(
        "SoilGrids request timed out."
      );
    }

    throw error;
  }
};

// export const postTheSoilData = async (data: any, BearerToken: string) => {
//   let response = await axios
//     .post("/api/soilData", data, {
//       headers: {
//         authorization: `Bearer ${BearerToken}`,
//       },
//     })
//     .then((res) => {
//       return res;
//     })
//     .catch((err) => {
//       return err?.message;
//     });
//   return response;
// };



export const postTheUserDataForRecommendation = async (
  data: any,
  BearerToken: string,
) => {
  console.log("###2")
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
      console.log("err?.message!!",err?.message)
      return err?.message;
    });
  return response;
};

export const postTheUserDataForWarning = async (
  data: any,
  BearerToken: string,
) => {
  console.log("###4")
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
      console.log("err?.message",err?.message)
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


export async function postTheSoilData(
  soilPayload: any,
  token: string
) {
  try {
    console.log(
      "📤 SOIL SAVE REQUEST:",
      soilPayload
    );

    const response = await axios.post(
      "/api/soilData",
      soilPayload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(
      "✅ SOIL SAVE RESPONSE:",
      response.status,
      response.data
    );

    return response;
  } catch (error: any) {
    console.error(
      "❌ SOIL SAVE API ERROR:",
      {
        status: error?.response?.status,
        data: error?.response?.data,
        message: error?.message,
        url: error?.config?.url,
      }
    );

    throw error;
  }
}

export async function collectAndSaveSoil(
  latitude: number,
  longitude: number,
  token: string
) {
  console.log(
    "🌱 STARTING SOIL COLLECTION"
  );

  console.log("📍 Coordinates:", {
    latitude,
    longitude,
  });

  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude)
  ) {
    throw new Error(
      "Invalid farm coordinates."
    );
  }

  /*
   * ============================================================
   * STEP 1: GET SOIL FROM SOILGRIDS
   * ============================================================
   */

  let soilResponse;

  try {
    soilResponse =
      await getSoilDetailsForFarmersLand(
        latitude,
        longitude
      );
  } catch (error) {
    console.error(
      "❌ SOILGRIDS REQUEST FAILED:",
      error
    );

    throw new Error(
      "Unable to retrieve soil information from SoilGrids."
    );
  }

  console.log(
    "🌱 RAW SOILGRIDS RESPONSE:",
    soilResponse
  );

  /*
   * ============================================================
   * STEP 2: VALIDATE SOILGRIDS RESPONSE
   * ============================================================
   */

  if (
    !soilResponse ||
    typeof soilResponse !== "object" ||
    !soilResponse.properties ||
    !Array.isArray(
      soilResponse.properties.layers
    )
  ) {
    console.error(
      "❌ INVALID SOILGRIDS RESPONSE:",
      soilResponse
    );

    throw new Error(
      "Invalid soil information received from SoilGrids."
    );
  }

  const layers =
    soilResponse.properties.layers;

  if (layers.length === 0) {
    throw new Error(
      "No soil information was found for this location."
    );
  }

  /*
   * ============================================================
   * STEP 3: READ SOIL VALUE
   * ============================================================
   */

  const getLayerValue = (
    name: string
  ): number | null => {
    const layer = layers.find(
      (item: any) =>
        item.name === name
    );

    if (!layer) {
      console.warn(
        `⚠️ Soil layer "${name}" not found`
      );

      return null;
    }

    const value =
      layer.depths?.[0]?.values?.["Q0.5"];

    if (
      value === null ||
      value === undefined ||
      !Number.isFinite(Number(value))
    ) {
      console.warn(
        `⚠️ No valid Q0.5 value found for "${name}"`
      );

      return null;
    }

    const numericValue =
      Number(value);

    const factor =
      layer.unit_measure?.d_factor;

    if (
      factor === undefined ||
      factor === null ||
      Number(factor) === 0
    ) {
      return numericValue;
    }

    return (
      numericValue /
      Number(factor)
    );
  };

  /*
   * ============================================================
   * STEP 4: EXTRACT VALUES
   * ============================================================
   */

  const sand =
    getLayerValue("sand");

  const silt =
    getLayerValue("silt");

  const clay =
    getLayerValue("clay");

  const soc =
    getLayerValue("soc");

  const nitrogen =
    getLayerValue("nitrogen");

  const cec =
    getLayerValue("cec");

  const ph =
    getLayerValue("phh2o");

  const coarseFragments =
    getLayerValue("cfvo");

  console.log(
    "🌱 PARSED SOIL VALUES:",
    {
      sand,
      silt,
      clay,
      soc,
      nitrogen,
      cec,
      ph,
      coarseFragments,
    }
  );

  /*
   * ============================================================
   * STEP 5: VALIDATE DATA
   * ============================================================
   */

  const soilValues = [
    sand,
    silt,
    clay,
    soc,
    nitrogen,
    cec,
    ph,
    coarseFragments,
  ];

  const hasAnySoilData =
    soilValues.some(
      (value) =>
        value !== null &&
        Number.isFinite(value)
    );

  if (!hasAnySoilData) {
    throw new Error(
      "No usable soil information was found for this location."
    );
  }

  /*
   * ============================================================
   * STEP 6: SOIL TYPE
   * ============================================================
   */

  let soilType = "Loam";

  if (
    clay !== null &&
    clay >= 40
  ) {
    soilType = "Clay";
  } else if (
    sand !== null &&
    sand >= 70
  ) {
    soilType = "Sandy";
  } else if (
    silt !== null &&
    silt >= 80
  ) {
    soilType = "Silty";
  }

  /*
   * ============================================================
   * STEP 7: FERTILITY
   * ============================================================
   */

  const fertilityScores: number[] = [];

  if (soc !== null) {
    fertilityScores.push(
      soc >= 20
        ? 3
        : soc >= 10
        ? 2
        : 1
    );
  }

  if (nitrogen !== null) {
    fertilityScores.push(
      nitrogen >= 2
        ? 3
        : nitrogen >= 1
        ? 2
        : 1
    );
  }

  if (cec !== null) {
    fertilityScores.push(
      cec >= 25
        ? 3
        : cec >= 10
        ? 2
        : 1
    );
  }

  if (ph !== null) {
    fertilityScores.push(
      ph >= 6 && ph <= 7.5
        ? 3
        : ph >= 5.5 && ph <= 8
        ? 2
        : 1
    );
  }

  let fertilityLevel = 0;

  if (
    fertilityScores.length > 0
  ) {
    const total =
      fertilityScores.reduce(
        (sum, value) =>
          sum + value,
        0
      );

    fertilityLevel =
      Math.round(
        (total /
          (fertilityScores.length * 3)) *
          100
      );
  }

  /*
   * ============================================================
   * STEP 8: PREPARE PAYLOAD
   * ============================================================
   */

  const soilPayload = {
    soilType,
    fertilityLevel,
    soilPH: ph,
    organicCarbon: soc,
    clayPercentage: clay,
    sandPercentage: sand,
    siltPercentage: silt,
    cationExchangeCapacity: cec,
    nitrogen,
    bulkDensity: null,
    coarseFragments,
    apiProvider:
      "ISRIC SoilGrids",
  };

  console.log(
    "🌱 FINAL SOIL PAYLOAD:",
    soilPayload
  );

  /*
   * ============================================================
   * STEP 9: SAVE TO DATABASE
   * ============================================================
   */

  try {
    const saveResponse =
      await postTheSoilData(
        soilPayload,
        token
      );

    if (
      saveResponse.status < 200 ||
      saveResponse.status >= 300
    ) {
      throw new Error(
        "Soil information could not be saved."
      );
    }

    console.log(
      "✅ SOIL DATA SAVED SUCCESSFULLY"
    );

    return {
      success: true,
      soilPayload,
      soilData:
        saveResponse.data?.soilData ??
        null,
      response:
        saveResponse.data,
    };
  } catch (error) {
    console.error(
      "❌ SOIL DATABASE SAVE ERROR:",
      error
    );

    throw new Error(
      "Soil information could not be saved."
    );
  }
}