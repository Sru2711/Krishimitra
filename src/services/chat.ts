import axios from "axios";
import { getTokenFromLocalStorage } from "./localStorage";

export const sendFarmerChat = async (data: any, input: string) => {
  const token = getTokenFromLocalStorage();

  try {
    const response = await axios.post(
      "/api/chat",
      {
        data,
        message: input,
      },
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getConversationalId = async() =>{
  const token = getTokenFromLocalStorage();
  let conversationalId =  await axios.post("/api/conversations",
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
  ).then((response)=>response?.data).catch((error)=>error.message);
  return conversationalId
}