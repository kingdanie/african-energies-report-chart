import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { ThemeProvider } from "@/components/theme-provider";
import Commodities from "./components/Commodities";
import BasketPrices from "./components/BasketPrices";

// Mount main app if container exists
const el = document.getElementById("myplugin-frontend");

if (el) {
  ReactDOM.createRoot(el).render(
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <React.StrictMode>
        <RouterProvider router={router} />
      </React.StrictMode>
    </ThemeProvider>,
  );
}

// Mount shortcode components
document.addEventListener("DOMContentLoaded", () => {
  // Mount commodities shortcode
  const commoditiesContainers = document.querySelectorAll(".aer-commodities-container");
  commoditiesContainers.forEach((container) => {
    const root = ReactDOM.createRoot(container);
    root.render(
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <React.StrictMode>
          <Commodities />
        </React.StrictMode>
      </ThemeProvider>
    );
  });

  // Mount basket prices shortcode
  const basketPricesContainers = document.querySelectorAll(".aer-basket-prices-container");
  basketPricesContainers.forEach((container) => {
    const root = ReactDOM.createRoot(container);
    root.render(
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <React.StrictMode>
          <BasketPrices />
        </React.StrictMode>
      </ThemeProvider>
    );
  });
});
