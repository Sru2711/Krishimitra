export interface recommendDataType{
    cropName:string;
    confidence:'High'| 'medium' | 'low';
    score:number;
    why:string[];
}

export interface SoilData {
  soilType?: string;
  season: "Kharif" | "Rabi" | "Zaid";
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
}