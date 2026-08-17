import axios from "axios";
import { getTokenFromLocalStorage } from "./localStorage";

// export const sendFarmerChat = async (data: any, input: string) => {
//   const token = getTokenFromLocalStorage();

//   try {
//     const response = await axios.post(
//       "/api/chat",
//       {
//         data,
//         message: input,
//       },
//       {
//         headers: {
//           authorization: `Bearer ${token}`,
//         },
//       },
//     );

//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

export const getConversationalId = async () => {
  const token = getTokenFromLocalStorage();
  let conversationalId = await axios
    .post(
      "/api/conversations",
      {},
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      },
    )
    .then((response) => response?.data)
    .catch((error) => error.message);
  return conversationalId;
};

export const getConversationBasedOnFarmerId = async () => {
  const token = getTokenFromLocalStorage();
  let conversions = await axios
    .get("/api/conversations", {
      headers: {
        authorization: `Bearer ${token}`,
      },
    })
    .then((response) => response?.data)
    .catch((error) => error?.messages);
  return conversions;
};

export const deleteConversation = async (conversationId: string) => {
  const token = getTokenFromLocalStorage();
  let deleteConversion = await axios.delete(
    `/api/conversations/${conversationId}`,
    {
      headers: {
        authorization: `Bearer ${token}`,
      },
    },
  );
  return deleteConversion;
};

export const getConversationFromConvId = async (conversationId: string) => {
  const token = getTokenFromLocalStorage();
  const response = await axios.get(`/api/conversations/${conversationId}`, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const updateConversation = async (
  conversationId: string,
  message: {
    id?: string;
    role: "user" | "assistant";
    parts: any[];
  },
) => {
  const token = getTokenFromLocalStorage();

  try {
    const response = await axios.patch(
      `/api/conversations/${conversationId}`,
      {
        message,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (error: any) {
    console.error("❌ Update conversation failed:", error);

    throw new Error(
      error?.response?.data?.message || "Failed to update conversation",
    );
  }
};
