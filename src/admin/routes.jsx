import { createHashRouter } from "react-router-dom";
import ApplicationLayout from "../components/application-layout/LayoutOne";
import Settings from "./pages/settings";
import ErrorPage from "./pages/error/Error";
import Inbox from "./pages/inbox";
import Dashboard from "./pages/dashboard";
import LoginPage from "./pages/login";
import Charts from "./pages/charts";
import Commodities from "./pages/commodities";
import BasketPrices from "./pages/basket-prices";

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
        path: "inbox",
        element: <Inbox />,
      },
     
      {
        path: "settings",
        element: <Settings />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "charts",
        element: <Charts />,
      },
      {
        path: "commodities",
        element: <Commodities />,
      },
      {
        path: "basket-prices",
        element: <BasketPrices />,
      }
    ],
  },
]);
