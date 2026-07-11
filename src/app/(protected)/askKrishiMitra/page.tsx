"use client";

import React, { useState } from "react";

const SUGGESTED_QUESTIONS = [
  "Best fertilizer for Soyabean?",
  "Prevent pests in Cotton?",
  "Price of Tur?",
];

const AskKrishiMitra = () => {
  const [messages, setMessages] = useState<{ role: 'user' | 'bot', text: string }[]>([]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: 'user', text: input }]);
    setInput("");
  };

  return (
    <div className="flex flex-col h-full w-full min-w-[100px] mx-auto bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-recommendation p-4 border-b border-black text-white font-bold text-lg">
        Ask KrishiMitra
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-lg text-gray-500 mt-10">Start a conversation!</div>
        )}
        {messages.map((msg, idx) => (
          <div key={idx} className={`p-3 rounded-lg max-w-[85%] ${msg.role === 'user' ? 'ml-auto bg-alert-amber/20' : 'bg-gray-100'}`}>
            {msg.text}
          </div>
        ))}
      </div>

      {/* Suggested Questions Block - Hidden on very small screens, wraps on larger */}
      <div className="hidden sm:block p-4 border-t border-gray-100">
        <p className="text-lg font-semibold text-gray-500 uppercase mb-2">Suggested:</p>
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
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <button 
          onClick={handleSend}
          className="bg-alert-amber text-black font-bold px-4 py-2 rounded-md hover:bg-alert-amber/80"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default AskKrishiMitra;