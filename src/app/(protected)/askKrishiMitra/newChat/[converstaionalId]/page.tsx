"use client";

import { useAppSelector } from "@/src/redux/hooks";
import React, { useEffect, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { useParams } from "next/navigation";

const SUGGESTED_QUESTIONS = [
  "Best fertilizer for Soyabean?",
  "Prevent pests in Cotton?",
  "Price of Tur?",
];

const AskKrishiMitra = () => {
  // const [messages, setMessages] = useState<
  //   { role: "user" | "bot"; text: string }[]
  // >([]);
  const [input, setInput] = useState("");

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
  const { conversationId } = useParams();

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

  // const handleSend = () => {
  //   if (!input.trim() || Object.values(data) ===0) return;
  //   else{

  //   }
  //   setMessages([...messages, { role: "user", text: input }]);
  //   setInput("");
  // };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!input.trim()) return;

    await sendMessage({
      text: input,
    },
  {
    body:{
      conversationId
    },
  }
);

    setInput("");
  };
  const { messages, sendMessage, status } = useChat();

  return (
    <div className="flex flex-col h-full w-full min-w-[100px] mx-auto bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-recommendation p-4 border-b border-black text-white font-bold text-lg">
        Ask KrishiMitra
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
      </div>

      {/* Suggested Questions Block - Hidden on very small screens, wraps on larger */}
      <div className="hidden sm:block p-4 border-t border-gray-100">
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
      </div>

      {/* Input Area - Now responsive */}
      <div className="p-4 border-t border-black flex gap-2 items-center">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a farming question..."
          className="flex-1 min-w-[100px] p-2 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-alert-amber"
          // onKeyPress={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          type="submit"
          onClick={handleSubmit}
          className="bg-alert-amber text-black font-bold px-4 py-2 rounded-md hover:bg-alert-amber/80"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default AskKrishiMitra;
