"use client";

import { useRouter } from "next/navigation";
import styles from "./page.module.scss";
import { useEffect } from "react";
import paths from "@/paths";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push(paths.dashboard.bookImport);
  }, [router]);

  return null;
}
