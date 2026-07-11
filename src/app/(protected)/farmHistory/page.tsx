"use client";

import FarmHistoryModal from "@/src/components/FarmHistoryModal";
import { setFarmHistory } from "@/src/features/FarmHistory/FarmHistrySlice";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { RootState } from "@/src/redux/store";
import {
  deleteFarmHistory,
  getAFarmHistory,
  getFarmHistory,
} from "@/src/services/FarmerHistory";
import { FarmHistory as FarmHistoryType } from "@/src/types/farmer";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const FarmHistory = () => {
  const [modal, setModalOpen] = useState(false);
  const dispatch = useAppDispatch();

  const [farmHistoryData, setFarmHistoryData] = useState<FarmHistoryType>({
    crop: "",
    season: "",
    cropYield: "",
    price: 0,
    earned: 0,
    // createdAt: null,
  });

  const farmHistory = useAppSelector(
    (state: RootState) => state.farmHistory.farmHistoryDataArray,
  );

  const handleDelete = async (id: string) => {
    const deleteResponse = await deleteFarmHistory(id);
    if (deleteResponse) {
      let getData = await getFarmHistory();
      if (getData) {
        dispatch(setFarmHistory(getData?.data));
      }
      toast.success("The record has been deleted");
    } else {
      toast.error("Could not delete your data, try again");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      let getData = await getFarmHistory();
      if (getData) {
        dispatch(setFarmHistory(getData?.data));
      } else {
        toast.error("Could Not fetch data");
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-full flex flex-col p-4 md:p-6 bg-advisory min-h-screen">
      <div className="w-full mb-6 flex flex-col md:flex-row justify-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-black">Farm Details</h1>
        </div>
        <div>
          <button
            className="bg-recommendation p-3 rounded-md text-white font-medium "
            onClick={() => {
              setModalOpen(true);
            }}
          >
            + New Crop
          </button>
        </div>
      </div>

      <div className="w-full border border-black rounded-xl overflow-hidden shadow-lg bg-white p-4">
        <div className="p-4 border-b border-black bg-white">
          <h2 className="text-2xl font-semibold text-black">Crop Records</h2>
        </div>

        <div className="lg:hidden rounded-xl grid grid-cols-1 sm:grid-cols-2 gap-4  p-5 shadow-md transition hover:shadow-xl ">
          <div className="col-span-1 sm:col-span-2 bg-advisory border rounded-md p-3">
            <div className="flex flex-col sm:flex-row justify-between">
              {farmHistory?.map((data) => {
                return (
                  <>
                    <div className="flex flex-1 flex-col" key={data?.crop}>
                      <div className="flex flex-col gap-2">
                        <h2 className="text-xl sm:text-2xl font-medium">
                          {data?.cropYield}/{"q"}
                        </h2>
                        <p className="text-lg sm:text-xl font-medium bg-green-700 p-1 text-white rounded-xl text-center w-fit">
                          {data?.season}
                        </p>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2 whitespace-nowrap">
                        <h2 className="text-md sm:text-xl font-medium">
                          Planted On:{" "}
                        </h2>
                        <p className="text-md text-medium">
                          {data?.createdAt
                            ? new Date(data.createdAt).toLocaleDateString()
                            : ""}
                        </p>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2 whitespace-nowrap">
                        <h2 className="text-md sm:text-xl font-medium">
                          Price:{" "}
                        </h2>
                        <p className="text-md text-medium">{"₹"}{data?.price}</p>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2 whitespace-nowrap">
                        <h2 className="text-md sm:text-xl font-medium">
                          Earned :{" "}
                        </h2>
                        <p className="text-md text-medium">{"₹"}{data?.earned}</p>
                      </div>
                    </div>
                    <div className=" mt-5 flex-1 flex flex-col sm:flex-row gap-3 h-12.5">
                      <button
                        className="flex-1 rounded-md bg-blue-100 py-2 text-blue-700 hover:bg-blue-200 p-3"
                        onClick={() => {
                          setFarmHistoryData(data);
                          setModalOpen(true);
                        }}
                      >
                        Edit
                      </button>

                      <button
                        className="flex-1 rounded-md bg-red-100 py-2 text-red-700 hover:bg-red-200 p-3"
                        onClick={() => {
                          handleDelete(data?.id || "");
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                );
              })}
              {/* <div className="flex flex-1 flex-col">
                <div className="flex flex-col gap-2">
                  <h2 className="text-xl sm:text-2xl font-medium">Soyabean</h2>
                  <p className="text-lg sm:text-xl font-medium bg-green-700 p-1 text-white rounded-xl text-center w-fit">
                    Kharif
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 whitespace-nowrap">
                  <h2 className="text-md sm:text-xl font-medium">
                    Planted On:{" "}
                  </h2>
                  <p className="text-md text-medium">03-03-2026 </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 whitespace-nowrap">
                  <h2 className="text-md sm:text-xl font-medium">Price: </h2>
                  <p className="text-md text-medium">Rs 4800</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 whitespace-nowrap">
                  <h2 className="text-md sm:text-xl font-medium">Earned : </h2>
                  <p className="text-md text-medium">Rs 48000</p>
                </div>
              </div>
              <div className=" mt-5 flex-1 flex flex-col sm:flex-row gap-3 h-12.5">
                <button
                  className="flex-1 rounded-md bg-blue-100 py-2 text-blue-700 hover:bg-blue-200 p-3"
                  onClick={() => setModalOpen(true)}
                >
                  Edit
                </button>

                <button className="flex-1 rounded-md bg-red-100 py-2 text-red-700 hover:bg-red-200 p-3">
                  Delete
                </button>
              </div> */}
            </div>
          </div>
        </div>

        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-recommendation text-advisory">
              <tr>
                <th className="p-4 font-bold uppercase text-lg tracking-wider">
                  Year
                </th>
                <th className="p-4 font-bold uppercase text-lg tracking-wider">
                  Crop
                </th>
                <th className="p-4 font-bold uppercase text-lg tracking-wider">
                  Season
                </th>
                <th className="p-4 font-bold uppercase text-lg tracking-wider">
                  Yield
                </th>
                <th className="p-4 font-bold uppercase text-lg tracking-wider">
                  Price
                </th>
                <th className="p-4 font-bold uppercase text-lg tracking-wider">
                  Earned
                </th>
                <th className="p-4 font-bold uppercase text-lg tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {farmHistory?.map((data) => {
                return (
                  <tr
                    className="hover:bg-gray-50 transition-colors"
                    key={data?.crop}
                  >
                    <td className="p-4 text-lg font-medium text-gray-800">
                      {data?.createdAt
                        ? new Date(data.createdAt).toLocaleDateString()
                        : ""}
                    </td>
                    <td className="p-4 text-lg font-medium text-gray-800">
                      {data?.crop}
                    </td>
                    <td className="p-4 text-lg text-gray-600">
                      {data?.season}
                    </td>
                    <td className="p-4 text-lg text-recommendation font-bold">
                      {data?.cropYield}/{"q"}
                    </td>
                    <td className="p-4 text-lg text-gray-800 font-semibold">
                      {"₹"}{data?.price}
                    </td>
                    <td className="p-4 text-lg text-gray-800 font-semibold">
                      {"₹"}{data?.earned}
                    </td>
                    <td className="p-4 text-lg text-gray-800 font-semibold">
                      <div className="flex items-center gap-2">
                        <button
                          className="text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 px-2 py-1 rounded transition-colors"
                          onClick={() => {
                            setFarmHistoryData(data);
                            setModalOpen(true);
                          }}
                        >
                          Edit
                        </button>

                        <button
                          className="text-sm bg-red-100 hover:bg-red-200 text-red-700 px-2 py-1 rounded transition-colors"
                          onClick={() => {
                            handleDelete(data?.id || "");
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {/* <tr className="hover:bg-gray-50 transition-colors">
                <td className="p-4 text-lg font-medium text-gray-800">
                  03-03-2026
                </td>
                <td className="p-4 text-lg font-medium text-gray-800">
                  Soyabean
                </td>
                <td className="p-4 text-lg text-gray-600">Kharif 2025</td>
                <td className="p-4 text-lg text-recommendation font-bold">
                  94%
                </td>
                <td className="p-4 text-lg text-gray-800 font-semibold">
                  ₹4800
                </td>
                <td className="p-4 text-lg text-gray-800 font-semibold">
                  ₹280000
                </td>
                <td className="p-4 text-lg text-gray-800 font-semibold">
                  <div className="flex items-center gap-2">
                    <button
                      className="text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 px-2 py-1 rounded transition-colors"
                      onClick={() => {
                        setModalOpen(true);
                      }}
                    >
                      Edit
                    </button>

                    <button className="text-sm bg-red-100 hover:bg-red-200 text-red-700 px-2 py-1 rounded transition-colors">
                      Delete
                    </button>
                  </div>
                </td>
              </tr> */}
              {/* Add more rows here */}
            </tbody>
          </table>
        </div>
      </div>
      {modal && (
        <FarmHistoryModal
          modalOpen={modal}
          farmHistoryData={farmHistoryData}
          onClose={() => {
            setModalOpen((prev) => !prev);
          }}
        />
      )}
    </div>
  );
};

export default FarmHistory;
