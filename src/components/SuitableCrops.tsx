"use client";

import React from "react";
import { createPortal } from "react-dom";

type Props = {
  modalOpen: boolean;
  onClose: () => void;
};

// Define your crop data structure here or import it
type CropData = {
  id: number;
  name: string;
  suitability: number;
  marketPrice: number;
  unit: string;
};

const crops: CropData[] = [
  { id: 1, name: "Soyabean", suitability: 94, marketPrice: 4800, unit: "qtl" },
  { id: 2, name: "Cotton", suitability: 88, marketPrice: 7200, unit: "qtl" },
  { id: 3, name: "Tur", suitability: 82, marketPrice: 9500, unit: "qtl" },
  { id: 4, name: "Maize", suitability: 75, marketPrice: 2200, unit: "qtl" },
];

const SuitableCrops: React.FC<Props> = ({ modalOpen, onClose }) => {
  if (!modalOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/45 z-[9999] flex items-center justify-center p-4">
      <div className="bg-advisory border border-black p-4 md:p-6 rounded-lg w-full max-w-xl lg:max-w-3xl max-h-[90vh] overflow-y-auto">
        
        {/* Title Section */}
        <div className="w-full border-black mb-4">
          <h1 className="text-xl md:text-2xl font-semibold">Other Suitable Crops</h1>
        </div>

        {/* Crop Cards Section */}
        <div className="w-full">
          <div className="flex flex-col lg:flex-row gap-4 overflow-x-auto pb-4">
            {crops.map((crop) => (
              <div
                key={crop.id}
                className="bg-[#e7e1d4] border border-black p-4 rounded-xl flex flex-col gap-1 min-w-[150px] shadow-md"
              >
                <h3 className="font-bold text-lg whitespace-nowrap">{crop.name}</h3>
                <p className="font-bold text-recommendation text-xl">{crop.suitability}%</p>
                <p className="text-black font-medium text-sm">
                  ₹{crop.marketPrice} / <span className="text-gray-600">price</span>
                </p>
              </div>
            ))}
          </div>

          {/* Recommended Box */}
          <div className="bg-recommendation p-4 rounded-md mt-4">
            <span className="text-advisory text-lg md:text-xl font-medium uppercase underline block mb-1">
              Why Recommended:
            </span>
            <span className="text-advisory text-base md:text-lg font-semibold leading-snug">
              Versatile legume rich in protein, oil, and essential plant nutrients.
            </span>
          </div>

          {/* Button Section */}
          <div className="w-full flex items-center justify-end mt-6">
            <button
              className="bg-black text-white text-md md:text-lg p-2 w-24 rounded-md font-medium hover:bg-black/70 transition-colors"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default SuitableCrops;