import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryProvider } from "@/lib/query-client-provider";
import { Toaster } from "@/components/ui/sonner";

const el = document.getElementById("myplugin");

if (el) {
  ReactDOM.createRoot(el).render(
    <QueryProvider>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <React.StrictMode>
          <RouterProvider router={router} />
          <Toaster />
        </React.StrictMode>
      </ThemeProvider>
    </QueryProvider>,
  );
}
