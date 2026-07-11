"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Spinner from "@/src/assets/Spinner.gif";
import Image from "next/image";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("CurrentToken");

    if (token) {
      router.replace("/dashboard");
    } else {
      router.replace("/login");
    }
  }, [router]);

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <Image
        src={Spinner}
        alt={"Loading..."}
        width={120}
        height={120}
        priority
      />
    </div>
  );
}
