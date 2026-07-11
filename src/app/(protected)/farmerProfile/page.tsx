"use client";
import { getUser } from "@/src/features/Auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { updateFarmerProfile } from "@/src/services/FarmerProfile";
import { FarmerProfileState } from "@/src/types/sidebarItems";
import React, { useEffect, useState } from "react";
import { Form, useForm, useFormState } from "react-hook-form";
import { Farmer } from "../../../generated/prisma/browser";
import { farmerUpdateProfile } from "@/src/types/farmer";
import DeleteModal from "@/src/components/DeleteModal";

const FarmerProfile = () => {
  const [showDeleteModal,setShowDeleteModal] =useState(false)

  const dispatch = useAppDispatch();
  const userData = useAppSelector((state) => state?.auth?.user);
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FarmerProfileState>();

  const onSubmitForm = async (data: any) => {
    const payload: farmerUpdateProfile = {
      farmerType: data.farmerType,
      landHolding: data.landHolding,
      primaryCrop: data.primaryCrop,
    };
    let userData = await updateFarmerProfile(payload);

    if (userData) {
      dispatch(getUser(userData?.farmer));
    } else {
      return alert("Could not update the profile");
    }
  };

  const handleDelete = () => {
    setShowDeleteModal((prev)=>!prev)
  };

  useEffect(() => {
    if (userData) {
      reset({
        // id: userData.id,
        name: userData.name,
        email: userData.email,
        mobile: userData.mobile,
        state: userData.state,
        district: userData.district,
        pincode: userData.pincode,
        farmerType: userData.farmerType,
        landHolding: userData.landHolding,
        primaryCrop: userData.primaryCrop,
        aadharHash: userData.aadharHash,
        createdAt: userData.createdAt,
        updatedAt: userData.updatedAt,
      });
    }
  }, [userData, reset]);

  return (
    <div className="w-full max-w-7xl mx-auto my-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-recommendation">Your Profile</h1>
      </div>

      <div className="rounded-lg border border-black bg-white p-6 shadow">
        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
          {/* Row 1 */}
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex-1">
              <label className="mb-1 block font-medium">Name</label>
              <input
                {...register("name")}
                readOnly
                className="w-full rounded-md border p-2 read-only:bg-gray-400"
              />
            </div>

            <div className="flex-1">
              <label className="mb-1 block font-medium">Email</label>
              <input
                {...register("email")}
                readOnly
                className="w-full rounded-md border p-2 read-only:bg-gray-400"
              />
            </div>
          </div>

          {/* Row 2 */}
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex-1">
              <label className="mb-1 block font-medium">Mobile</label>
              <input
                {...register("mobile", {
                  required: "Mobile is required",
                })}
                readOnly
                className="w-full rounded-md border p-2 read-only:bg-gray-400"
              />
            </div>

            <div className="flex-1">
              <label className="mb-1 block font-medium">State</label>
              <input
                {...register("state")}
                readOnly
                className="w-full rounded-md border p-2 read-only:bg-gray-400"
              />
            </div>
          </div>

          {/* Row 3 */}
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex-1">
              <label className="mb-1 block font-medium">District</label>
              <input
                {...register("district")}
                readOnly
                className="w-full rounded-md border p-2 read-only:bg-gray-400"
              />
            </div>

            <div className="flex-1">
              <label className="mb-1 block font-medium">Pincode</label>
              <input
                {...register("pincode")}
                readOnly
                className="w-full rounded-md border p-2 read-only:bg-gray-400"
              />
            </div>
          </div>

          {/* Row 4 */}
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex-1">
              <label className="mb-1 block font-medium">Farmer Type</label>
              <select
                {...register("farmerType")}
                className="w-full rounded-md border p-2"
              >
                <option value="">Select Farmer Type</option>
                <option value="Marginal">Marginal</option>
                <option value="Small">Small</option>
                <option value="Semi-Medium">Semi-Medium</option>
                <option value="Medium">Medium</option>
                <option value="Large">Large</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="mb-1 block font-medium">
                Land Holding (Acres)
              </label>
              <input
                type="number"
                {...register("landHolding", {
                  valueAsNumber: true,
                })}
                className="w-full rounded-md border p-2"
              />
            </div>
          </div>

          {/* Row 5 */}
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex-1">
              <label className="mb-1 block font-medium">Primary Crop</label>
              <input
                {...register("primaryCrop")}
                className="w-full rounded-md border p-2"
              />
            </div>

            <div className="flex-1">
              <label className="mb-1 block font-medium">Aadhaar Hash</label>
              <input
                {...register("aadharHash")}
                readOnly
                className="w-full rounded-md border read-only:bg-gray-400  p-2"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-end sm:justify-end">
            <button
              type="submit"
              className="rounded-md bg-recommendation px-6 py-2 text-white hover:bg-black"
              disabled={isSubmitting}
            >
              Save Changes
            </button>
            <button
              type="button"
              className="rounded-md bg-alert-red px-6 py-2 text-white hover:bg-black"
              onClick={()=>{handleDelete()}}
            >
              Delete
            </button>
          </div>
        </form>
      </div>
      {
        showDeleteModal && 
        <DeleteModal 
          showDeleteModal={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
        />
      }
    </div>
  );
};

export default FarmerProfile;
