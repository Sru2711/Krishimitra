"use client";

import Image from "next/image";
import React, { useState } from "react";
import FarmChatBotImage from "@/src/assets/FarmChatBotImage.png";
import { ClipboardList, SquarePen } from "lucide-react";
import { getConversationalId } from "@/src/services/chat";
import { useRouter } from "next/navigation";

const MainAskKrishiMitra = () => {
  // const [converstaionalId, setConverstaionalId] = useState<number | null>(null);
  const router = useRouter();

  const handleGetConversationId = async () => {
    try {
      const response = await getConversationalId();
      const conversationId = response?.conversationId?.id;
      if (conversationId) {
        router.push(`/askKrishiMitra/newChat/${conversationId}`);
      }
    } catch (error) {
      console.error("Failed to get conversation ID:", error);
    }
  };

  const handleNavigateToMessageList = async () => {
    router.push("/askKrishiMitra/history");
  };

  return (
    // <>
    <div className="relative w-full h-full overflow-hidden">
      <Image
        src={FarmChatBotImage}
        alt="Farm Chat Bot"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute bottom-8 left-0 z-50 flex flex-col sm:flex-row w-full justify-center gap-6 px-6">
        <button
          type="submit"
          className="group rounded-2xl border-2 hover:border-advisory border-black bg-advisory px-8 py-4 shadow-xl transition-colors hover:bg-recommendation"
          onClick={() => {
            handleNavigateToMessageList();
          }}
        >
          <div className="flex flex-row gap-4">
            <ClipboardList
              size={24}
              className="text-recommendation transition-colors group-hover:text-advisory"
            />

            <span className="text-lg font-medium text-recommendation transition-colors group-hover:text-advisory">
              Chat History
            </span>
          </div>
        </button>

        <button
          type="submit"
          className="group rounded-2xl border-2 hover:border-advisory border-black bg-advisory px-8 py-4 shadow-xl transition-colors hover:bg-recommendation"
          onClick={() => {
            handleGetConversationId();
          }}
        >
          <div className="flex flex-row gap-4">
            <SquarePen
              size={24}
              className="text-recommendation transition-colors group-hover:text-advisory"
            />

            <span className="text-lg font-medium text-recommendation transition-colors group-hover:text-advisory">
              New Chat
            </span>
          </div>
        </button>
      </div>
    </div>
  );
};
export default MainAskKrishiMitra;
