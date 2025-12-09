"use client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const Root = () => {
  const router = useRouter();

  useEffect(() => {
    if (router) {
      if (typeof window != "undefined" && localStorage.getItem("accessToken")) {
        router.push("/dashboard/home");
      } else router.push("/login");
    }
  }, [router]);

  return null;
};

export default Root;
