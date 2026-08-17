"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { RegisterForm } from "@/src/types/sidebarItems";
import { login, Register } from "@/src/services/auth";
import { getUser } from "@/src/features/Auth/authSlice";
import { useAppDispatch } from "@/src/redux/hooks";
import { useRouter } from "next/navigation";
import {
  getSoilDetailsForFarmersLand,
  postTheSoilData,
} from "@/src/services/Dashboard";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { getCoords } from "@/src/components/CurrentLocation";
import Image from "next/image";
import krishimitraLogo from "@/src/assets/Logo.png"

export default function RegisterPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [cords, setCords] = useState({ latitude: 0, longitude: 0 });
  const [error, setError] = useState({});
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>();

  const password = watch("password");

  useEffect(() => {
    getCoords(setCords, setError);
  }, []);

  const onSubmit = async (data: RegisterForm) => {
    const payload = {
      ...data,
      latitude: 26.5492,
      longtitude: 81.045,
    };

    try {
      const registerData = await Register(payload);

      if (!registerData?.token) {
        toast.error("Registration failed");
        return;
      }

      localStorage.setItem("CurrentToken", registerData.token);
      dispatch(getUser(registerData.user));

      const soilResponse = await getSoilDetailsForFarmersLand(
        registerData.user.latitude,
        registerData.user.longtitude,
      );

      const layers = soilResponse.properties.layers;

      const getLayerValue = (name: string): number | null => {
        const layer = layers.find((l: any) => l.name === name);

        if (!layer) return null;

        const value = layer.depths?.[0]?.values?.["Q0.5"];

        if (value == null) return null;

        return value / layer.unit_measure.d_factor;
      };

      const sand = getLayerValue("sand");
      const silt = getLayerValue("silt");
      const clay = getLayerValue("clay");
      const soc = getLayerValue("soc");
      const nitrogen = getLayerValue("nitrogen");
      const cec = getLayerValue("cec");
      const ph = getLayerValue("phh2o");
      const coarseFragments = getLayerValue("cfvo");

      // Determine soil type
      let soilType = "Loam";

      if (clay !== null && clay >= 40) {
        soilType = "Clay";
      } else if (sand !== null && sand >= 70) {
        soilType = "Sandy";
      } else if (silt !== null && silt >= 80) {
        soilType = "Silty";
      }

      // Fertility Score (0-100)
      let score = 0;

      if (soc !== null) {
        score += soc >= 20 ? 3 : soc >= 10 ? 2 : 1;
      }

      if (nitrogen !== null) {
        score += nitrogen >= 2 ? 3 : nitrogen >= 1 ? 2 : 1;
      }

      if (cec !== null) {
        score += cec >= 25 ? 3 : cec >= 10 ? 2 : 1;
      }

      if (ph !== null) {
        score += ph >= 6 && ph <= 7.5 ? 3 : ph >= 5.5 && ph <= 8 ? 2 : 1;
      }

      const fertilityLevel = Math.round((score / 12) * 100);

      const soilPayload = {
        soilType,
        fertilityLevel,
        soilPH: ph,
        organicCarbon: soc,
        clayPercentage: clay,
        sandPercentage: sand,
        siltPercentage: silt,
        cationExchangeCapacity: cec,
        nitrogen,
        bulkDensity: null,
        coarseFragments,
        apiProvider: "ISRIC SoilGrids",
      };

      const saveResponse = await postTheSoilData(
        soilPayload,
        registerData.token,
      );

      if (saveResponse?.status === 200) {
        toast.success(saveResponse.message);
      }

      router.push("/dashboard");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong.",
      );
    }
  };

  return (
    <main className="w-full min-h-screen bg-bg px-4 py-10 ">
      <div className="mx-auto w-full max-w-5xl rounded-3xl bg-advisory shadow-2xl p-8 md:p-10 overflow-y-auto overflow-x-hidden max-h-[90vh]">
        <h1 className="text-3xl font-bold text-black text-center">
          Create Account
        </h1>
        <div className="w-full flex items-center-safe justify-center-safe m-2">
          <Image
            src={krishimitraLogo}
            alt="KrishMitra Logic"
            width={45}
            height={50}
          />
        </div>
        <p className="text-black/80 text-center mt-2">
          Register to get started
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2"
        >
          {/* Full Name */}
          <div className="md:col-span-1">
            <input
              type="text"
              placeholder="Full Name"
              {...register("name", {
                required: "Name is required",
              })}
              className="w-full rounded-xl bg-white px-4 py-3 text-gray-800 placeholder:text-gray-500 outline-none border-2 border-black focus:border-recommendation transition-colors"
            />
            <p className="text-alert-red text-sm mt-1">
              {errors.name?.message}
            </p>
          </div>

          {/* Mobile */}
          <div className="md:col-span-1">
            <input
              type="tel"
              placeholder="Mobile Number"
              {...register("mobile", {
                required: "Mobile number is required",
                pattern: {
                  value: /^[6-9]\d{9}$/,
                  message: "Enter a valid mobile number",
                },
              })}
              className="w-full rounded-xl bg-white px-4 py-3 text-gray-800 placeholder:text-gray-500 outline-none border-2 border-black focus:border-recommendation transition-colors"
            />
            <p className="text-alert-red text-sm mt-1">
              {errors.mobile?.message}
            </p>
          </div>

          {/* Email */}
          <div className="md:col-span-1">
            <input
              type="email"
              placeholder="Email"
              {...register("email")}
              className="w-full rounded-xl bg-white px-4 py-3 text-gray-800 placeholder:text-gray-500 outline-none border-2 border-black focus:border-recommendation transition-colors"
            />
            <p className="text-alert-red text-sm mt-1">
              {errors.email?.message}
            </p>
          </div>

          {/* State */}
          <div className="md:col-span-1">
            <input
              type="text"
              placeholder="State"
              {...register("state", {
                required: "State is required",
              })}
              className="w-full rounded-xl bg-white px-4 py-3 text-gray-800 placeholder:text-gray-500 outline-none border-2 border-black focus:border-recommendation transition-colors"
            />
            <p className="text-alert-red text-sm mt-1">
              {errors.state?.message}
            </p>
          </div>

          {/* District */}
          <div className="md:col-span-1">
            <input
              type="text"
              placeholder="District"
              {...register("district", {
                required: "District is required",
              })}
              className="w-full rounded-xl bg-white px-4 py-3 text-gray-800 placeholder:text-gray-500 outline-none border-2 border-black focus:border-recommendation transition-colors"
            />
            <p className="text-alert-red text-sm mt-1">
              {errors.district?.message}
            </p>
          </div>

          {/* Pincode */}
          <div className="md:col-span-1">
            <input
              type="text"
              placeholder="Pincode"
              {...register("pincode", {
                required: "Pincode is required",
                pattern: {
                  value: /^\d{6}$/,
                  message: "Enter a valid 6-digit pincode",
                },
              })}
              className="w-full rounded-xl bg-white px-4 py-3 text-gray-800 placeholder:text-gray-500 outline-none border-2 border-black focus:border-recommendation transition-colors"
            />
            <p className="text-alert-red text-sm mt-1">
              {errors.pincode?.message}
            </p>
          </div>

          {/* Farmer Type */}
          <div className="md:col-span-1">
            <select
              {...register("farmerType", {
                required: "Select farmer type",
              })}
              className="w-full rounded-xl bg-white px-4 py-3 text-gray-800 outline-none border-2 border-black focus:border-recommendation transition-colors"
            >
              <option value="">Select Farmer Type</option>
              <option value="Marginal">Marginal</option>
              <option value="Small">Small</option>
              <option value="Semi-Medium">Semi-Medium</option>
              <option value="Medium">Medium</option>
              <option value="Large">Large</option>
            </select>
            <p className="text-alert-red text-sm mt-1">
              {errors.farmerType?.message}
            </p>
          </div>

          {/* Land Holding */}
          <div className="md:col-span-1">
            <input
              type="number"
              step="0.01"
              placeholder="Land Holding (Acres)"
              {...register("landHolding", {
                valueAsNumber: true,
              })}
              className="w-full rounded-xl bg-white px-4 py-3 text-gray-800 placeholder:text-gray-500 outline-none border-2 border-black focus:border-recommendation transition-colors"
            />
          </div>

          {/* Primary Crop */}
          <div className="md:col-span-1">
            <input
              type="text"
              placeholder="Primary Crop"
              {...register("primaryCrop")}
              className="w-full rounded-xl bg-white px-4 py-3 text-gray-800 placeholder:text-gray-500 outline-none border-2 border-black focus:border-recommendation transition-colors"
            />
          </div>

          {/* Aadhaar */}
          <div className="md:col-span-1">
            <input
              type="text"
              // maxLength={12}
              placeholder="Aadhaar Number"
              {...register("aadharHash", {
                required: "Aadhaar number is required",
                // pattern: {
                //   value: /^\d{12}$/,
                //   message: "Aadhaar must be 12 digits",
                // },
              })}
              className="w-full rounded-xl bg-white px-4 py-3 text-gray-800 placeholder:text-gray-500 outline-none border-2 border-black focus:border-recommendation transition-colors"
            />
            <p className="text-alert-red text-sm mt-1">
              {errors.aadharHash?.message}
            </p>
          </div>

          {/* Password */}
          <div className="md:col-span-1">
            <input
              type="password"
              placeholder="Password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Minimum 6 characters",
                },
              })}
              className="w-full rounded-xl bg-white px-4 py-3 text-gray-800 placeholder:text-gray-500 outline-none border-2 border-black focus:border-recommendation transition-colors"
            />
            <p className="text-alert-red text-sm mt-1">
              {errors.password?.message}
            </p>
          </div>

          {/* Confirm Password */}
          {/* <div className="md:col-span-1">
            <input
              type="password"
              placeholder="Confirm Password"
              {...register("confirmPassword", {
                required: "Confirm your password",
                validate: (value) =>
                  value === watch("password") || "Passwords do not match",
              })}
              className="w-full rounded-xl bg-white px-4 py-3 text-gray-800 placeholder:text-gray-500 outline-none border-2 border-black focus:border-recommendation transition-colors"
            />
            <p className="text-alert-red text-sm mt-1">
              {errors.confirmPassword?.message}
            </p>
          </div> */}

          <div className="w-full flex items-center justify-end md:col-span-2">
            <button
              type="submit"
              className="w-full rounded-xl bg-recommendation py-3 font-semibold text-white transition hover:brightness-110"
            >
              Register
            </button>
          </div>
        </form>

        <p className="text-center text-black/80 mt-6">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-recommendation hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}
