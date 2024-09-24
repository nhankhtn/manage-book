"use client";

import { useRouter } from "next/navigation";
import styles from "./page.module.scss";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/book-import");
  }, [router]);

  return null;
}
/*
/
/book-import
/book-import/bao

*/