import { createHashRouter } from "react-router-dom";
import ApplicationLayout from "../components/application-layout/LayoutOne";
import ErrorPage from "./pages/error/Error";
import Dashboard from "./pages/dashboard";
import Commodities from "./pages/commodities";
import BasketPrices from "./pages/basket-prices";
import Countries from "./pages/countries";

export const router = createHashRouter([
  {
    path: "/",
    element: <ApplicationLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "commodities",
        element: <Commodities />,
      },
      {
        path: "basket-prices",
        element: <BasketPrices />,
      },
      {
        path: "countries",
        element: <Countries />,
      }
    ],
  },
]);
