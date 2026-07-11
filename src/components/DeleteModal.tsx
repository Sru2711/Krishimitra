"use client";

import React from "react";
import { deleteFarmerProfile } from "../services/FarmerProfile";
import { useRouter } from "next/navigation";
import { logout } from "../features/Auth/authSlice";
import { useAppDispatch } from "../redux/hooks";

type Props = {
  showDeleteModal: boolean;
  onClose: () => void;
};
const DeleteModal: React.FC<Props> = ({ showDeleteModal, onClose }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleDelete = async () => {
    try {
      const response = await deleteFarmerProfile();

      if (response.status === 200) {
        localStorage.removeItem("CurrentToken");

        dispatch(logout());

        router.replace("/login");
      }
    } catch (error) {
      alert(`Could not delete profile ${error}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/45 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl  bg-advisory  font-normal flex flex-col rounded-md gap-2 p-6">
        <span className="text-black text-xl">
          Are you sure you want to delete your account?
        </span>
        <span>Note: This will permanently delete your account!</span>
        <span></span>
        <div className="w-full flex justify-end gap-6">
          <button
            className="w-30 md:w-40 bg-recommendation p-3 text-white hover:bg-advisory hover:text-black hover:border border-black rounded-md"
            onClick={handleDelete}
          >
            Yes,Delete
          </button>
          <button
            className="w-30 md:w-40 bg-recommendation p-3 text-white hover:bg-advisory hover:text-black hover:border border-black rounded-md"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
