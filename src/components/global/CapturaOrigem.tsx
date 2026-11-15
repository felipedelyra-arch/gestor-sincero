"use client";

import { useEffect } from "react";
import { capturarOrigem } from "./origem";

export function CapturaOrigem() {
  useEffect(() => {
    capturarOrigem(window.location.search);
  }, []);
  return null;
}
