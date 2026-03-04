"use client";

import { useEffect } from "react";
import router from "next/router";

export default function Home() {
  useEffect(() => {
    router.push("/form");
  }, []);
  return <></>;
}
