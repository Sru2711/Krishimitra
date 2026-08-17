"use client";

import { useAppSelector } from "@/src/redux/hooks";
import React, { useEffect, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { useParams } from "next/navigation";
import { getTokenFromLocalStorage } from "@/src/services/localStorage";
import ReactMarkdown from "react-markdown";
import { getConversationFromConvId } from "@/src/services/chat";
import { ImageIcon, X } from "lucide-react";
import Image from "next/image";

const SUGGESTED_QUESTIONS = [
  "Best fertilizer for Soyabean?",
  "Prevent pests in Cotton?",
  "Price of Tur?",
];

const AskKrishiMitra = () => {
  const [conversationMessages, setConversationMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [sending, setSending] = useState(false);
  const token = getTokenFromLocalStorage();
  const [data, setData] = useState({
    temperature: 0,
    windSpeed: 0,
    humidity: 0,
    precipitationProbability: 0,
    latitude: 0,
    longitude: 0,
  });

  const weatherDataa = useAppSelector((state) => state.weather.weatherData);
  const userData = useAppSelector((state) => {
    return state?.auth?.user;
  });
  const { converstaionalId } = useParams();

  const conversationId = Array.isArray(converstaionalId)
    ? converstaionalId[0]
    : converstaionalId;

  useEffect(() => {
    setData({
      temperature: weatherDataa?.current?.temperature_2m ?? 0,
      windSpeed: weatherDataa?.current?.wind_speed_10m ?? 0,
      humidity: weatherDataa?.current?.relative_humidity_2m ?? 0,
      precipitationProbability:
        weatherDataa?.hourly?.precipitation_probability?.[0] ?? 0,
      latitude: userData?.latitude ?? 0,
      longitude: userData?.longtitude ?? 0,
    });
  }, [weatherDataa, userData]);

  useEffect(() => {
    if (!conversationId) return;

    const fetchConversation = async () => {
      try {
        const data = await getConversationFromConvId(conversationId);
        setConversationMessages(data.messages ?? []);
      } catch (error) {
        console.error("❌ Failed to fetch conversation:", error);
      }
    };

    fetchConversation();
  }, [conversationId]);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setSending(true)
    if (!input.trim() && !selectedFiles) {
      return;
    }

    try {
      await sendMessage(
        {
          text: input.trim(),
          files: selectedFiles ?? undefined,
        },
        {
          body: {
            converstaionalId,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setInput("");
      setSelectedFiles(null);
    } catch (error) {
      console.error("Failed to send:", error);
    }
    setSending(false)
  };

  const { messages, sendMessage, status } = useChat();

  const displayMessages =
    messages.length > 0
      ? [...conversationMessages, ...messages]
      : conversationMessages;

  return (
    <div className="flex flex-col h-full w-full min-w-[100px] mx-auto bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-recommendation p-4 border-b border-black text-white font-bold text-lg">
        Ask KrishiMitra
      </div>
      {/* <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-lg text-gray-500 mt-10">
            Start a conversation!
          </div>
        )}
        {messages.map((message) => (
          <div key={message.id}>
            <strong>{message.role}</strong>

            {message.parts.map((part, index) => {
              if (part.type === "text") {
                return <p key={index}>{part.text}</p>;
              }

              return null;
            })}
          </div>
        ))}
      </div> */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {displayMessages.length === 0 && (
          <div className="flex h-full items-center justify-center">
            <p className="text-lg text-gray-500">Start a conversation! 🌱</p>
          </div>
        )}

        {displayMessages.map((message, index) => {
          const isUser = message.role === "user";

          return (
            <div
              key={message.id + index}
              className={`flex ${isUser ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm max-h-75
            overflow-y-auto
            farmer-scrollbar  ${
              isUser
                ? "bg-recommendation text-white rounded-br-md"
                : "bg-gray-100 text-gray-800 rounded-bl-md"
            }`}
              >
                <div className="mb-1 text-xs font-semibold opacity-70">
                  {isUser ? "You" : "KrishiMitra"}
                </div>

                <div
                  className={`prose prose-sm max-w-none ${
                    isUser ? "prose-invert" : ""
                  }`}
                >
                  {/* {message.parts.map((part: any, index: number) => {
                    if (part.type === "text") {
                      return (
                        <ReactMarkdown key={part?.id + index}>
                          {part.text}
                        </ReactMarkdown>
                      );
                    }

                    return null;
                  })} */}
                  <div className="space-y-3">
                    {message.parts.map((part: any, index: number) => {
                      // IMAGE
                      if (
                        part.type === "file" &&
                        part.mediaType?.startsWith("image/")
                      ) {
                        return (
                          <img
                            key={index}
                            src={part.url}
                            alt={part.filename ?? "Uploaded image"}
                            className="max-w-[300px] rounded-xl"
                          />
                        );
                      }

                      // TEXT
                      if (part.type === "text") {
                        return (
                          <div
                            key={index}
                            className={`prose prose-sm max-w-none ${
                              isUser ? "prose-invert" : ""
                            }`}
                          >
                            <ReactMarkdown>{part.text}</ReactMarkdown>
                          </div>
                        );
                      }

                      return null;
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* Suggested Questions Block - Hidden on very small screens, wraps on larger */}
      {/* <div className="hidden sm:block p-4 border-t border-gray-100">
        <p className="text-lg font-semibold text-gray-500 uppercase mb-2">
          Suggested:
        </p>
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_QUESTIONS.map((q, i) => (
            <button
              key={i}
              onClick={() => setInput(q)}
              className="text-md bg-gray-50 border border-gray-200 px-3 py-1 rounded-full hover:bg-alert-amber hover:text-white transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      </div> */}
      {/* Input Area - Now responsive */}
      <div className="p-4 border-t border-black flex gap-2 items-center">
        {selectedFiles && selectedFiles.length > 0 && (
          <div className="relative flex gap-2 items-center">
            {Array.from(selectedFiles).map((file, index) => (
              <Image
                key={index}
                src={URL.createObjectURL(file)}
                alt={file.name}
                width={100}
                height={100}
                className="object-cover rounded-lg border"
              />
            ))}

            {/* Remove all selected images */}
            <button
              type="button"
              className="
          absolute
          -top-2
          -right-2
          bg-red-500
          text-white
          rounded-full
          p-1
          hover:cursor-pointer
        "
              onClick={() => {
                setSelectedFiles(null);
              }}
            >
              <X size={14} />
            </button>
          </div>
        )}

        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a farming question..."
          className="flex-1 min-w-[100px] p-2 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-alert-amber"
          // onKeyPress={(e) => e.key === "Enter" && handleSend()}
        />

        {/* <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e?.target?.files?.[0] ?? null;
            setSelectImages(file);

            e.currentTarget.value = "";
          }}
        /> */}
        <div className="flex items-center justify-center gap-2 text-sm text-gray-600 ">
          {/* Ask question on this please */}
          <label
            htmlFor="image-upload"
            className="cursor-pointer border border-gray-300 px-3 py-2 rounded-lg hover:bg-gray-100"
          >
            <ImageIcon size={20} />

            <input
              id="image-upload"
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={(e) => {
                setSelectedFiles(e.target.files);
              }}
            />
          </label>
        </div>
        <button
          type="submit"
          disabled={
            sending ||
            (!input.trim() && (!selectedFiles || selectedFiles.length === 0))
          }
          onClick={handleSubmit}
          className="bg-alert-amber text-black font-bold px-4 py-2 rounded-md hover:bg-alert-amber/80"
        >
          {sending ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default AskKrishiMitra;
