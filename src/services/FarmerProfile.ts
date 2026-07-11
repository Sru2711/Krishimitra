"use clients"

import axios from "axios";
import { farmerUpdateProfile } from "../types/farmer";

export const updateFarmerProfile = async (data: farmerUpdateProfile) => {
  let token = localStorage.getItem("CurrentToken");
  console.log("token",token)
  if (token) {
    let responseData = await axios
      .patch("/api/user", data,{
      headers:{
        Authorization: `Bearer ${token}`
      }
    })
      .then((response) => {
        return response;
      })
      .catch((error) => {
        return error;
      });
    return responseData;
  }
};
export const deleteFarmerProfile = async () => {
  let token = localStorage.getItem("CurrentToken");
  if (token) {
    let responseData = await axios
      .delete("/api/user", {
      headers:{
        Authorization: `Bearer ${token}`
      }
    })
      .then((response) => {
        return response;
      })
      .catch((error) => {
        return error;
      });
    return responseData;
  }
};
