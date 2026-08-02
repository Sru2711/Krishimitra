import crops from "@/src/assets/data/crops.json";
import { truncate } from "node:fs/promises";

interface Crop {
  cropName: string;
  category:
    | "Cereal"
    | "Pulse"
    | "Oilseed"
    | "Vegetable"
    | "Fruit"
    | "Commercial Crop"
    | "Spice";
  season: "Kharif" | "Rabi" | "Zaid";
  preferredSoils:
    | "Black"
    | "Red"
    | "Alluvial"
    | "Laterite"
    | "Loamy"
    | "Sandy"
    | "Clay";
  temperature: number;
  humidity: number;
  rainfall: number;
  minTemperature: number;
  maxTemperature: number;
  minHumidity: number;
  maxHumidity: number;
  idealRainfall: number;
  marketPricePerQuintal: number;
  marketDemand: "Low" | "Medium" | "High";
  waterRequirement: "Low" | "Medium" | "High";
  growingDurationDays: number;
  difficulty: "Easy" | "Moderate" | "Difficult";
  compatiblePreviousCrops: string[];
  avoidPreviousCrops: string[];
}

interface SoilProperties {
  soilType?: string;
  season?: string;
  temperature: number;
  humidity: number;
  rainfall: number;
  fertilityLevel?: number;
  soilPH?: number;
  organicCarbon?: number;
  clayPercentage?: number;
  sandPercentage?: number;
  siltPercentage?: number;
  cationExchangeCapacity?: number;
  nitrogen?: number;
  bulkDensity?: number;
  coarseFragments?: number;
  // waterAvailability:string
}

export const recommendation = async (
  userData: SoilProperties,
  reccArray: { cropName: string; score: number }[],
): Promise<{ cropName: string; score: number }[]> => {
  if (!userData || Object.keys(userData).length === 0) {
    return [];
  }

  crops.forEach((crop) => {
    let theScore = 0;

    if (userData.soilType && crop.preferredSoils?.includes(userData.soilType)) {
      theScore += 100;
    }

    if (userData.season) {
      if (userData.season === crop.season) {
        theScore += 100;
      } else {
        theScore += 0;
      }
    }

    if (userData.temperature != null) {
      if (
        userData.temperature >= crop.minTemperature &&
        userData.temperature <= crop.maxTemperature
      ) {
        theScore += 100;
      } else if (
        userData.temperature >= crop.minTemperature - 2 &&
        userData.temperature < crop.minTemperature
      ) {
        theScore += 90;
      } else if (
        userData.temperature > crop.maxTemperature &&
        userData.temperature <= crop.maxTemperature + 2
      ) {
        theScore += 90;
      } else if (
        userData.temperature >= crop.minTemperature - 4 &&
        userData.temperature < crop.minTemperature - 2
      ) {
        theScore += 80;
      } else if (
        userData.temperature > crop.maxTemperature + 2 &&
        userData.temperature <= crop.maxTemperature + 4
      ) {
        theScore += 80;
      } else {
        theScore += 0;
      }
    }

    if (userData.humidity != null) {
      if (
        userData.humidity >= crop.minHumidity &&
        userData.humidity <= crop.maxHumidity
      ) {
        theScore += 100;
      } else if (
        userData.humidity >= crop.minHumidity - 5 &&
        userData.humidity < crop.minHumidity
      ) {
        theScore += 90;
      } else if (
        userData.humidity > crop.maxHumidity &&
        userData.humidity <= crop.maxHumidity + 5
      ) {
        theScore += 90;
      } else if (
        userData.humidity >= crop.minHumidity - 10 &&
        userData.humidity < crop.minHumidity - 5
      ) {
        theScore += 80;
      } else if (
        userData.humidity > crop.maxHumidity + 5 &&
        userData.humidity <= crop.maxHumidity + 10
      ) {
        theScore += 80;
      } else {
        theScore += 0;
      }
    }

    if (userData.rainfall != null) {
      const diff = Math.abs(userData.rainfall - crop.idealRainfall);

      if (diff <= 50) {
        theScore += 100;
      } else if (diff <= 100) {
        theScore += 90;
      } else if (diff <= 200) {
        theScore += 80;
      } else if (diff <= 300) {
        theScore += 70;
      } else {
        theScore += 0;
      }
    }

    switch (crop.marketDemand) {
      case "High":
        theScore += 100;
        break;
      case "Medium":
        theScore += 75;
        break;
      case "Low":
        theScore += 50;
        break;
      default:
        theScore += 0;
    }

    if (crop.marketPricePerQuintal >= 6000) {
      theScore += 100;
    } else if (crop.marketPricePerQuintal >= 5000) {
      theScore += 90;
    } else if (crop.marketPricePerQuintal >= 4000) {
      theScore += 80;
    } else if (crop.marketPricePerQuintal >= 3000) {
      theScore += 70;
    } else if (crop.marketPricePerQuintal >= 2000) {
      theScore += 60;
    } else {
      theScore += 40;
    }

    // Previous Crop Compatibility
    // if (userData.previousCrop) {
    //   if (crop.compatiblePreviousCrops?.includes(userData.previousCrop)) {
    //     theScore += 100;
    //   } else if (crop.avoidPreviousCrops?.includes(userData.previousCrop)) {
    //     theScore += 0;
    //   } else {
    //     theScore += 50;
    //   }
    // }

    // Water Requirement
    // if (userData.waterAvailability) {
    //   if (userData.waterAvailability === crop.waterRequirement) {
    //     theScore += 100;
    //   } else {
    //     theScore += 50;
    //   }
    // }

    reccArray.push({
      cropName: crop.cropName,
      score: theScore,
    });
  });

  return reccArray.sort((a, b) => b.score - a.score);
};
