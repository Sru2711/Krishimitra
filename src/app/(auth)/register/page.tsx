"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { RegisterForm } from "@/src/types/sidebarItems";
import { login, Register } from "@/src/services/auth";
import { getUser } from "@/src/features/Auth/authSlice";
import { useAppDispatch } from "@/src/redux/hooks";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>();

  const password = watch("password");

  const onSubmit = async (data: RegisterForm) => {
    console.log(data);
    let registerData = await Register(data);
    if (registerData?.token) {
      localStorage.setItem("CurrentToken", registerData.token);
      dispatch(getUser(registerData.user));
      router.push("/dashboard");
    } else {
      alert("Registration failed");
    }
  };

  return (
    <main className="w-full min-h-screen bg-bg px-4 py-10 ">
      <div className="mx-auto w-full max-w-5xl rounded-3xl bg-advisory shadow-2xl p-8 md:p-10 overflow-y-auto max-h-[90vh]">
        <h1 className="text-3xl font-bold text-black text-center">
          Create Account
        </h1>

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
