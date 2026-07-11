import FarmHistory from "../app/(protected)/farmHistory/page";
export interface farmerUpdateProfile {
  primaryCrop: string;
  landHolding: number;
  farmerType: string;
}

export interface FarmHistory {
  id?: string | null;
  crop: string;
  season: string;
  cropYield: string;
  price: number;
  earned: number;
  createdAt?: string | null;
}
