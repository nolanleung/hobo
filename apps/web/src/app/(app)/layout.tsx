"use client";

import { QueryProvider } from "@/providers/trpc-provider";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return <QueryProvider>{children}</QueryProvider>;
}
