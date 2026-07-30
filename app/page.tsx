"use client";

import React from "react";
import { ThemeProvider } from "@/ui/Themecontext";
import Header from "@/layouts/Header";
import DesignerDesktop from "@/ui/Designerdesktop";


export default function Page() {
  return (
    <ThemeProvider>
      <Header />
      <DesignerDesktop />
    </ThemeProvider>
  );
}