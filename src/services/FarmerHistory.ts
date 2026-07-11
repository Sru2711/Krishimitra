"use client"

import axios from "axios";
import { FarmHistory } from "../types/farmer";
import { getTokenFromLocalStorage } from "./localStorage";

const token = getTokenFromLocalStorage();

export const addFarmHistory = async (data: FarmHistory) => {
  let response = axios
    .post("/api/farmData", data, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error;
    });
  return response;
};

export const getFarmHistory = async () => {
  let resposne = await axios
    .get("/api/farmData", {
      headers: {
        authorization:`Bearer ${token}`,
      },
    })
    .then((resposne) => {
      return resposne.data;
    })
    .catch((error) => {
      return error.message;
    });
  return resposne;
};

export const getAFarmHistory = async (data: FarmHistory, id: string) => {
  let response = await axios
    .get(`/api/farmData/${id}`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.message;
    });
  return response;
};

export const updateFarmHistory = async (data: FarmHistory, id: string) => {
  let response = await axios
    .patch(`/api/farmData/${id}`, data, {
      headers: {
        authorization:`Bearer ${token}`,
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.message;
    });
  return response;
};

export const deleteFarmHistory = async (id:string) => {
  let response = await axios
    .delete(`/api/farmData/${id}`,{
      headers: {
        authorization:`Bearer ${token}`,
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.message;
    });
  return response;
};
