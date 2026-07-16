"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { LoginForm } from "@/src/types/sidebarItems";
import { useAppDispatch } from "@/src/redux/hooks";
import { getUser, sendUser } from "@/src/features/Auth/authSlice";
import { login } from "@/src/services/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    let loginData = await login(data);
    if (loginData?.token) {
      localStorage?.setItem("CurrentToken", loginData.token);
      dispatch(getUser(loginData.user));
      router.push("/dashboard");
    } else {
      alert("Login Failed");
    }

    // dispatch(getUser(data))
  };
  
  return (
    <main className="w-full min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl bg-advisory border-2 border-black p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-black text-center">
          Welcome Back
        </h1>

        <p className="text-black/80 text-center mt-2">Login to continue</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-8">
          <div>
            <input
              type="email"
              placeholder="Email"
              {...register("email", {
                required: "Email is required",
              })}
              className="w-full  border-2 border-black rounded-xl bg-white px-4 py-3 text-gray-800 placeholder:text-gray-500 outline-none  focus:border-recommendation transition-colors"
            />
            <p className="text-alert-red text-sm mt-1">
              {errors.email?.message}
            </p>
          </div>

          <div>
            <input
              type="mobile"
              placeholder="Mobile"
              {...register("mobile", {
                required: "Password is required",
              })}
              className="w-full border-2 border-black rounded-xl bg-white px-4 py-3 text-gray-800 placeholder:text-gray-500 outline-none  focus:border-recommendation transition-colors"
            />
            <p className="text-alert-red text-sm mt-1">
              {errors.mobile?.message}
            </p>
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              {...register("password", {
                required: "Password is required",
              })}
              className="w-full border-2 border-black rounded-xl bg-white px-4 py-3 text-gray-800 placeholder:text-gray-500 outline-none  focus:border-recommendation transition-colors"
            />
            <p className="text-alert-red text-sm mt-1">
              {errors.password?.message}
            </p>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-recommendation py-3 font-semibold text-white transition hover:brightness-110"
          >
            Login
          </button>
        </form>

        <p className="text-center text-black/80 mt-6">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-recommendation hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </main>
  );
}
