"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { FarmHistory } from "../types/farmer";
import {
  addFarmHistory,
  getFarmHistory,
  updateFarmHistory,
} from "../services/FarmerHistory";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setFarmHistory } from "../features/FarmHistory/FarmHistrySlice";

type Props = {
  modalOpen: boolean;
  farmHistoryData: FarmHistory;
  onClose: () => void;
};

const FarmHistoryModal = ({ modalOpen, onClose, farmHistoryData }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FarmHistory>();

  const dispatch = useAppDispatch();

  const onSubmitForm = async (data: FarmHistory) => {
    let res;
    if (data?.id) {
      res = await updateFarmHistory(data, data?.id);
    } else{
      res = await addFarmHistory(data);
    }
    if (res) {
      toast.success(res?.message);
      let getData = await getFarmHistory();
      if (getData) {
        dispatch(setFarmHistory(getData?.data));
      }
    } else {
      toast.success("Could not post your data, try again");
    }
    reset();
    onClose();
  };

  useEffect(() => {
    if (farmHistoryData) {
      reset(farmHistoryData);
    }
  }, [farmHistoryData, reset]);

  if (!modalOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-2xl rounded-md border border-black bg-advisory p-6">
        <h2 className="mb-6 text-2xl font-semibold text-recommendation">
          Farm History
        </h2>

        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4 ">
          <div>
            <input
              type="text"
              placeholder="Crop Name"
              className="w-full rounded-md border p-2"
              {...register("crop", {
                required: "Crop Name is required",
              })}
            />
            {errors.crop && (
              <p className="mt-1 text-sm text-red-500">{errors.crop.message}</p>
            )}
          </div>

          <div>
            <input
              type="text"
              placeholder="Season"
              className="w-full rounded-md border p-2"
              {...register("season", {
                required: "Season is required",
              })}
            />
            {errors.season && (
              <p className="mt-1 text-sm text-red-500">
                {errors.season.message}
              </p>
            )}
          </div>

          <div>
            <input
              type="text"
              placeholder="Yield"
              className="w-full rounded-md border p-2"
              {...register("cropYield", {
                required: "Yield is required",
              })}
            />
            {errors.cropYield && (
              <p className="mt-1 text-sm text-red-500">
                {errors.cropYield.message}
              </p>
            )}
          </div>

          <div>
            <input
              type="number"
              placeholder="Price"
              className="w-full rounded-md border p-2"
              {...register("price", {
                required: "Price is required",
                valueAsNumber: true,
              })}
            />
            {errors.price && (
              <p className="mt-1 text-sm text-red-500">
                {errors.price.message}
              </p>
            )}
          </div>

          <div>
            <input
              type="number"
              placeholder="Earned"
              className="w-full rounded-md border p-2"
              {...register("earned", {
                required: "Earned is required",
                valueAsNumber: true,
              })}
            />
            {errors.earned && (
              <p className="mt-1 text-sm text-red-500">
                {errors.earned.message}
              </p>
            )}
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border-2 border-recommendation bg-gray-300 px-4 py-2 hover:bg-gray-400"
            >
              Close
            </button>

            <button
              type="submit"
              className="rounded-md bg-recommendation px-4 py-2 text-white hover:bg-black/80"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
};

export default FarmHistoryModal;
